import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import RecipeSearchScreen from '../screens/RecipeSearchScreen';
import RecipeResultScreen from '../screens/RecipeResultScreen';
import IngredientsConfirmScreen from '../screens/IngredientsConfirmScreen';
import IngredientsScanScreen from '../screens/IngredientsScanScreen';
import RecipeScreen from '../screens/RecipeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { HomeStackParamList } from './types';

type HomeStackNavigatorProps = {
  onLogout: () => Promise<void> | void;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator: React.FC<HomeStackNavigatorProps> = ({ onLogout }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="RecipeSearch" component={RecipeSearchScreen} options={{ title: 'Fitness recipe' }} />
      <Stack.Screen name="RecipeResult" component={RecipeResultScreen} options={{ title: 'Recipe result' }} />
      <Stack.Screen name="IngredientsScan" component={IngredientsScanScreen} />
      <Stack.Screen name="IngredientsConfirm" component={IngredientsConfirmScreen} />
      <Stack.Screen name="Recipe" component={RecipeScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Settings">{() => <SettingsScreen onLogout={onLogout} />}</Stack.Screen>
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
