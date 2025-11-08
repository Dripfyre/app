/**
 * PostCard Component
 * Displays a single post in the timeline with image, caption, and hashtags
 */

import { BrandColors } from '@/constants/theme';
import { TimelinePost } from '@/services/api';
import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

interface PostCardProps {
  post: TimelinePost;
}

const PostCard = React.memo(({ post }: PostCardProps) => {
  // Format timestamp to relative time
  const getRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContent}>
        {/* Header with name and timestamp */}
        <View style={styles.header}>
          <Text style={styles.name}>{post.name}</Text>
          <Text style={styles.timestamp}>{getRelativeTime(post.timestamp)}</Text>
        </View>

        {/* Image */}
        {post.images && post.images.length > 0 && (
          <Image
            source={{ uri: post.images[0].base64 }}
            style={styles.image}
            contentFit="cover"
          />
        )}

        {/* Caption and Hashtags */}
        <View style={styles.textContent}>
          {post.caption && (
            <Text style={styles.caption}>{post.caption}</Text>
          )}

          {post.hashtags && (
            <Text style={styles.hashtags}>{post.hashtags}</Text>
          )}
        </View>
      </View>
    </View>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  cardContent: {
    padding: 12,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: BrandColors.white,
    letterSpacing: 0.3,
  },
  timestamp: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  textContent: {
    gap: 8,
  },
  caption: {
    fontSize: 15,
    lineHeight: 22,
    color: BrandColors.white,
    fontWeight: '500',
  },
  hashtags: {
    fontSize: 14,
    lineHeight: 20,
    color: BrandColors.teal,
    fontWeight: '600',
  },
});
