import React, { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { supabase } from '../services/supabaseClient';
import { HomeStackParamList } from '../navigation/types';
import { FitnessRecipe } from '../types/recipe';

type Props = NativeStackScreenProps<HomeStackParamList, 'RecipeSearch'>;

const RecipeSearchScreen: React.FC<Props> = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setError('Please enter a prompt to describe your fitness recipe.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error: invokeError } = await supabase.functions.invoke<FitnessRecipe | { error: string }>(
      'generate-recipe',
      { body: { query: trimmed } }
    );

    setIsLoading(false);

    if (invokeError) {
      setError(invokeError.message || 'Something went wrong while generating the recipe.');
      return;
    }

    if (data && 'error' in data) {
      setError(data.error || 'Recipe generation failed.');
      return;
    }

    if (!data) {
      setError('No recipe was returned. Please try again.');
      return;
    }

    navigation.navigate('RecipeResult', { recipe: data as FitnessRecipe });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness recipe by text</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="e.g. High-protein chicken bowl under 30 minutes"
        multiline
        numberOfLines={4}
        style={styles.input}
        editable={!isLoading}
      />
      <View style={styles.buttonWrapper}>
        <Button title="Generate recipe" onPress={handleGenerate} disabled={isLoading} />
      </View>
      {isLoading && <ActivityIndicator size="small" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text style={styles.helperText}>
        The recipe is generated server-side via Supabase Edge Functions using Gemini, so no API keys live in the app.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  buttonWrapper: {
    marginTop: 12,
    marginBottom: 8,
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
  helperText: {
    marginTop: 12,
    color: '#555',
  },
});

export default RecipeSearchScreen;
