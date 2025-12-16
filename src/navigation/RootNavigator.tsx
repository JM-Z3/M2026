import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { Session } from '@supabase/supabase-js';

import LoginScreen from '../screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';

enableScreens();

type RootNavigatorProps = {
  session: Session | null;
  onSignInTest: () => Promise<void>;
  onLogout: () => Promise<void>;
};

const RootNavigator: React.FC<RootNavigatorProps> = ({ session, onSignInTest, onLogout }) => {
  const isLoggedIn = Boolean(session);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainTabNavigator onLogout={onLogout} />
      ) : (
        <LoginScreen onSignInTest={onSignInTest} onLogout={onLogout} isLoggedIn={isLoggedIn} />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
