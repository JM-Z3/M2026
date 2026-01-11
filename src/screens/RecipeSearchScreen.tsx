import React, { useState } from 'react';
<<<<<<< HEAD
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
=======
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
>>>>>>> 7a29051 (Improve login screen UI)
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { HomeStackParamList } from '../navigation/types';
import { fetchRecipe } from '../services/recipeService';
import { addToHistory } from '../services/historyService';
<<<<<<< HEAD
=======
import { saveRecipeToCloud } from '../services/cloudHistoryService';
>>>>>>> 7a29051 (Improve login screen UI)

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

    try {
      const recipe = await fetchRecipe(trimmed);
      await addToHistory(recipe, trimmed);
<<<<<<< HEAD
=======
      try {
        await saveRecipeToCloud(trimmed, recipe);
      } catch (cloudErr) {
        const message = cloudErr instanceof Error ? cloudErr.message : 'Unable to save history to cloud.';
        Alert.alert('Cloud history', message);
      }
>>>>>>> 7a29051 (Improve login screen UI)
      navigation.navigate('RecipeResult', { recipe });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong while generating the recipe.';
      setError(`${message} Please try again.`);
    } finally {
      setIsLoading(false);
    }
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
        The recipe is generated server-side via Supabase Edge Functions, so no secrets are stored in the app.
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
