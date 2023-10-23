import React from 'react';
import { View, StyleSheet } from 'react-native';
import Faq from 'components/Faq/Faq';
import { ApolloProvider } from '@apollo/client';
import { contentfulClient } from './contentful/apollo-config';
import { beige } from 'utils/style-variables';

export default function App() {
  return (
    <ApolloProvider client={contentfulClient}>
      <View style={styles.container}>
        <Faq />
      </View>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: beige,
  },
});
