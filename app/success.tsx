/**
 * Page 3: Success/Post Confirmation Screen
 * Shows posted image with caption and hashtag, and options to start new session
 */

import { BrandColors } from '@/constants/theme';
import { clearSessionId } from '@/utils/session';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import TimelineModal from '@/components/TimelineModal';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function SuccessScreen() {
  const params = useLocalSearchParams<{
    imageUri: string;
    caption: string;
    hashtag: string;
  }>();

  const [showTimeline, setShowTimeline] = useState(false);

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

  const handleOpenTimeline = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowTimeline(true);
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

          {/* Timeline indicator - static - pinned to bottom */}
          <View style={styles.timelineIndicator}>
            <TouchableOpacity
              onPress={handleOpenTimeline}
              activeOpacity={0.7}
              style={styles.arrowContainer}
            >
              <Text style={styles.timelineHint}>Timeline</Text>
              <Text style={styles.timelineArrow}>↓</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Timeline Modal */}
      <TimelineModal visible={showTimeline} onClose={() => setShowTimeline(false)} />
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
    gap: 12,
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
  timelineIndicator: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 30,
    backgroundColor: '#000000',
  },
  arrowContainer: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 20,
    paddingHorizontal: 50,
  },
  timelineArrow: {
    fontSize: 64,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '800',
    lineHeight: 64,
  },
  timelineHint: {
    fontSize: 24,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.95)',
    letterSpacing: 1.2,
  },
});
