import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserCommunity } from '@/hooks/useCommunities';

interface CommunitySelectorProps {
  communities: UserCommunity[];
  selectedCommunity: UserCommunity | null;
  onSelect: (community: UserCommunity) => void;
}

export function CommunitySelector({
  communities,
  selectedCommunity,
  onSelect,
}: CommunitySelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);

  if (communities.length <= 1) {
    // Don't show selector if user only has one community
    return selectedCommunity ? (
      <View className="flex-row items-center">
        {selectedCommunity.logo_url ? (
          <Image
            source={{ uri: selectedCommunity.logo_url }}
            className="w-8 h-8 rounded-full bg-gray-200"
          />
        ) : (
          <View className="w-8 h-8 rounded-full bg-indigo-600 items-center justify-center">
            <Text className="text-white font-bold text-sm">
              {selectedCommunity.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text className="ml-2 font-semibold text-gray-900 text-lg">
          {selectedCommunity.name}
        </Text>
      </View>
    ) : null;
  }

  return (
    <>
      <TouchableOpacity
        className="flex-row items-center"
        onPress={() => setModalVisible(true)}
      >
        {selectedCommunity?.logo_url ? (
          <Image
            source={{ uri: selectedCommunity.logo_url }}
            className="w-8 h-8 rounded-full bg-gray-200"
          />
        ) : (
          <View className="w-8 h-8 rounded-full bg-indigo-600 items-center justify-center">
            <Text className="text-white font-bold text-sm">
              {selectedCommunity?.name.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
        )}
        <Text className="ml-2 font-semibold text-gray-900 text-lg">
          {selectedCommunity?.name || 'Select Community'}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#6b7280" className="ml-1" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-end">
            <Pressable className="bg-white rounded-t-3xl">
              <View className="p-4 border-b border-gray-100">
                <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                <Text className="text-xl font-bold text-gray-900 text-center">
                  Switch Community
                </Text>
              </View>

              <FlatList
                data={communities}
                keyExtractor={(item) => item.id}
                contentContainerClassName="pb-8"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className={`flex-row items-center px-4 py-4 border-b border-gray-50 ${
                      item.id === selectedCommunity?.id ? 'bg-indigo-50' : ''
                    }`}
                    onPress={() => {
                      onSelect(item);
                      setModalVisible(false);
                    }}
                  >
                    {item.logo_url ? (
                      <Image
                        source={{ uri: item.logo_url }}
                        className="w-12 h-12 rounded-full bg-gray-200"
                      />
                    ) : (
                      <View className="w-12 h-12 rounded-full bg-indigo-600 items-center justify-center">
                        <Text className="text-white font-bold text-lg">
                          {item.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View className="ml-3 flex-1">
                      <Text className="font-semibold text-gray-900 text-base">
                        {item.name}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        {item.member_count} members • {item.role}
                      </Text>
                    </View>
                    {item.id === selectedCommunity?.id && (
                      <Ionicons name="checkmark-circle" size={24} color="#6366f1" />
                    )}
                  </TouchableOpacity>
                )}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
