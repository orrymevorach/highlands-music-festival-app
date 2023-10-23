import React from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import { darkGreen, yellow } from '../../style-variables';

export default function MenuItem({ title = '' }) {
  return (
    <View style={styles.container}>
      <Button title={title} onPress={() => {}} color={darkGreen} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: yellow,
    height: 50,
  },
});
