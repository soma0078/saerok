import { useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';

export default function Login() {
  const { user, isLoading, loginWithGoogle, loginWithKakao } = useAuth();

  useEffect(() => {
    if (user) router.replace('/(onboarding)/notification');
  }, [user]);

  return (
    <View className="flex-1 bg-white items-center justify-center px-8">
      <Text className="text-2xl font-bold text-gray-900 mb-2">새록</Text>
      <Text className="text-base text-center text-gray-500 mb-16">
        계속하려면 로그인하세요
      </Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#111827" />
      ) : (
        <View className="w-full gap-4">
          <Pressable
            className="bg-white border border-gray-200 rounded-2xl py-4 items-center"
            onPress={() => loginWithGoogle()}
          >
            <Text className="text-gray-900 text-base font-semibold">Google로 계속하기</Text>
          </Pressable>

          <Pressable
            className="bg-yellow-400 rounded-2xl py-4 items-center"
            onPress={() => loginWithKakao()}
          >
            <Text className="text-gray-900 text-base font-semibold">카카오로 계속하기</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
