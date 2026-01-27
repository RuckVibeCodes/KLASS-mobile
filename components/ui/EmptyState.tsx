import { View, Text, TouchableOpacity } from 'react-native';

interface EmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  emoji,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-20">
      <Text className="text-6xl mb-4">{emoji}</Text>
      <Text className="text-xl font-semibold text-gray-900 text-center">
        {title}
      </Text>
      <Text className="text-gray-500 text-center mt-2">{description}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity
          className="mt-6 bg-primary-600 rounded-xl px-6 py-3"
          onPress={onAction}
        >
          <Text className="text-white font-semibold">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
