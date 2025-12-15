import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import IngredientsConfirmScreen from '../screens/IngredientsConfirmScreen';
import IngredientsScanScreen from '../screens/IngredientsScanScreen';
import RecipeScreen from '../screens/RecipeScreen';
import { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="IngredientsScan" component={IngredientsScanScreen} />
      <Stack.Screen name="IngredientsConfirm" component={IngredientsConfirmScreen} />
      <Stack.Screen name="Recipe" component={RecipeScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
