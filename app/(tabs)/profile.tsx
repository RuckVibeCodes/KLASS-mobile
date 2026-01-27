import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <View className="flex-1 bg-white">
      {/* Profile Header */}
      <View className="items-center pt-8 pb-6 border-b border-gray-200">
        {user?.imageUrl ? (
          <Image
            source={{ uri: user.imageUrl }}
            className="w-24 h-24 rounded-full"
          />
        ) : (
          <View className="w-24 h-24 rounded-full bg-primary-100 items-center justify-center">
            <Text className="text-3xl font-bold text-primary-600">
              {user?.firstName?.[0] || '?'}
            </Text>
          </View>
        )}
        <Text className="text-xl font-bold text-gray-900 mt-4">
          {user?.fullName || 'User'}
        </Text>
        <Text className="text-gray-500 mt-1">
          {user?.primaryEmailAddress?.emailAddress || ''}
        </Text>
      </View>

      {/* Menu Items */}
      <View className="mt-4">
        <MenuItem icon="people" label="My Communities" onPress={() => {}} />
        <MenuItem icon="bookmark" label="Saved Posts" onPress={() => {}} />
        <MenuItem icon="notifications" label="Notifications" onPress={() => {}} />
        <MenuItem icon="settings" label="Settings" onPress={() => {}} />
        <MenuItem icon="help-circle" label="Help & Support" onPress={() => {}} />
      </View>

      {/* Sign Out */}
      <View className="mt-auto pb-12 px-4">
        <TouchableOpacity
          className="border border-red-300 rounded-xl py-3.5"
          onPress={() => signOut()}
        >
          <Text className="text-red-500 text-center font-semibold text-base">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3.5 border-b border-gray-100"
      onPress={onPress}
    >
      <Ionicons name={icon} size={22} color="#6B7280" />
      <Text className="text-base text-gray-900 ml-3 flex-1">{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
    </TouchableOpacity>
  );
}
