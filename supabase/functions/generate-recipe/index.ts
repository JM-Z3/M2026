import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

type FitnessRecipe = {
  title: string;
  servings: number;
  total_time_minutes: number;
  ingredients: Array<{ name: string; quantity: string }>;
  steps: string[];
  macros_per_serving: { calories: number; protein_g: number; carbs_g: number; fat_g: number };
  notes: string[];
};

type OpenRouterResponse = {
  choices?: Array<{
    message?: { content?: string };
  }>;
};

const MODEL = 'deepseek/deepseek-r1-0528:free';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MAX_TOKENS = 600;
const TEMPERATURE = 0.4;
const TIMEOUT_MS = 20_000;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `Respond ONLY with valid JSON. No markdown, no code fences.`;

const extractJsonCandidate = (rawText: string): string => {
  const trimmedStart = rawText.trimStart();
  const fenceMatch = trimmedStart.match(/```(?:json)?\\s*([\\s\\S]*?)```/i);
  const withoutFences = fenceMatch ? fenceMatch[1] : trimmedStart;
  const firstBrace = withoutFences.indexOf('{');
  const lastBrace = withoutFences.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return withoutFences.slice(firstBrace, lastBrace + 1);
  }
  return withoutFences;
};

const parseRecipe = (rawText: string): FitnessRecipe | null => {
  try {
    const candidate = extractJsonCandidate(rawText);
    const parsed = JSON.parse(candidate) as FitnessRecipe;
    if (
      parsed &&
      typeof parsed.title === 'string' &&
      Array.isArray(parsed.ingredients) &&
      Array.isArray(parsed.steps) &&
      parsed.macros_per_serving &&
      Array.isArray(parsed.notes)
    ) {
      return parsed;
    }
  } catch (_err) {
    // fallthrough
  }
  return null;
};

const callOpenRouter = async ({
  apiKey,
  system,
  user,
}: {
  apiKey: string;
  system: string;
  user: string;
}): Promise<{ text?: string; error?: string }> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://supabase.com',
        'X-Title': 'M2026 generate-recipe',
      },
      body: JSON.stringify({
        model: MODEL,
        stream: false,
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      return { error: `OpenRouter failed ${response.status}: ${errorText}` };
    }

    const data = (await response.json()) as OpenRouterResponse;
    const text = data.choices?.[0]?.message?.content?.trimStart() ?? '';
    return { text };
  } catch (error) {
    clearTimeout(timeout);
    return { error: error instanceof Error ? error.message : 'Unexpected OpenRouter request error' };
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

  const apiKey = Deno.env.get('OPENROUTER_API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'OPENROUTER_API_KEY is not set' }), {
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

  const primary = await callOpenRouter({
    apiKey,
    system: systemPrompt,
    user: `Generate a fitness-friendly recipe for: ${trimmedQuery}.
The response MUST be valid JSON matching:
{
  "title": string,
  "servings": number,
  "total_time_minutes": number,
  "ingredients": Array<{ "name": string, "quantity": string }>,
  "steps": string[],
  "macros_per_serving": { "calories": number, "protein_g": number, "carbs_g": number, "fat_g": number },
  "notes": string[]
}`,
  });

  if ('error' in primary && primary.error) {
    return new Response(JSON.stringify({ error: primary.error }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const parsedPrimary = primary.text ? parseRecipe(primary.text) : null;

  if (!parsedPrimary) {
    return new Response(JSON.stringify({ error: 'Model response was not valid JSON' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(parsedPrimary), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
