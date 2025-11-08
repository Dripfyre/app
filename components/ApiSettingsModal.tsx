import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const API_URL_KEY = '@api_url_override';

interface ApiSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ApiSettingsModal({ visible, onClose }: ApiSettingsModalProps) {
  const [apiUrl, setApiUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (visible) {
      loadCurrentUrl();
    }
  }, [visible]);

  const loadCurrentUrl = async () => {
    try {
      const stored = await AsyncStorage.getItem(API_URL_KEY);
      const envUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
      const current = stored || envUrl;
      setCurrentUrl(current);
      setApiUrl(current);
    } catch (error) {
      console.error('Failed to load API URL:', error);
    }
  };

  const handleSave = async () => {
    if (!apiUrl.trim()) {
      Alert.alert('Error', 'Please enter a valid URL');
      return;
    }

    // Basic URL validation
    if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
      Alert.alert('Error', 'URL must start with http:// or https://');
      return;
    }

    try {
      await AsyncStorage.setItem(API_URL_KEY, apiUrl.trim());
      Alert.alert(
        'Success',
        'API URL updated! Please restart the app for changes to take effect.',
        [
          {
            text: 'OK',
            onPress: onClose,
          },
        ]
      );
    } catch (error) {
      console.error('Failed to save API URL:', error);
      Alert.alert('Error', 'Failed to save API URL');
    }
  };

  const handleReset = async () => {
    Alert.alert(
      'Reset to Default',
      'This will reset the API URL to the value in .env file. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(API_URL_KEY);
              const envUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
              setApiUrl(envUrl);
              setCurrentUrl(envUrl);
              Alert.alert('Success', 'API URL reset to default. Restart app to apply.');
            } catch (error) {
              console.error('Failed to reset API URL:', error);
              Alert.alert('Error', 'Failed to reset API URL');
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Developer Settings</Text>
              <Text style={styles.modalSubtitle}>API Configuration</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Current API URL:</Text>
                <Text style={styles.currentUrl} numberOfLines={2}>
                  {currentUrl}
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>New API URL:</Text>
                <TextInput
                  style={styles.input}
                  value={apiUrl}
                  onChangeText={setApiUrl}
                  placeholder="http://your-api-url:port"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>

              <Text style={styles.warningText}>
                Note: App restart required for changes to take effect
              </Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FF0080',
    marginBottom: 4,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  currentUrl: {
    fontSize: 13,
    color: '#00E0C0',
    backgroundColor: 'rgba(0, 224, 192, 0.1)',
    padding: 12,
    borderRadius: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#00E0C0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  resetButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 0, 128, 0.15)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 128, 0.3)',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF0080',
  },
  warningText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});
