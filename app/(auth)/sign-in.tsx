import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { useSignIn } from '@clerk/clerk-expo';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError('');

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-8">
        {/* Logo/Brand */}
        <View className="items-center mb-12">
          <Text className="text-4xl font-bold text-primary-600">KLASS</Text>
          <Text className="text-gray-500 mt-2 text-base">Welcome back</Text>
        </View>

        {/* Form */}
        <View className="gap-4">
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900"
            placeholder="Email address"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900"
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error ? (
            <Text className="text-red-500 text-sm text-center">{error}</Text>
          ) : null}

          <TouchableOpacity
            className="bg-primary-600 rounded-xl py-3.5 mt-2"
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-base">
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500">Don't have an account? </Text>
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity>
              <Text className="text-primary-600 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
