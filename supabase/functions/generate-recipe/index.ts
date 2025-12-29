import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

type FitnessRecipe = {
  title: string;
  servings: number;
  total_time_minutes: number;
  ingredients: Array<{ name: string; quantity: string }>;
  steps: string[];
  macros_per_serving: { calories: number; protein_g: number; carbs_g: number; fat_g: number };
};

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
};

const MODEL = 'gemini-2.5-flash';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const buildPrompt = (query: string, stricter = false) => {
  const baseInstructions = `Return ONLY valid JSON (no markdown, no code fences, no explanations).
The JSON MUST match exactly this shape:
{
  "title": string,
  "servings": number,
  "total_time_minutes": number,
  "ingredients": Array<{ "name": string, "quantity": string }>,
  "steps": string[],
  "macros_per_serving": { "calories": number, "protein_g": number, "carbs_g": number, "fat_g": number }
}`;

  const stricterSuffix = `
If you do not produce valid JSON, the request will fail. No extra keys or text.`;

  return `${baseInstructions}
User request: ${query}.${stricter ? stricterSuffix : ''}`;
};

const parseRecipe = (rawText: string): FitnessRecipe | null => {
  const cleaned = rawText.match(/```(?:json)?\\s*([\\s\\S]*?)```/i)?.[1] ?? rawText;
  try {
    const parsed = JSON.parse(cleaned) as FitnessRecipe;
    if (
      parsed &&
      typeof parsed.title === 'string' &&
      Array.isArray(parsed.ingredients) &&
      Array.isArray(parsed.steps) &&
      parsed.macros_per_serving
    ) {
      return parsed;
    }
  } catch (_err) {
    // fallthrough
  }
  return null;
};

const generateWithGemini = async (apiKey: string, query: string, stricter: boolean) => {
  const prompt = buildPrompt(query, stricter);
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return { error: `Gemini failed ${response.status}: ${errorText}` };
    }

    const data = (await response.json()) as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? '';
    return { text };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unexpected Gemini request error' };
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not set' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch (_err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const query = (body as { query?: unknown })?.query;
  if (typeof query !== 'string' || !query.trim()) {
    return new Response(JSON.stringify({ error: 'query must be a non-empty string' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const trimmedQuery = query.trim();

  const firstAttempt = await generateWithGemini(apiKey, trimmedQuery, false);
  if ('error' in firstAttempt) {
    return new Response(JSON.stringify({ error: firstAttempt.error }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const parsedRecipe = firstAttempt.text ? parseRecipe(firstAttempt.text) : null;

  if (!parsedRecipe) {
    const retry = await generateWithGemini(apiKey, trimmedQuery, true);
    if ('error' in retry) {
      return new Response(JSON.stringify({ error: retry.error }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const retriedRecipe = retry.text ? parseRecipe(retry.text) : null;
    if (!retriedRecipe) {
      return new Response(JSON.stringify({ error: 'Model response was not valid JSON' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify(retriedRecipe), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(parsedRecipe), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
