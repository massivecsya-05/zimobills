import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Northern Region Water Board</Text>
      <Text style={styles.subtitle}>Customer Service App</Text>
      <Text style={styles.section}>Use tabs below to access services.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: 8 },
  section: { marginTop: 16, fontSize: 14 },
});
