import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';

type Props = {
  onSignInTest: () => void;
};

const Stack = createNativeStackNavigator();

export default function AuthStackNavigator({ onSignInTest }: Props) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login">
        {() => (
  <LoginScreen
    onSignInTest={onSignInTest}
    onLogout={() => {}}
    isLoggedIn={false}
  />
)}
      </Stack.Screen>
    </Stack.Navigator>
  );
}