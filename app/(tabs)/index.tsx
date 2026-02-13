import React from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usePosts } from '@/hooks/usePosts';
import { useCommunities } from '@/hooks/useCommunities';
import { PostCard } from '@/components/PostCard';
import { CommunitySelector } from '@/components/CommunitySelector';

export default function HomeScreen() {
  const router = useRouter();
  const {
    communities,
    selectedCommunity,
    selectCommunity,
    loading: communitiesLoading,
  } = useCommunities();

  const {
    posts,
    loading: postsLoading,
    refreshing,
    refresh,
    likePost,
    error,
  } = usePosts({
    communityId: selectedCommunity?.id,
  });

  const loading = communitiesLoading || postsLoading;

  const handleCommentPress = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  const handlePostPress = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="text-gray-500 mt-4">Loading your feed...</Text>
        </View>
      );
    }

    if (!selectedCommunity) {
      return (
        <View className="flex-1 items-center justify-center px-8 py-20">
          <Text className="text-6xl mb-4">🏠</Text>
          <Text className="text-xl font-semibold text-gray-900 text-center">
            No communities yet
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Join a community to see posts and connect with others.
          </Text>
          <TouchableOpacity
            className="mt-6 bg-indigo-600 px-6 py-3 rounded-full"
            onPress={() => router.push('/explore')}
          >
            <Text className="text-white font-semibold">Explore Communities</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 items-center justify-center px-8 py-20">
          <Text className="text-6xl mb-4">⚠️</Text>
          <Text className="text-xl font-semibold text-gray-900 text-center">
            Something went wrong
          </Text>
          <Text className="text-gray-500 text-center mt-2">{error}</Text>
          <TouchableOpacity
            className="mt-6 bg-indigo-600 px-6 py-3 rounded-full"
            onPress={refresh}
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View className="flex-1 items-center justify-center px-8 py-20">
        <Text className="text-6xl mb-4">📝</Text>
        <Text className="text-xl font-semibold text-gray-900 text-center">
          No posts yet
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Be the first to share something with the community!
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <CommunitySelector
          communities={communities}
          selectedCommunity={selectedCommunity}
          onSelect={selectCommunity}
        />
        <View className="flex-row items-center">
          <TouchableOpacity className="p-2">
            <Ionicons name="search-outline" size={24} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 ml-1">
            <Ionicons name="notifications-outline" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={likePost}
            onComment={handleCommentPress}
            onPress={handlePostPress}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="#6366f1"
          />
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB for new post */}
      {selectedCommunity && (
        <TouchableOpacity
          className="absolute bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-full items-center justify-center shadow-lg"
          style={{
            shadowColor: '#6366f1',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          onPress={() => router.push('/new-post')}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
