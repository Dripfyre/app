/**
 * Page 1: Landing/Upload Screen
 * User can upload an image from gallery or generate with a blank template
 */

import { BLANK_IMAGE_URL } from '@/constants/config';
import { uploadImage } from '@/services/api';
import { generateSessionId, saveSessionId } from '@/utils/session';
import { File, Paths } from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Generate session ID on mount
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    saveSessionId(newSessionId);
  }, []);

  const handleImagePicked = async (imageUri: string) => {
    if (!sessionId) {
      Alert.alert('Error', 'Session not initialized. Please try again.');
      return;
    }

    setLoading(true);

    try {
      // Upload image to backend
      await uploadImage(sessionId, imageUri);

      // Navigate to edit screen
      router.push({
        pathname: '/edit',
        params: { sessionId },
      });
    } catch (error) {
      Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFromGallery = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Request permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please grant permission to access your photo library.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await handleImagePicked(result.assets[0].uri);
    }
  };

  const handleGenerate = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!sessionId) {
      Alert.alert('Error', 'Session not initialized. Please try again.');
      return;
    }

    setLoading(true);

    try {
      // Download blank image to local file system using new File API
      const fileName = `blank_${Date.now()}.png`;
      const file = new File(Paths.cache, fileName);

      await File.downloadFileAsync(BLANK_IMAGE_URL, file);

      await handleImagePicked(file.uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to load blank image. Please try again.');
      console.error('Generate error:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Animated.View entering={FadeIn.duration(800)} style={styles.headerContainer}>
            <Text style={styles.logo}>DripFyre</Text>
            <Text style={styles.tagline}>Create. Edit. Post.</Text>
            <Text style={styles.subtitle}>Transform your images with the power of voice</Text>
          </Animated.View>

          <View style={styles.buttonContainer}>
            <Animated.View entering={FadeInDown.delay(200).duration(600)}>
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleUploadFromGallery}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#ffffff', '#f0f0f0']}
                  style={styles.buttonGradient}
                >
                  {loading ? (
                    <ActivityIndicator size="large" color="#667eea" />
                  ) : (
                    <>
                      <View style={styles.iconContainer}>
                        <Text style={styles.icon}>📸</Text>
                      </View>
                      <Text style={styles.buttonText}>Upload Photo</Text>
                      <Text style={styles.buttonSubtext}>Choose from gallery</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).duration(600)}>
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleGenerate}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#ffffff', '#f0f0f0']}
                  style={styles.buttonGradient}
                >
                  {loading ? (
                    <ActivityIndicator size="large" color="#667eea" />
                  ) : (
                    <>
                      <View style={styles.iconContainer}>
                        <Text style={styles.icon}>✨</Text>
                      </View>
                      <Text style={styles.buttonText}>Generate Canvas</Text>
                      <Text style={styles.buttonSubtext}>Start from blank</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <Animated.Text entering={FadeIn.delay(600).duration(800)} style={styles.footerText}>
          You Are 🔥🔥🔥
          </Animated.Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 80,
    paddingBottom: 50,
  },
  headerContainer: {
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    fontSize: 48,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  tagline: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
    alignItems: 'center',
  },
  button: {
    width: width - 80,
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 32,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    letterSpacing: 0.5,
  },
  buttonSubtext: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
