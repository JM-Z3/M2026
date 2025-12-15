import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { HomeStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HomeScreen</Text>
      <View style={styles.buttonWrapper}>
        <Button title="Scan Ingredients" onPress={() => navigation.navigate('IngredientsScan')} />
      </View>
      <View style={styles.buttonWrapper}>
        <Button title="Confirm Ingredients" onPress={() => navigation.navigate('IngredientsConfirm')} />
      </View>
      <View style={styles.buttonWrapper}>
        <Button title="View Recipe" onPress={() => navigation.navigate('Recipe')} />
      </View>
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
  buttonWrapper: {
    marginVertical: 6,
    width: '100%',
  },
});

export default HomeScreen;
