/**
 * Image Display Component
 * Shows synced image with loading state
 */

import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

interface ImageDisplayProps {
  imageUrl: string | null;
  loading?: boolean;
}

export default function ImageDisplay({ imageUrl, loading }: ImageDisplayProps) {
  return (
    <View style={styles.container}>
      {loading ? (
        <LinearGradient
          colors={['#f0f0f0', '#e8e8e8']}
          style={styles.loadingContainer}
        >
          <ActivityIndicator size="large" color="#667eea" />
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
          colors={['#f5f5f5', '#ececec']}
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
    aspectRatio: 4 / 5, // Instagram/social media portrait ratio
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: '100%',
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
    backgroundColor: '#d0d0d0',
    marginBottom: 8,
  },
  iconRect: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#d0d0d0',
  },
});
