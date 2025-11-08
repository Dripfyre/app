/**
 * Caption and Hashtag Display Component
 * Shows caption and hashtag without labels
 */

import { BrandColors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CaptionBoxProps {
  caption: string;
  hashtag: string;
}

export default function CaptionBox({ caption, hashtag }: CaptionBoxProps) {
  const hasContent = caption || hashtag;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={hasContent ? ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.1)'] : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {caption ? (
            <View style={styles.textRow}>
              
              <Text style={styles.caption}>{caption}</Text>
            </View>
          ) : (
            <View style={styles.textRow}>
              <Text style={styles.placeholder}>Captioning...</Text>
            </View>
          )}

          {hashtag ? (
            <View style={styles.textRow}>
              <Text style={styles.hashtag}>{hashtag}</Text>
            </View>
          ) : (
            <View style={styles.textRow}>
              <Text style={styles.placeholder}>Hashtaging...</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 224, 192, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: BrandColors.teal,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    padding: 20,
    borderRadius: 19,
  },
  content: {
    gap: 16,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  icon: {
    fontSize: 18,
    marginTop: 2,
  },
  iconPlaceholder: {
    fontSize: 18,
    marginTop: 2,
    opacity: 0.3,
  },
  caption: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: BrandColors.white,
    fontWeight: '500',
  },
  hashtag: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: BrandColors.limeGreen,
    fontWeight: '700',
  },
  placeholder: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
});
