import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';

import { supabase, supabaseEnvError } from '../services/supabaseClient';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isAuthLoading: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(supabaseEnvError);

  useEffect(() => {
    if (supabaseEnvError || !supabase) {
      setIsAuthLoading(false);
      return;
    }

    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isMounted) return;
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
      })
      .finally(() => {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const ensureClient = () => {
    if (supabaseEnvError || !supabase) {
      throw new Error(supabaseEnvError ?? 'Supabase client is not available.');
    }
    return supabase;
  };

  const signIn = async (email: string, password: string) => {
    setAuthError(null);
    const client = ensureClient();
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    setAuthError(null);
    const client = ensureClient();
    const { error } = await client.auth.signUp({ email, password });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    const client = ensureClient();
    const { error } = await client.auth.signOut();
    if (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, isAuthLoading, authError, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
