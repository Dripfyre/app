/**
 * Session Management Utilities
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'dripfyre_session_id';
// const {v4: uuidv4} = require('uuid');
// const uuid = uuidv4();

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  //return `${uuid}`;
}

/**
 * Save session ID to storage
 */
export async function saveSessionId(sessionId: string): Promise<void> {
  try {
    await AsyncStorage.setItem(SESSION_KEY, sessionId);
  } catch (error) {
    console.error('Error saving session ID:', error);
  }
}

/**
 * Get current session ID from storage
 */
export async function getSessionId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(SESSION_KEY);
  } catch (error) {
    console.error('Error getting session ID:', error);
    return null;
  }
}

/**
 * Clear session ID from storage
 */
export async function clearSessionId(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error clearing session ID:', error);
  }
}

/**
 * Get or create a session ID
 */
export async function getOrCreateSessionId(): Promise<string> {
  let sessionId = await getSessionId();

  if (!sessionId) {
    sessionId = generateSessionId();
    await saveSessionId(sessionId);
  }

  return sessionId;
}
