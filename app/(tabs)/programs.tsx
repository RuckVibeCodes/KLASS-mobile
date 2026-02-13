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
import { usePrograms } from '@/hooks/usePrograms';
import { useCommunities } from '@/hooks/useCommunities';
import { ProgramCard } from '@/components/ProgramCard';

export default function ProgramsScreen() {
  const router = useRouter();
  const { selectedCommunity, loading: communitiesLoading } = useCommunities();

  const {
    programs,
    loading: programsLoading,
    refreshing,
    refresh,
    error,
  } = usePrograms({
    communityId: selectedCommunity?.id,
  });

  const loading = communitiesLoading || programsLoading;

  const handleProgramPress = (programId: string) => {
    router.push(`/program/${programId}`);
  };

  const renderHeader = () => (
    <View className="px-4 pt-6 pb-4">
      <Text className="text-2xl font-bold text-gray-900">Programs</Text>
      <Text className="text-gray-500 mt-1">
        Learn and grow with structured courses
      </Text>
    </View>
  );

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="text-gray-500 mt-4">Loading programs...</Text>
        </View>
      );
    }

    if (!selectedCommunity) {
      return (
        <View className="flex-1 items-center justify-center px-8 py-20">
          <Text className="text-6xl mb-4">📚</Text>
          <Text className="text-xl font-semibold text-gray-900 text-center">
            No community selected
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Join a community to access learning programs.
          </Text>
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
        <Text className="text-6xl mb-4">📖</Text>
        <Text className="text-xl font-semibold text-gray-900 text-center">
          No programs yet
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Check back soon for new learning content.
        </Text>
      </View>
    );
  };

  // Separate featured (first) from regular programs
  const featuredProgram = programs.length > 0 ? programs[0] : null;
  const regularPrograms = programs.slice(1);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <FlatList
        data={regularPrograms}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {featuredProgram && (
              <View className="mb-4">
                <View className="px-4 mb-2">
                  <View className="flex-row items-center">
                    <Ionicons name="flame" size={16} color="#ef4444" />
                    <Text className="text-sm font-medium text-gray-700 ml-1">
                      Featured
                    </Text>
                  </View>
                </View>
                <ProgramCard
                  program={featuredProgram}
                  onPress={handleProgramPress}
                />
              </View>
            )}
            {regularPrograms.length > 0 && (
              <View className="px-4 mb-2 mt-2">
                <Text className="text-sm font-medium text-gray-700">
                  All Programs
                </Text>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <ProgramCard program={item} onPress={handleProgramPress} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="#6366f1"
          />
        }
        ListEmptyComponent={
          programs.length === 0 ? renderEmptyState : null
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
