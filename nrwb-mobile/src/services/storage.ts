import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveItem<T>(key: string, value: T): Promise<void> {
  const json = JSON.stringify(value);
  await AsyncStorage.setItem(key, json);
}

export async function getItem<T>(key: string): Promise<T | null> {
  const json = await AsyncStorage.getItem(key);
  return json ? (JSON.parse(json) as T) : null;
}
