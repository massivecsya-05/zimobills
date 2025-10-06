import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';

type Announcement = { id: string; title: string; body: string; date: string };

export default function AnnouncementsScreen() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setRefreshing(true);
    // TODO: fetch from backend
    await new Promise((r) => setTimeout(r, 500));
    setItems([
      { id: 'a1', title: 'Scheduled Maintenance', body: 'Outage in Area 18 on Wed 3-6pm.', date: '2025-10-01' },
      { id: 'a2', title: 'New Tariffs', body: 'New tariffs effective Nov 1.', date: '2025-10-05' },
    ]);
    setRefreshing(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={items}
      keyExtractor={(i) => i.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.body}>{item.body}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  title: { fontWeight: 'bold' },
  date: { color: '#888', marginTop: 4 },
  body: { marginTop: 8, color: '#333' },
});
