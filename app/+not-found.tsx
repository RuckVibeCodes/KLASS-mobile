import { View, Text, TouchableOpacity } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center bg-white px-8">
        <Text className="text-6xl mb-4">🤔</Text>
        <Text className="text-xl font-semibold text-gray-900">
          Page not found
        </Text>
        <Link href="/(tabs)" asChild>
          <TouchableOpacity className="mt-6 bg-primary-600 rounded-xl px-6 py-3">
            <Text className="text-white font-semibold">Go Home</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}
