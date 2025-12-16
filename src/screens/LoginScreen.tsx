import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

type LoginScreenProps = {
  onSignInTest: () => void | Promise<void>;
  onLogout: () => void | Promise<void>;
  isLoggedIn: boolean;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onSignInTest, onLogout, isLoggedIn }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LoginScreen</Text>
      <Button title="Sign in (test)" onPress={onSignInTest} />
      {isLoggedIn && <Button title="Sign out" onPress={onLogout} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
  },
});

export default LoginScreen;
