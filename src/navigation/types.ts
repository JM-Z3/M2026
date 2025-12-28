import { FitnessRecipe } from '../types/recipe';

export type HomeStackParamList = {
  Home: undefined;
  IngredientsScan: undefined;
  IngredientsConfirm: undefined;
  Recipe: undefined;
  RecipeSearch: undefined;
  RecipeResult: { recipe: FitnessRecipe };
  Favorites: undefined;
  History: undefined;
  Settings: undefined;
};
