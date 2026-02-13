import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PostWithAuthor } from '@/hooks/usePosts';

const { width } = Dimensions.get('window');

interface PostCardProps {
  post: PostWithAuthor;
  onLike: (postId: string) => void;
  onComment?: (postId: string) => void;
  onPress?: (postId: string) => void;
}

export function PostCard({ post, onLike, onComment, onPress }: PostCardProps) {
  const timeAgo = getTimeAgo(post.created_at);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress?.(post.id)}
      className="bg-white border-b border-gray-100"
    >
      {/* Header */}
      <View className="flex-row items-center px-4 pt-4 pb-2">
        {post.author.avatar_url ? (
          <Image
            source={{ uri: post.author.avatar_url }}
            className="w-10 h-10 rounded-full bg-gray-200"
          />
        ) : (
          <View className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center">
            <Text className="text-indigo-600 font-semibold text-lg">
              {post.author.display_name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
        )}
        <View className="ml-3 flex-1">
          <View className="flex-row items-center">
            <Text className="font-semibold text-gray-900">
              {post.author.display_name || 'Unknown'}
            </Text>
            {post.author.role === 'ADMIN' && (
              <View className="ml-2 px-2 py-0.5 bg-indigo-100 rounded-full">
                <Text className="text-xs text-indigo-700 font-medium">Admin</Text>
              </View>
            )}
            {post.pinned && (
              <Ionicons name="pin" size={14} color="#6366f1" className="ml-1" />
            )}
          </View>
          <Text className="text-gray-500 text-sm">{timeAgo}</Text>
        </View>
      </View>

      {/* Content */}
      <View className="px-4 pb-3">
        <Text className="text-gray-900 text-base leading-6">{post.content}</Text>
      </View>

      {/* Media */}
      {post.media_urls && post.media_urls.length > 0 && (
        <View className="px-4 pb-3">
          {post.media_urls.length === 1 ? (
            <Image
              source={{ uri: post.media_urls[0] }}
              className="w-full h-64 rounded-xl bg-gray-100"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-row flex-wrap">
              {post.media_urls.slice(0, 4).map((url, index) => (
                <Image
                  key={index}
                  source={{ uri: url }}
                  className="w-1/2 h-32 rounded-lg bg-gray-100 p-0.5"
                  resizeMode="cover"
                />
              ))}
            </View>
          )}
        </View>
      )}

      {/* Actions */}
      <View className="flex-row items-center px-4 pb-4 pt-1 border-t border-gray-50">
        <TouchableOpacity
          className="flex-row items-center mr-6"
          onPress={() => onLike(post.id)}
        >
          <Ionicons
            name={post.liked_by_me ? 'heart' : 'heart-outline'}
            size={22}
            color={post.liked_by_me ? '#ef4444' : '#6b7280'}
          />
          <Text
            className={`ml-1.5 ${
              post.liked_by_me ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            {post.likes_count > 0 ? post.likes_count : 'Like'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center mr-6"
          onPress={() => onComment?.(post.id)}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
          <Text className="ml-1.5 text-gray-500">
            {post.comments_count > 0 ? post.comments_count : 'Comment'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="share-outline" size={22} color="#6b7280" />
          <Text className="ml-1.5 text-gray-500">Share</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
