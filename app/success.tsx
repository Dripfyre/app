/**
 * Page 3: Success/Post Confirmation Screen
 * Shows posted image with caption and hashtag, and options to start new session
 */

import { BLANK_IMAGE_URL } from '@/constants/config';
import { BrandColors } from '@/constants/theme';
import { uploadImage } from '@/services/api';
import { clearSessionId, generateSessionId, saveSessionId } from '@/utils/session';
import * as Clipboard from 'expo-clipboard';
import { File, Paths } from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

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

  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Combine caption and hashtags
      const shareText = `${params.caption}\n\n${params.hashtag}`;

      // Copy to clipboard first (so user can paste it)
      await Clipboard.setStringAsync(shareText);

      if (!params.imageUri) {
        Alert.alert('Copied!', 'Caption and hashtags copied to clipboard.');
        return;
      }

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert('Copied!', 'Caption and hashtags copied to clipboard. Sharing is not available on this device.');
        return;
      }

      // Share the image file - caption is already copied to clipboard
      await Sharing.shareAsync(params.imageUri, {
        mimeType: 'image/jpeg',
        dialogTitle: shareText,
        UTI: 'public.jpeg',
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Copied!', 'Caption and hashtags copied to clipboard. Please paste when sharing.');
    }
  };

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
        colors={[BrandColors.black, BrandColors.black]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Success Header */}
          {/* <Animated.View entering={ZoomIn.duration(600)} style={styles.successIconContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.successEmoji}>💅🏻</Text>
            </View>
          </Animated.View> */}

          <Animated.View entering={FadeIn.delay(300).duration(600)} style={styles.headerContainer}>
            <Text style={styles.title}>Done !</Text>
            <Text style={styles.subtitle}>Your masterpiece is ready to shine 💅🏻</Text>
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
                    <Text style={styles.caption} numberOfLines={2}>{params.caption}</Text>
                  </View>
                )}

                {params.hashtag && (
                  <View style={styles.textRow}>
                    <Text style={styles.hashtag} numberOfLines={1}>{params.hashtag}</Text>
                  </View>
                )}
              </View>

              {/* Share Button */}
              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShare}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[BrandColors.teal, BrandColors.fuchsia]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.shareButtonGradient}
                >
                  <Text style={styles.shareButtonText}>📤 Share</Text>
                </LinearGradient>
              </TouchableOpacity>
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
                  colors={[BrandColors.teal, BrandColors.fuchsia]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  {loading ? (
                    <ActivityIndicator size="large" color={BrandColors.white} />
                  ) : (
                    <Text style={styles.buttonText}>Upload</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleGenerate}
                disabled={loading}
                activeOpacity={0.8}
              >
                <View style={[styles.buttonGradient, styles.generateButton]}>
                  {loading ? (
                    <ActivityIndicator size="large" color={BrandColors.black} />
                  ) : (
                    <Text style={styles.generateButtonText}>Generate!</Text>
                  )}
                </View>
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
    fontSize: 20,
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
  shareButton: {
    marginTop: 8,
  },
  shareButtonGradient: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BrandColors.teal,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.white,
    letterSpacing: 0.3,
  },
  icon: {
    fontSize: 16,
    marginTop: 2,
  },
  caption: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: BrandColors.black,
    fontWeight: '500',
  },
  hashtag: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: BrandColors.teal,
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
    paddingHorizontal: 20,
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
    shadowColor: BrandColors.teal,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 24,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '800',
    color: BrandColors.white,
    letterSpacing: 0.3,
  },
  generateButton: {
    backgroundColor: BrandColors.limeGreen,
    shadowColor: BrandColors.limeGreen,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 24,
  },
  generateButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: BrandColors.black,
    letterSpacing: 0.3,
  },
});
