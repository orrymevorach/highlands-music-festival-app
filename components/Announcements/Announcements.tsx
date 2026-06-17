import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Layout from 'components/shared/Layout/Layout';
import { useAnnouncements } from './useAnnouncements';

export default function Announcements() {
  const { items, loading } = useAnnouncements();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No announcements yet.</Text>
      </View>
    );
  }

  return (
    <Layout paddingHorizontal={0}>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title || 'Untitled'}</Text>
            <Text style={styles.body}>{item.body || ''}</Text>
          </View>
        )}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#444',
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 50,
  },
  list: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: '#111',
  },
  body: {
    fontSize: 15,
    lineHeight: 20,
    color: '#333',
  },
});
