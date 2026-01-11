import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import HomeStackNavigator from './HomeStackNavigator';
import { useAuth } from '../state/AuthContext';

enableScreens();

const RootNavigator: React.FC = () => {
  const { session, isAuthLoading, authError, signOut, devSession } = useAuth();
  const isLoggedIn = Boolean(session) || devSession;

  if (isAuthLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.helper}>Loading session...</Text>
      </View>
    );
  }

  if (authError && !devSession) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Auth error: {authError}</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <HomeStackNavigator onLogout={signOut} /> : <LoginScreen />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  helper: {
    color: '#555',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});

export default RootNavigator;
