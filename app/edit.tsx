/**
 * Page 2: Edit Screen
 * Voice editing interface with caption/hashtag display, image preview, and controls
 */

import CaptionBox from '@/components/CaptionBox';
import ImageDisplay from '@/components/ImageDisplay';
import VoiceButton from '@/components/VoiceButton';
import { editWithVoice, syncSession } from '@/services/api';
import { File, Paths } from 'expo-file-system';
import { writeAsStringAsync, EncodingType } from 'expo-file-system/legacy';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function EditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sessionId: string }>();
  const sessionId = params.sessionId;

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Initial sync on mount
  useEffect(() => {
    if (sessionId) {
      fetchSyncData();
    }
  }, [sessionId]);

  const fetchSyncData = async () => {
    try {
      setSyncing(true);
      const data = await syncSession(sessionId);

      setImageUrl(data?.data?.images[0]?.base64);
      setCaption(data?.data?.caption);
      setHashtag(data?.data?.hashtags);
    } catch (error) {
      console.error('Sync error:', error);
      Alert.alert('Sync Error', 'Failed to sync data. Please try again.');
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  const handleVoiceRecording = async (audioUri: string) => {
    setProcessing(true);

    try {
      // Send voice recording to edit endpoint (returns 202)
      await editWithVoice(sessionId, audioUri);

      // Wait a moment for processing to start
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call sync to get updated data
      await fetchSyncData();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Edit error:', error);
      Alert.alert('Edit Error', 'Failed to process voice command. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setProcessing(false);
    }
  };

  const handlePost = async () => {
    if (!imageUrl) {
      Alert.alert('No Image', 'Please wait for the image to sync.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      setLoading(true);

      let finalImageUri: string;

      // Check if imageUrl is a data URI (base64) or HTTP URL
      if (imageUrl.startsWith('data:')) {
        // Convert base64 data URI to file
        const fileName = `dripfyre_${Date.now()}.jpg`;
        const filePath = `${Paths.document}/${fileName}`;

        // Extract base64 data (remove data:image/xxx;base64, prefix)
        const base64Data = imageUrl.split(',')[1];

        // Write base64 data to file using legacy API
        await writeAsStringAsync(filePath, base64Data, {
          encoding: EncodingType.Base64,
        });

        finalImageUri = filePath;
      } else {
        // Download from HTTP URL
        const fileName = `dripfyre_${Date.now()}.jpg`;
        const file = new File(Paths.document, fileName);

        await File.downloadFileAsync(imageUrl, file);

        finalImageUri = file.uri;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Navigate to success screen with data
      router.push({
        pathname: '/success',
        params: {
          imageUri: finalImageUri,
          caption,
          hashtag,
        },
      });
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to save image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !imageUrl) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#f7f8fc', '#eef1ff']}
          style={styles.gradient}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.loadingText}>Loading your canvas...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f7f8fc', '#eef1ff']}
        style={styles.gradient}
      >
        {/* Header - Pinned to Top */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
          <Text style={styles.headerTitle}>Make It Fire! 🔥</Text>
        </Animated.View>

        {/* Image Display - Flexible middle space */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.imageContainer}>
          <ImageDisplay imageUrl={imageUrl} loading={syncing} />

          {/* Processing Overlay */}
          {(processing || syncing) && (
            <View style={styles.processingOverlay}>
              <View style={styles.processingBadge}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.processingBadgeText}>
                  {processing ? '✨ Creating magic...' : '🔄 Syncing...'}
                </Text>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Caption and Hashtag Box - Pinned above buttons */}
        <Animated.View entering={FadeInUp.delay(300).duration(600)} style={styles.captionContainer}>
          <CaptionBox caption={caption} hashtag={hashtag} />
        </Animated.View>

        {/* Action Buttons - Pinned to Bottom */}
        <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.bottomButtonContainer}>
          <VoiceButton
            onRecordingComplete={handleVoiceRecording}
            disabled={processing || syncing}
          />

          <TouchableOpacity
            style={[styles.postButton, (loading || syncing || processing || !imageUrl) && styles.postButtonDisabled]}
            onPress={handlePost}
            disabled={loading || syncing || processing || !imageUrl}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.postButtonGradient}
            >
              <Text style={styles.postButtonText}>Post 🚀</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333',
    letterSpacing: -0.5,
  },
  imageContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  captionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  processingOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  processingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(102, 126, 234, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  processingBadgeText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  postButton: {
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonGradient: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 28,
    minWidth: 140,
  },
  postButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
