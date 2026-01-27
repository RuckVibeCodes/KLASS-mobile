import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { useSignUp } from '@clerk/clerk-expo';

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const handleSignUp = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError('');

    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || undefined,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError('');

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-white"
      >
        <View className="flex-1 justify-center px-8">
          <View className="items-center mb-12">
            <Text className="text-4xl font-bold text-primary-600">KLASS</Text>
            <Text className="text-gray-500 mt-2 text-base">Check your email</Text>
          </View>

          <View className="gap-4">
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900 text-center tracking-widest"
              placeholder="Verification code"
              placeholderTextColor="#9CA3AF"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
            />

            {error ? (
              <Text className="text-red-500 text-sm text-center">{error}</Text>
            ) : null}

            <TouchableOpacity
              className="bg-primary-600 rounded-xl py-3.5 mt-2"
              onPress={handleVerification}
              disabled={loading}
            >
              <Text className="text-white text-center font-semibold text-base">
                {loading ? 'Verifying...' : 'Verify Email'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-8">
        {/* Logo/Brand */}
        <View className="items-center mb-12">
          <Text className="text-4xl font-bold text-primary-600">KLASS</Text>
          <Text className="text-gray-500 mt-2 text-base">Create your account</Text>
        </View>

        {/* Form */}
        <View className="gap-4">
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900"
            placeholder="Full name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />
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
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-base">
              {loading ? 'Creating account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500">Already have an account? </Text>
          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity>
              <Text className="text-primary-600 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
