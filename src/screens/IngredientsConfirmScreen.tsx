import React from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { HomeStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'IngredientsConfirm'>;

const placeholderIngredients = ['Tomato', 'Basil', 'Garlic'];

const IngredientsConfirmScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>IngredientsConfirmScreen</Text>
      <FlatList
        data={placeholderIngredients}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <TextInput style={styles.input} value={item} editable />
          </View>
        )}
      />
      <Button title="View Recipe" onPress={() => navigation.navigate('Recipe')} />
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
    textAlign: 'center',
  },
  listItem: {
    paddingVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
  },
});

export default IngredientsConfirmScreen;
