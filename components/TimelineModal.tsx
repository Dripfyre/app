/**
 * Timeline Modal Component
 * Full-screen modal that slides up from bottom with timeline content
 */

import PostCard from '@/components/PostCard';
import { BrandColors } from '@/constants/theme';
import { fetchTimeline, TimelinePost } from '@/services/api';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface TimelineModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TimelineModal({ visible, onClose }: TimelineModalProps) {
  const [posts, setPosts] = useState<TimelinePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    if (visible) {
      loadTimeline();
    }
  }, [visible]);

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

  const renderPost = React.useCallback(({ item }: { item: TimelinePost }) => (
    <PostCard post={item} />
  ), []);

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

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Feel the 🔥</Text>
              <View style={styles.closeButton} />
            </View>
          </View>

          {/* Loading State */}
          {loading && posts.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={BrandColors.teal} />
              <Text style={styles.loadingText}>Loading timeline...</Text>
            </View>
          ) : (
            /* Posts List */
            <View style={styles.listContainer}>
              <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item, index) => `${item.sessionId}-${index}`}
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
                removeClippedSubviews={false}
                maxToRenderPerBatch={5}
                updateCellsBatchingPeriod={50}
                initialNumToRender={3}
                windowSize={5}
              />
            </View>
          )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: BrandColors.black,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: BrandColors.white,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: BrandColors.white,
    letterSpacing: -0.5,
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
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
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
