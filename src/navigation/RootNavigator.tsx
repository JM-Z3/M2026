import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Session } from '@supabase/supabase-js';

import HomeStackNavigator from './HomeStackNavigator';
import AuthStackNavigator from './AuthStackNavigator';

type Props = {
  session: Session | null;
  isLoading: boolean;
  onSignInTest: () => void;
};

export default function RootNavigator({
  session,
  isLoading,
  onSignInTest,
}: Props) {
  if (isLoading) return null;

  return (
    <NavigationContainer>
      {session ? (
        <HomeStackNavigator />
      ) : (
        <AuthStackNavigator onSignInTest={onSignInTest} />
      )}
    </NavigationContainer>
  );
}