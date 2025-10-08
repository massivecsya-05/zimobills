import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

export default function TokensScreen() {
  const [meter, setMeter] = useState('');
  const [reference, setReference] = useState('');
  const [token, setToken] = useState<string | null>(null);

  function retrieveToken() {
    // TODO: replace with backend integration
    setToken('1234-5678-9012-3456-7890');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Prepaid Meter Number</Text>
      <TextInput value={meter} onChangeText={setMeter} keyboardType="numeric" placeholder="e.g. 01234567890" style={styles.input} />
      <Text style={styles.label}>Payment Reference (SMS/Receipt)</Text>
      <TextInput value={reference} onChangeText={setReference} placeholder="e.g. TXN123456" style={styles.input} />
      <Button title="Retrieve Token" onPress={retrieveToken} />
      {token && (
        <View style={styles.card}>
          <Text style={styles.title}>Token</Text>
          <Text style={styles.token}>{token}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 12 },
  card: { marginTop: 16, padding: 16, borderRadius: 12, backgroundColor: '#fafafa', borderWidth: 1, borderColor: '#eee', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: 'bold' },
  token: { marginTop: 12, fontSize: 20, letterSpacing: 2 },
});
