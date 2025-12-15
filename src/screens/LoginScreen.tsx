import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

type LoginScreenProps = {
  onLogin: () => void;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LoginScreen</Text>
      <Button title="Log In" onPress={onLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
  },
});

export default LoginScreen;
