export type FitnessRecipe = {
  title: string;
  servings: number;
  total_time_minutes: number;
  ingredients: Array<{
    name: string;
    quantity: string;
  }>;
  steps: string[];
  macros_per_serving: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  };
  notes: string[];
};
