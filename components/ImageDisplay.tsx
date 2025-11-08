/**
 * Image Display Component
 * Shows synced image with loading state
 */

import { BrandColors } from '@/constants/theme';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface ImageDisplayProps {
  imageUrl: string | null;
  loading?: boolean;
}

export default function ImageDisplay({ imageUrl, loading }: ImageDisplayProps) {
  return (
    <View style={styles.container}>
      {loading ? (
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
          style={styles.loadingContainer}
        >
          <ActivityIndicator size="large" color={BrandColors.teal} />
        </LinearGradient>
      ) : imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={500}
        />
      ) : (
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.05)']}
          style={styles.placeholderContainer}
        >
          <View style={styles.placeholder}>
            <View style={styles.placeholderIcon}>
              <View style={styles.iconCircle} />
              <View style={styles.iconRect} />
            </View>
          </View>
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1, // Square ratio like success page
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 224, 192, 0.3)',
    shadowColor: BrandColors.teal,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: '60%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 224, 192, 0.3)',
    marginBottom: 8,
  },
  iconRect: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 224, 192, 0.3)',
  },
});
