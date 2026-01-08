import React, { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '../state/AuthContext';

const LoginScreen: React.FC = () => {
  const { signIn, signUp, devSignIn, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleAction = async (action: 'signin' | 'signup' | 'dev') => {
    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter email and password.');
      return;
    }

    setIsSubmitting(true);
    setLocalError(null);
    try {
      if (action === 'signin') {
        await signIn(email.trim(), password);
      } else if (action === 'signup') {
        await signUp(email.trim(), password);
      } else {
        await devSignIn(email.trim(), password);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setLocalError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        editable={!isSubmitting}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        editable={!isSubmitting}
      />
      <View style={styles.buttons}>
        <Button title="Sign in" onPress={() => handleAction('signin')} disabled={isSubmitting} />
        <Button title="Sign up" onPress={() => handleAction('signup')} disabled={isSubmitting} />
      </View>
      <View style={styles.devButton}>
        <Button title="Dev Login" onPress={() => handleAction('dev')} disabled={isSubmitting} />
        <Text style={styles.devNote}>Temporary dev-only login.</Text>
      </View>
      {isSubmitting && <ActivityIndicator />}
      {(localError || authError) && <Text style={styles.error}>{localError || authError}</Text>}
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
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  devButton: {
    alignItems: 'center',
    gap: 6,
  },
  devNote: {
    fontSize: 12,
    color: '#777',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});

export default LoginScreen;
