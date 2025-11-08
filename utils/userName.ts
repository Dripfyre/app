/**
 * User name storage utilities using AsyncStorage
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRandomName } from '@/constants/names';

const USER_NAME_KEY = '@dripfyre:userName';

/**
 * Get the stored user name, or generate a new random one if none exists
 */
export async function getUserName(): Promise<string> {
  try {
    const storedName = await AsyncStorage.getItem(USER_NAME_KEY);
    if (storedName) {
      return storedName;
    }

    // Generate and save a new random name if none exists
    const newName = getRandomName();
    await saveUserName(newName);
    return newName;
  } catch (error) {
    console.error('Error getting user name:', error);
    // Fallback to a random name without storing
    return getRandomName();
  }
}

/**
 * Save the user name to storage
 */
export async function saveUserName(name: string): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_NAME_KEY, name);
  } catch (error) {
    console.error('Error saving user name:', error);
  }
}

/**
 * Clear the stored user name
 */
export async function clearUserName(): Promise<void> {
  try {
    await AsyncStorage.removeItem(USER_NAME_KEY);
  } catch (error) {
    console.error('Error clearing user name:', error);
  }
}
