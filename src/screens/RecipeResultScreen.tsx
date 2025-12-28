import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { HomeStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'RecipeResult'>;

const RecipeResultScreen: React.FC<Props> = ({ route }) => {
  const { recipe } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.subtitle}>
        Servings: {recipe.servings} • Total time: {recipe.total_time_minutes} min
      </Text>
      <Text style={styles.sectionTitle}>Ingredients</Text>
      {recipe.ingredients.map((item, index) => (
        <Text key={`${item.name}-${index}`} style={styles.listItem}>
          • {item.quantity} {item.name}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>Steps</Text>
      {recipe.steps.map((step, index) => (
        <Text key={`${index}-${step.slice(0, 10)}`} style={styles.listItem}>
          {index + 1}. {step}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>Macros per serving</Text>
      <Text style={styles.listItem}>Calories: {recipe.macros_per_serving.calories}</Text>
      <Text style={styles.listItem}>Protein: {recipe.macros_per_serving.protein_g} g</Text>
      <Text style={styles.listItem}>Carbs: {recipe.macros_per_serving.carbs_g} g</Text>
      <Text style={styles.listItem}>Fat: {recipe.macros_per_serving.fat_g} g</Text>

      {recipe.notes?.length ? (
        <>
          <Text style={styles.sectionTitle}>Notes</Text>
          {recipe.notes.map((note, index) => (
            <Text key={`${index}-${note.slice(0, 10)}`} style={styles.listItem}>
              - {note}
            </Text>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 15,
    marginBottom: 6,
  },
});

export default RecipeResultScreen;
