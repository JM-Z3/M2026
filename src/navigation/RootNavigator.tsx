import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';

import LoginScreen from '../screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';

enableScreens();

type RootNavigatorProps = {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
};

const RootNavigator: React.FC<RootNavigatorProps> = ({ isLoggedIn, onLogin, onLogout }) => {
  return (
    <NavigationContainer>
      {isLoggedIn ? <MainTabNavigator onLogout={onLogout} /> : <LoginScreen onLogin={onLogin} />}
    </NavigationContainer>
  );
};

export default RootNavigator;
