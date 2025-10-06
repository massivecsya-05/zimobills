import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export default function TipsScreen() {
  const [text, setText] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  async function pickImage() {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!res.canceled) {
      setPhotoUri(res.assets[0].uri);
    }
  }

  async function getLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);
  }

  function submit() {
    // TODO integrate with backend anonymously
    alert('Tip submitted anonymously');
    setText('');
    setPhotoUri(null);
    setLocation(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Anonymous Tip</Text>
      <TextInput value={text} onChangeText={setText} placeholder="Describe the issue" style={styles.input} multiline />
      <Button title={photoUri ? 'Change Photo' : 'Add Photo'} onPress={pickImage} />
      {photoUri && <Image source={{ uri: photoUri }} style={styles.image} />} 
      <View style={{ height: 12 }} />
      <Button title={location ? 'Location Added' : 'Add Location'} onPress={getLocation} />
      {location && (
        <Text style={styles.meta}>Lat: {location.coords.latitude.toFixed(5)}, Lng: {location.coords.longitude.toFixed(5)}</Text>
      )}
      <View style={{ height: 12 }} />
      <Button title="Submit Tip" onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 12, minHeight: 80 },
  image: { width: '100%', height: 200, marginTop: 12, borderRadius: 8 },
  meta: { marginTop: 8, color: '#444' },
});
