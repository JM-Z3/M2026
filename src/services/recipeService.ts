import { FitnessRecipe } from '../types/recipe';

const getEnv = (key: string) => process.env[key];

const buildFunctionUrl = () => {
  const baseUrl = getEnv('EXPO_PUBLIC_SUPABASE_URL');
  if (!baseUrl) {
    throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL env variable');
  }
  return `${baseUrl.replace(/\/$/, '')}/functions/v1/generate-recipe`;
};

const getAnonKey = () => {
  const anonKey = getEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY');
  if (!anonKey) {
    throw new Error('Missing EXPO_PUBLIC_SUPABASE_ANON_KEY env variable');
  }
  return anonKey;
};

export const fetchRecipe = async (query: string): Promise<FitnessRecipe> => {
  const url = buildFunctionUrl();
  const anonKey = getAnonKey();

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify({ query }),
  });

  const text = await response.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    throw new Error(`Invalid JSON response from recipe service: ${String(error)}`);
  }

  if (!response.ok) {
    const message = ((data as { error?: string })?.error ?? text) || 'Failed to generate recipe';
    throw new Error(message);
  }

  const recipe = data as FitnessRecipe;
  if (
    !recipe ||
    typeof recipe.title !== 'string' ||
    !Array.isArray(recipe.ingredients) ||
    !Array.isArray(recipe.steps) ||
    !recipe.macros_per_serving ||
    !Array.isArray(recipe.notes)
  ) {
    throw new Error('Recipe response was missing required fields');
  }

  return recipe;
};
