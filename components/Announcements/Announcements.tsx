import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Layout from 'components/shared/Layout/Layout';
import GroovyCard from 'components/shared/GroovyCard/GroovyCard';
import SectionHeading from 'components/shared/SectionHeading/SectionHeading';
import { useAnnouncements } from './useAnnouncements';
import {
  black,
  darkGreen,
  fontSecondary,
  fontSecondaryBold,
} from 'utils/style-variables';

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
      <SectionHeading>Announcements</SectionHeading>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <GroovyCard contentStyle={styles.content}>
            <Text style={styles.title}>{item.title || 'Untitled'}</Text>
            <Text style={styles.body}>{item.body || ''}</Text>
          </GroovyCard>
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
  content: {
    padding: 14,
  },
  title: {
    fontFamily: fontSecondaryBold,
    fontSize: 18,
    marginBottom: 6,
    color: darkGreen,
  },
  body: {
    fontFamily: fontSecondary,
    fontSize: 15,
    lineHeight: 20,
    color: black,
  },
});
