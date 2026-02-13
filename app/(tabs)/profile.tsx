import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCommunities } from '@/hooks/useCommunities';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();
  const { communities, selectedCommunity } = useCommunities();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="items-center pt-6 pb-6 border-b border-gray-100">
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              className="w-24 h-24 rounded-full bg-gray-200"
            />
          ) : (
            <View className="w-24 h-24 rounded-full bg-indigo-100 items-center justify-center">
              <Text className="text-3xl font-bold text-indigo-600">
                {user?.firstName?.[0]?.toUpperCase() || '?'}
              </Text>
            </View>
          )}
          <Text className="text-xl font-bold text-gray-900 mt-4">
            {user?.fullName || 'User'}
          </Text>
          <Text className="text-gray-500 mt-1">
            {user?.primaryEmailAddress?.emailAddress || ''}
          </Text>

          {/* Edit Profile Button */}
          <TouchableOpacity
            className="mt-4 px-6 py-2 border border-gray-200 rounded-full"
            onPress={() => router.push('/edit-profile')}
          >
            <Text className="text-gray-700 font-medium">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row justify-around py-4 border-b border-gray-100">
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">
              {communities.length}
            </Text>
            <Text className="text-gray-500 text-sm">
              {communities.length === 1 ? 'Community' : 'Communities'}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">0</Text>
            <Text className="text-gray-500 text-sm">Posts</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">0</Text>
            <Text className="text-gray-500 text-sm">Completed</Text>
          </View>
        </View>

        {/* Current Community */}
        {selectedCommunity && (
          <View className="px-4 py-4 border-b border-gray-100">
            <Text className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Current Community
            </Text>
            <View className="flex-row items-center">
              {selectedCommunity.logo_url ? (
                <Image
                  source={{ uri: selectedCommunity.logo_url }}
                  className="w-12 h-12 rounded-full bg-gray-200"
                />
              ) : (
                <View className="w-12 h-12 rounded-full bg-indigo-600 items-center justify-center">
                  <Text className="text-white font-bold text-lg">
                    {selectedCommunity.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View className="ml-3 flex-1">
                <Text className="font-semibold text-gray-900">
                  {selectedCommunity.name}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {selectedCommunity.role} • {selectedCommunity.tier} tier
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Menu Items */}
        <View className="mt-2">
          <Text className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
            Account
          </Text>
          <MenuItem
            icon="people"
            label="My Communities"
            subtitle={`${communities.length} ${communities.length === 1 ? 'community' : 'communities'}`}
            onPress={() => router.push('/communities')}
          />
          <MenuItem
            icon="bookmark"
            label="Saved Posts"
            onPress={() => router.push('/saved')}
          />
          <MenuItem
            icon="notifications"
            label="Notifications"
            onPress={() => router.push('/notifications')}
          />
        </View>

        <View className="mt-4">
          <Text className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
            Support
          </Text>
          <MenuItem
            icon="settings"
            label="Settings"
            onPress={() => router.push('/settings')}
          />
          <MenuItem
            icon="help-circle"
            label="Help & Support"
            onPress={() => router.push('/help')}
          />
          <MenuItem
            icon="document-text"
            label="Terms & Privacy"
            onPress={() => router.push('/terms')}
          />
        </View>

        {/* Sign Out */}
        <View className="mt-6 pb-12 px-4">
          <TouchableOpacity
            className="border border-red-200 bg-red-50 rounded-xl py-3.5"
            onPress={() => signOut()}
          >
            <Text className="text-red-600 text-center font-semibold text-base">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View className="items-center pb-8">
          <Text className="text-gray-400 text-xs">KLASS v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3.5 border-b border-gray-50"
      onPress={onPress}
    >
      <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
        <Ionicons name={icon} size={20} color="#6b7280" />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-base text-gray-900">{label}</Text>
        {subtitle && (
          <Text className="text-gray-500 text-sm">{subtitle}</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
    </TouchableOpacity>
  );
}
