import { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  Home: undefined;
  IngredientsScan: undefined;
  IngredientsConfirm: undefined;
  Recipe: undefined;
};

export type TabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  Favorites: undefined;
  History: undefined;
  Settings: undefined;
};
