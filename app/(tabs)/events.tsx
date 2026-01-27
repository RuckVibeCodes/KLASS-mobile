import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';

export default function EventsScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // TODO: Fetch events
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-white"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="px-4 pt-6 pb-4">
        <Text className="text-2xl font-bold text-gray-900">Events</Text>
        <Text className="text-gray-500 mt-1">Upcoming & past events</Text>
      </View>

      {/* Empty state */}
      <View className="flex-1 items-center justify-center px-8 py-20">
        <Text className="text-6xl mb-4">📅</Text>
        <Text className="text-xl font-semibold text-gray-900 text-center">
          No events scheduled
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Live events, workshops, and meetups from your communities will show here.
        </Text>
      </View>
    </ScrollView>
  );
}
