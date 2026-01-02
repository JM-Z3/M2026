import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const RecipeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RecipeScreen</Text>
      <Text>Recipe details placeholder</Text>
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
  },
});

export default RecipeScreen;
