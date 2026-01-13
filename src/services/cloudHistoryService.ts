import { supabase, supabaseEnvError } from './supabaseClient';
import { FitnessRecipe } from '../types/recipe';

export type CloudHistoryItem = {
  id: string;
  createdAt: string;
  query: string;
  recipe: FitnessRecipe;
};

const normalizeQuery = (q: string) => q.trim().toLowerCase().replace(/\s+/g, ' ');

const ensureClient = () => {
  if (supabaseEnvError || !supabase) {
    throw new Error(supabaseEnvError ?? 'Supabase client is not available.');
  }
  return supabase;
};

const getUserId = async () => {
  const client = ensureClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) {
    throw new Error(error?.message ?? 'User not authenticated.');
  }
  return data.user.id;
};

export const saveRecipeToCloud = async (query: string, recipe: FitnessRecipe) => {
  const client = ensureClient();
  const userId = await getUserId();
  const normalized = normalizeQuery(query);

  const { data: lastData, error: lastError } = await client
    .from('recipe_history')
    .select('id, query')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!lastError && lastData && normalizeQuery(lastData.query) === normalized) {
    return;
  }

  const { error: insertError } = await client.from('recipe_history').insert({
    user_id: userId,
    query,
    recipe_json: recipe,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }

  await client.rpc('prune_recipe_history', { limit_count: 10 }).catch(() => {
    // Ignore prune errors to avoid blocking the user flow.
  });
};

export const getCloudHistory = async (): Promise<CloudHistoryItem[]> => {
  const client = ensureClient();
  const userId = await getUserId();

  const { data, error } = await client
    .from('recipe_history')
    .select('id, query, recipe_json, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(error.message);
  }

  return (
    data?.map((item) => ({
      id: item.id,
      query: item.query,
      createdAt: item.created_at,
      recipe: item.recipe_json as FitnessRecipe,
    })) ?? []
  );
};

export const clearCloudHistory = async () => {
  const client = ensureClient();
  const userId = await getUserId();
  const { error } = await client.from('recipe_history').delete().eq('user_id', userId);
  if (error) {
    throw new Error(error.message);
  }
};
