/**
 * Page 3: Success/Post Confirmation Screen
 * Shows posted image with caption and hashtag, and options to start new session
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, ZoomIn, FadeInUp } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { File, Paths } from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import { generateSessionId, saveSessionId, clearSessionId } from '@/utils/session';
import { uploadImage } from '@/services/api';
import { BLANK_IMAGE_URL } from '@/constants/config';

const { width } = Dimensions.get('window');

export default function SuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    imageUri: string;
    caption: string;
    hashtag: string;
  }>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Clear old session on mount
    clearSessionId();
    // Success haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const handleImagePicked = async (imageUri: string) => {
    setLoading(true);

    try {
      // Generate new session ID
      const newSessionId = generateSessionId();
      await saveSessionId(newSessionId);

      // Upload image to backend
      await uploadImage(newSessionId, imageUri);

      // Navigate to edit screen
      router.replace({
        pathname: '/edit',
        params: { sessionId: newSessionId },
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Success Header */}
          <Animated.View entering={ZoomIn.duration(600)} style={styles.successIconContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.successEmoji}>✨</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(300).duration(600)} style={styles.headerContainer}>
            <Text style={styles.title}>Posted Successfully!</Text>
            <Text style={styles.subtitle}>Your masterpiece is ready to shine</Text>
          </Animated.View>

          {/* Preview Card */}
          <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.previewCard}>
            <LinearGradient
              colors={['#ffffff', '#f9f9f9']}
              style={styles.cardGradient}
            >
              {params.imageUri && (
                <Image
                  source={{ uri: params.imageUri }}
                  style={styles.image}
                  contentFit="cover"
                />
              )}

              <View style={styles.textContent}>
                {params.caption && (
                  <View style={styles.textRow}>
                    <Text style={styles.icon}>💬</Text>
                    <Text style={styles.caption} numberOfLines={2}>{params.caption}</Text>
                  </View>
                )}

                {params.hashtag && (
                  <View style={styles.textRow}>
                    <Text style={styles.icon}>#</Text>
                    <Text style={styles.hashtag} numberOfLines={1}>{params.hashtag}</Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Create More Section */}
          <Animated.View entering={FadeInUp.delay(600).duration(600)} style={styles.createMoreContainer}>
            <Text style={styles.createMoreTitle}>Create More Magic</Text>

            <View style={styles.buttonContainer}>
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
                      <View style={styles.buttonIconContainer}>
                        <Text style={styles.buttonIcon}>📸</Text>
                      </View>
                      <Text style={styles.buttonText}>Upload Photo</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

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
                      <View style={styles.buttonIconContainer}>
                        <Text style={styles.buttonIcon}>✨</Text>
                      </View>
                      <Text style={styles.buttonText}>New Canvas</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
    gap: 24,
  },
  successIconContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successEmoji: {
    fontSize: 50,
  },
  headerContainer: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
  },
  previewCard: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  cardGradient: {
    padding: 16,
    gap: 16,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  textContent: {
    gap: 12,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  icon: {
    fontSize: 16,
    marginTop: 2,
  },
  caption: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    fontWeight: '500',
  },
  hashtag: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: '#667eea',
    fontWeight: '600',
  },
  createMoreContainer: {
    gap: 20,
    marginTop: 8,
  },
  createMoreTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    maxWidth: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  buttonIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 28,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
});
