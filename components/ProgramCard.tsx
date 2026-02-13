import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProgramWithProgress } from '@/hooks/usePrograms';

interface ProgramCardProps {
  program: ProgramWithProgress;
  onPress: (programId: string) => void;
}

export function ProgramCard({ program, onPress }: ProgramCardProps) {
  const progress =
    program.lessons_count > 0
      ? Math.round((program.completed_lessons / program.lessons_count) * 100)
      : 0;

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl shadow-sm overflow-hidden mx-4 mb-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
      activeOpacity={0.9}
      onPress={() => onPress(program.id)}
    >
      {/* Thumbnail */}
      {program.thumbnail_url ? (
        <Image
          source={{ uri: program.thumbnail_url }}
          className="w-full h-40 bg-gray-100"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-40 bg-gradient-to-br from-indigo-500 to-purple-600 items-center justify-center">
          <Ionicons name="school" size={48} color="rgba(255,255,255,0.8)" />
        </View>
      )}

      {/* Content */}
      <View className="p-4">
        {/* Visibility badge */}
        <View className="flex-row items-center mb-2">
          {program.visibility === 'paid' && (
            <View className="flex-row items-center bg-amber-100 px-2 py-0.5 rounded-full mr-2">
              <Ionicons name="star" size={12} color="#d97706" />
              <Text className="text-amber-700 text-xs font-medium ml-1">Premium</Text>
            </View>
          )}
          {program.visibility === 'members' && (
            <View className="flex-row items-center bg-indigo-100 px-2 py-0.5 rounded-full mr-2">
              <Ionicons name="people" size={12} color="#4f46e5" />
              <Text className="text-indigo-700 text-xs font-medium ml-1">Members</Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text className="text-lg font-bold text-gray-900 mb-1" numberOfLines={2}>
          {program.title}
        </Text>

        {/* Description */}
        {program.description && (
          <Text className="text-gray-500 text-sm mb-3" numberOfLines={2}>
            {program.description}
          </Text>
        )}

        {/* Stats */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="book-outline" size={16} color="#6b7280" />
            <Text className="text-gray-500 text-sm ml-1">
              {program.lessons_count} {program.lessons_count === 1 ? 'lesson' : 'lessons'}
            </Text>
          </View>

          {program.completed_lessons > 0 && (
            <View className="flex-row items-center">
              <View className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden mr-2">
                <View
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </View>
              <Text className="text-indigo-600 text-sm font-medium">{progress}%</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
