import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { getHistory, clearHistory, HistoryItem } from '../services/historyService';
import { HomeStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const HistoryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [isClearing, setIsClearing] = useState(false);

  const loadHistory = useCallback(async () => {
    const history = await getHistory();
    setItems(history);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const handleOpen = (item: HistoryItem) => {
    navigation.navigate('RecipeResult', { recipe: item.recipe });
  };

  const handleClear = async () => {
    Alert.alert('Clear history', 'This will remove all saved recipes. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          setIsClearing(true);
          await clearHistory();
          setItems([]);
          setIsClearing(false);
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <Pressable style={styles.card} onPress={() => handleOpen(item)}>
      <Text style={styles.cardTitle}>{item.recipe.title}</Text>
      <Text style={styles.cardMeta}>
        Servings: {item.recipe.servings} • Total time: {item.recipe.total_time_minutes} min
      </Text>
      <Text numberOfLines={1} style={styles.cardQuery}>
        Query: {item.query}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <Pressable onPress={handleClear} disabled={isClearing || items.length === 0}>
          <Text style={[styles.clear, (isClearing || items.length === 0) && styles.clearDisabled]}>Clear</Text>
        </Pressable>
      </View>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No recipes yet. Generate one to see it here.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  clear: {
    color: '#cc0000',
    fontWeight: '600',
  },
  clearDisabled: {
    color: '#aaa',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#555',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardMeta: {
    color: '#555',
    marginTop: 4,
  },
  cardQuery: {
    color: '#777',
    marginTop: 4,
  },
});

export default HistoryScreen;
