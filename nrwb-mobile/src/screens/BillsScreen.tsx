import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList } from 'react-native';

type Transaction = { id: string; date: string; amount: number; description: string };

export default function BillsScreen() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [history, setHistory] = useState<Transaction[]>([]);

  function fetchBills() {
    // TODO: replace with backend call
    setBalance(15200.5);
    setHistory([
      { id: '1', date: '2025-09-03', amount: -8000, description: 'Payment - Mo626' },
      { id: '2', date: '2025-08-15', amount: 9200, description: 'Bill - August' },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Customer/Account Number</Text>
      <TextInput value={account} onChangeText={setAccount} placeholder="e.g. 1234567" style={styles.input} keyboardType="numeric" />
      <Button title="Check Bill" onPress={fetchBills} />
      {balance !== null && (
        <View style={styles.card}>
          <Text style={styles.title}>Outstanding Balance: MWK {balance.toFixed(2)}</Text>
          <Text style={styles.subtitle}>Recent Activity</Text>
          <FlatList
            data={history}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.cell}>{item.date}</Text>
                <Text style={[styles.cell, { textAlign: 'right' }]}>{item.amount.toFixed(2)}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 12 },
  card: { marginTop: 16, padding: 16, borderRadius: 12, backgroundColor: '#fafafa', borderWidth: 1, borderColor: '#eee' },
  title: { fontSize: 16, fontWeight: 'bold' },
  subtitle: { marginTop: 12, marginBottom: 8, color: '#666' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderColor: '#eee' },
  cell: { flex: 1 },
});
