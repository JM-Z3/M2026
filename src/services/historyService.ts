import AsyncStorage from '@react-native-async-storage/async-storage';
import { FitnessRecipe } from '../types/recipe';

export type HistoryItem = {
  id: string;
  createdAt: string;
  query: string;
  recipe: FitnessRecipe;
};

const STORAGE_KEY = '@m2026/recipe_history_v1';
const MAX_ITEMS = 10;

const readHistory = async (): Promise<HistoryItem[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

const writeHistory = async (items: HistoryItem[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const isDuplicateOfLast = (items: HistoryItem[], next: HistoryItem) => {
  const last = items[0];
  if (!last) return false;
  return last.query === next.query && JSON.stringify(last.recipe) === JSON.stringify(next.recipe);
};

export const getHistory = async (): Promise<HistoryItem[]> => {
  return readHistory();
};

export const addToHistory = async (recipe: FitnessRecipe, query: string): Promise<void> => {
  const existing = await readHistory();
  const next: HistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    query,
    recipe,
  };

  if (isDuplicateOfLast(existing, next)) {
    return;
  }

  const updated = [next, ...existing].slice(0, MAX_ITEMS);
  await writeHistory(updated);
};

export const clearHistory = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};
