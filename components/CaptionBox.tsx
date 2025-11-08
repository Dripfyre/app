/**
 * Caption and Hashtag Display Component
 * Shows caption and hashtag without labels
 */

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
        colors={hasContent ? ['#ffffff', '#f9f9f9'] : ['#f5f5f5', '#ececec']}
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
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradient: {
    padding: 20,
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
    color: '#333',
    fontWeight: '500',
  },
  hashtag: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#667eea',
    fontWeight: '600',
  },
  placeholder: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#999',
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
});
