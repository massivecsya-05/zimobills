import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

function calculateBill(previousReading: number, currentReading: number) {
  const consumption = Math.max(0, currentReading - previousReading);
  // Example tariff: first 10 m3 at 500 each, next at 750
  const tier1Units = Math.min(consumption, 10);
  const tier2Units = Math.max(0, consumption - 10);
  const subtotal = tier1Units * 500 + tier2Units * 750;
  const levy = subtotal * 0.05; // 5% levy example
  const total = subtotal + levy;
  return { consumption, subtotal, levy, total };
}

export default function BillCalculatorScreen() {
  const [prev, setPrev] = useState('');
  const [curr, setCurr] = useState('');
  const [result, setResult] = useState<{ consumption: number; subtotal: number; levy: number; total: number } | null>(null);

  function onCalculate() {
    const p = parseFloat(prev);
    const c = parseFloat(curr);
    if (isNaN(p) || isNaN(c) || c < p) {
      setResult(null);
      return;
    }
    setResult(calculateBill(p, c));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Previous Reading (m³)</Text>
      <TextInput value={prev} onChangeText={setPrev} keyboardType="numeric" style={styles.input} />
      <Text style={styles.label}>Current Reading (m³)</Text>
      <TextInput value={curr} onChangeText={setCurr} keyboardType="numeric" style={styles.input} />
      <Button title="Calculate" onPress={onCalculate} />
      {result && (
        <View style={styles.card}>
          <Text>Consumption: {result.consumption} m³</Text>
          <Text>Subtotal: MWK {result.subtotal.toFixed(2)}</Text>
          <Text>Levy: MWK {result.levy.toFixed(2)}</Text>
          <Text style={styles.total}>Total: MWK {result.total.toFixed(2)}</Text>
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
  total: { marginTop: 8, fontWeight: 'bold' },
});
