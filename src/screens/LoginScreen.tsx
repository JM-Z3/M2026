import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>Use your email and password to continue.</Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#8a8a8a"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            editable={!isSubmitting}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#8a8a8a"
            secureTextEntry
            style={styles.input}
            editable={!isSubmitting}
          />

          {(localError || authError) && <Text style={styles.error}>{localError || authError}</Text>}

          <TouchableOpacity
            style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}
            onPress={() => handleAction('signin')}
            disabled={isSubmitting}
          >
            <Text style={styles.primaryButtonText}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryButton, isSubmitting && styles.buttonDisabled]}
            onPress={() => handleAction('signup')}
            disabled={isSubmitting}
          >
            <Text style={styles.secondaryButtonText}>Sign up</Text>
          </TouchableOpacity>

          <View style={styles.devButton}>
            <TouchableOpacity
              style={[styles.tertiaryButton, isSubmitting && styles.buttonDisabled]}
              onPress={() => handleAction('dev')}
              disabled={isSubmitting}
            >
              <Text style={styles.tertiaryButtonText}>Dev Login</Text>
            </TouchableOpacity>
            <Text style={styles.devNote}>Temporary dev-only login.</Text>
          </View>

          {isSubmitting && <ActivityIndicator size="small" />}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    color: '#666',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#d8d8d8',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fafafa',
    color: '#111',
  },
  primaryButton: {
    backgroundColor: '#111',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#111',
  },
  secondaryButtonText: {
    color: '#111',
    fontWeight: '600',
  },
  devButton: {
    alignItems: 'center',
    gap: 6,
  },
  tertiaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    backgroundColor: '#f4f4f4',
  },
  tertiaryButtonText: {
    color: '#444',
    fontWeight: '600',
  },
  devNote: {
    fontSize: 12,
    color: '#777',
  },
  error: {
    color: '#b00020',
    backgroundColor: '#fdecea',
    borderColor: '#f5c2c7',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default LoginScreen;
