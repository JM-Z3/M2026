import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import FavoritesScreen from '../screens/FavoritesScreen';
import HistoryScreen from '../screens/HistoryScreen';
import HomeStackNavigator from './HomeStackNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import { TabParamList } from './types';

type MainTabNavigatorProps = {
  onLogout: () => void;
};

const Tab = createBottomTabNavigator<TabParamList>();

const MainTabNavigator: React.FC<MainTabNavigatorProps> = ({ onLogout }) => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="HomeStack" component={HomeStackNavigator} options={{ title: 'Home' }} />
    <Tab.Screen name="Favorites" component={FavoritesScreen} />
    <Tab.Screen name="History" component={HistoryScreen} />
    <Tab.Screen name="Settings">
      {() => <SettingsScreen onLogout={onLogout} />}
    </Tab.Screen>
  </Tab.Navigator>
);

export default MainTabNavigator;
