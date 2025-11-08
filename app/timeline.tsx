/**
 * Timeline Screen
 * Displays paginated list of posts from the community
 */

import PostCard from '@/components/PostCard';
import { BrandColors } from '@/constants/theme';
import { fetchTimeline, TimelinePost } from '@/services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function TimelineScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<TimelinePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async (page: number = 1, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await fetchTimeline(page, 10);

      if (response.success) {
        if (append) {
          setPosts((prev) => [...prev, ...response.data.posts]);
        } else {
          setPosts(response.data.posts);
        }
        setCurrentPage(response.data.pagination.currentPage);
        setHasNextPage(response.data.pagination.hasNextPage);
      }
    } catch (error) {
      console.error('Timeline load error:', error);
      Alert.alert('Error', 'Failed to load timeline. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadTimeline(1, false);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasNextPage) {
      loadTimeline(currentPage + 1, true);
    }
  };

  const renderPost = ({ item }: { item: TimelinePost }) => (
    <PostCard post={item} />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={BrandColors.teal} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No posts yet</Text>
        <Text style={styles.emptySubtext}>Be the first to create something amazing!</Text>
      </View>
    );
  };

  if (loading && posts.length === 0) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[BrandColors.black, BrandColors.black]}
          style={styles.gradient}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={BrandColors.teal} />
            <Text style={styles.loadingText}>Loading timeline...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[BrandColors.black, BrandColors.black]}
        style={styles.gradient}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Timeline</Text>
          <View style={styles.backButton} />
        </Animated.View>

        {/* Posts List */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.listContainer}>
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.sessionId}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={BrandColors.teal}
                colors={[BrandColors.teal]}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
          />
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
    color: BrandColors.teal,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 60,
  },
  backButtonText: {
    fontSize: 16,
    color: BrandColors.white,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: BrandColors.white,
    letterSpacing: -0.5,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.white,
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
});
