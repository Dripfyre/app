import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL_KEY = '@api_url_override';

/**
 * Get the current API URL
 * Checks AsyncStorage first, falls back to env variable
 */
export async function getApiUrl(): Promise<string> {
  try {
    const stored = await AsyncStorage.getItem(API_URL_KEY);
    if (stored) {
      console.log('Using stored API URL:', stored);
      return stored;
    }
  } catch (error) {
    console.error('Failed to load stored API URL:', error);
  }

  const envUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
  console.log('Using env API URL:', envUrl);
  return envUrl;
}

/**
 * Set a custom API URL
 */
export async function setApiUrl(url: string): Promise<void> {
  await AsyncStorage.setItem(API_URL_KEY, url);
}

/**
 * Clear the custom API URL (reset to env default)
 */
export async function clearApiUrl(): Promise<void> {
  await AsyncStorage.removeItem(API_URL_KEY);
}
