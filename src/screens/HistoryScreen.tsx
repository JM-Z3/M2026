import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { HomeStackParamList } from '../navigation/types';
import { useAuth } from '../state/AuthContext';
import { clearCloudHistory, getCloudHistory, CloudHistoryItem } from '../services/cloudHistoryService';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const HistoryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { session } = useAuth();
  const [items, setItems] = useState<CloudHistoryItem[]>([]);
  const [isClearing, setIsClearing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);
    setError(null);
    try {
      const history = await getCloudHistory();
      setItems(history);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load history.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const handleOpen = (item: CloudHistoryItem) => {
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
          try {
            await clearCloudHistory();
            setItems([]);
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Unable to clear history.';
            Alert.alert('Error', message);
          } finally {
            setIsClearing(false);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: CloudHistoryItem }) => (
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
        <Pressable onPress={handleClear} disabled={isClearing || items.length === 0 || isLoading}>
          <Text
            style={[
              styles.clear,
              (isClearing || items.length === 0 || isLoading) && styles.clearDisabled,
            ]}
          >
            Clear
          </Text>
        </Pressable>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {items.length === 0 && !isLoading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No recipes yet. Generate one to see it here.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={loadHistory}
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
  error: {
    color: 'red',
    marginBottom: 8,
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
