import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';
import { Session } from '@supabase/supabase-js';

import RootNavigator from './src/navigation/RootNavigator';
import { supabase } from './src/services/supabaseClient';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isMounted) return;
        setSession(data.session ?? null);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingSession(false);
        }
      });

    const { data: authListener } = supabase.auth.onAuthStateChange((_, newSession) => {
      setSession(newSession);
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignInTest = async () => {
    const email = process.env.EXPO_PUBLIC_TEST_EMAIL;
    const password = process.env.EXPO_PUBLIC_TEST_PASSWORD;

    if (!email || !password) {
      Alert.alert('Missing credentials', 'Set EXPO_PUBLIC_TEST_EMAIL and EXPO_PUBLIC_TEST_PASSWORD in your .env file.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert('Sign-in failed', error.message);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Sign-out failed', error.message);
    }
  };

  return (
    <>
      <StatusBar style="auto" />
      {!isLoadingSession && (
        <RootNavigator session={session} onSignInTest={handleSignInTest} onLogout={handleSignOut} />
      )}
    </>
  );
}
