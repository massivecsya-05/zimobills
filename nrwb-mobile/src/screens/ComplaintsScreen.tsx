import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList } from 'react-native';

type Complaint = { id: string; subject: string; status: 'Open' | 'In Progress' | 'Resolved' };

export default function ComplaintsScreen() {
  const [subject, setSubject] = useState('');
  const [list, setList] = useState<Complaint[]>([]);

  function submitComplaint() {
    const id = (list.length + 1).toString();
    setList([{ id, subject, status: 'Open' }, ...list]);
    setSubject('');
  }

  function advance(id: string) {
    setList((prev) => prev.map((c) => (c.id === id ? { ...c, status: c.status === 'Open' ? 'In Progress' : 'Resolved' } : c)));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Complaint Subject</Text>
      <TextInput value={subject} onChangeText={setSubject} placeholder="e.g. Low pressure in Area 25" style={styles.input} />
      <Button title="Log Complaint" onPress={submitComplaint} />

      <FlatList
        style={{ marginTop: 16 }}
        data={list}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View>
              <Text style={styles.subject}>{item.subject}</Text>
              <Text style={styles.status}>Status: {item.status}</Text>
            </View>
            <Button title={item.status === 'Resolved' ? 'Resolved' : 'Advance'} onPress={() => advance(item.id)} disabled={item.status === 'Resolved'} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' },
  subject: { fontWeight: '600' },
  status: { color: '#666' },
});
