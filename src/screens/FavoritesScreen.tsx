import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const FavoritesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FavoritesScreen</Text>
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

export default FavoritesScreen;
