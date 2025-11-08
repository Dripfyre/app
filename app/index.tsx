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
  Image,
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
      <View style={styles.background}>
        <View style={styles.content}>
          <Animated.View entering={FadeIn.duration(800)} style={styles.headerContainer}>
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.brandContainer}>
              <Text style={styles.brandDrip}>Drip</Text>
              <Text style={styles.brandFire}>Fire</Text>
            </View>
            <Text style={styles.tagline}>
              Go Viral. On <Text style={styles.taglineHighlight}>Autopilot.</Text>
            </Text>
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
                  colors={['#00E0C0', '#FF0080']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  {loading ? (
                    <ActivityIndicator size="large" color="#ffffff" />
                  ) : (
                    <Text style={styles.buttonText}>Upload</Text>
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
                <View style={[styles.buttonGradient, styles.generateButton]}>
                  {loading ? (
                    <ActivityIndicator size="large" color="#000000" />
                  ) : (
                    <Text style={styles.generateButtonText}>Generate!</Text>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
        <Text style={styles.tagline}>
              You Are 🔥 🔥 🔥
          </Text>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    gap: 20,
    marginBottom: 80,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandDrip: {
    fontSize: 42,
    fontWeight: '800',
    color: '#00E0C0',
    letterSpacing: -0.5,
  },
  brandFire: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FF0080',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  taglineHighlight: {
    color: '#A0FF00',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  button: {
    flex: 1,
    maxWidth: 170,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    borderRadius: 32,
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
    // Intense glow effect for gradient button
    shadowColor: '#00E0C0',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 24,
  },
  buttonText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  generateButton: {
    backgroundColor: '#A0FF00',
    borderRadius: 32,
    // Intense glow effect for lime green button
    shadowColor: '#A0FF00',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 24,
  },
  generateButtonText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 0.3,
  },
});
