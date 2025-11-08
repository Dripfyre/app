/**
 * Caption and Hashtag Display Component
 * Shows caption and hashtag without labels
 */

import { BrandColors } from '@/constants/theme';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface CaptionBoxProps {
  caption: string;
  hashtag: string;
}

export default function CaptionBox({ caption, hashtag }: CaptionBoxProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: 200,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  scrollView: {
    maxHeight: 200,
  },
  content: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 12,
    gap: 12,
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
