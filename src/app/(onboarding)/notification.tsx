import { View, Text, Pressable, Linking } from 'react-native';
import { router } from 'expo-router';
import { useNotificationPermission } from '@/hooks/use-notification-permission';
import { useOnboardingStatus } from '@/hooks/use-onboarding-status';

export default function NotificationPermission() {
  const { status, request } = useNotificationPermission();
  const { complete } = useOnboardingStatus();

  const finish = async () => {
    await complete();
    router.replace('/(main)');
  };

  const handleRequest = async () => {
    const result = await request();
    if (result === 'granted') await finish();
  };

  const handleNext = () => finish();

  return (
    <View className="flex-1 bg-white items-center justify-center px-8">
      <Text className="text-3xl mb-4">🔔</Text>
      <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
        알림을 허용해 주세요
      </Text>
      <Text className="text-base text-center text-gray-500 mb-16">
        설정한 시간에 저장한 문장을{'\n'}알림으로 전달해 드려요
      </Text>

      {status === 'denied' ? (
        <View className="w-full gap-4">
          <Text className="text-sm text-center text-red-500 mb-2">
            알림 권한이 거부되었습니다.{'\n'}기기 설정에서 알림을 허용해 주세요.
          </Text>
          <Pressable
            className="bg-gray-900 rounded-2xl py-4 items-center"
            onPress={() => Linking.openSettings()}
          >
            <Text className="text-white text-base font-semibold">설정으로 이동</Text>
          </Pressable>
          <Pressable
            className="py-4 items-center"
            onPress={handleNext}
          >
            <Text className="text-gray-400 text-base">나중에 하기</Text>
          </Pressable>
        </View>
      ) : (
        <View className="w-full gap-4">
          <Pressable
            className="bg-gray-900 rounded-2xl py-4 items-center"
            onPress={handleRequest}
          >
            <Text className="text-white text-base font-semibold">알림 허용하기</Text>
          </Pressable>
          {status === 'granted' && (
            <Pressable
              className="py-4 items-center"
              onPress={handleNext}
            >
              <Text className="text-gray-500 text-base font-semibold">다음</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
