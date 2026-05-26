import { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useCategories } from '@/hooks/use-categories';
import { useNotificationPermission } from '@/hooks/use-notification-permission';
import { useNotificationSettings } from '@/hooks/use-notification-settings';
import type { NotificationSettings } from '@/types';

const TIME_OPTIONS = ['07:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
const PERIOD_OPTIONS: { label: string; value: NotificationSettings['period'] }[] = [
  { label: '무기한', value: 'indefinite' },
  { label: '7일', value: '7d' },
  { label: '30일', value: '30d' },
];

export default function Setting() {
  const { categories } = useCategories();
  const { request } = useNotificationPermission();
  const { settings, saveSettings, deactivate } = useNotificationSettings();

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>(['09:00']);
  const [period, setPeriod] = useState<NotificationSettings['period']>('indefinite');

  useEffect(() => { request(); }, []);

  useEffect(() => {
    if (!settings) return;
    setSelectedCategoryIds(settings.categoryIds);
    setSelectedTimes(settings.dailyTimes);
    setPeriod(settings.period);
  }, [settings]);

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleTime = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time].sort()
    );
  };

  const handleSave = async () => {
    if (selectedCategoryIds.length === 0) {
      Alert.alert('카테고리를 선택해주세요');
      return;
    }
    if (selectedTimes.length === 0) {
      Alert.alert('알림 시간을 선택해주세요');
      return;
    }

    const saved = await saveSettings({
      categoryIds: selectedCategoryIds,
      dailyTimes: selectedTimes,
      period,
      startDate: new Date().toISOString(),
      isActive: true,
    });

    if (saved) {
      router.back();
    } else {
      Alert.alert(
        '알림 권한이 필요해요',
        '기기 설정에서 새록의 알림을 허용해 주세요.',
        [
          { text: '취소', style: 'cancel' },
          { text: '설정으로 이동', onPress: () => Linking.openSettings() },
        ],
      );
    }
  };

  const handleDeactivate = () => {
    Alert.alert('알림 끄기', '예약된 알림을 모두 취소할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '끄기', style: 'destructive', onPress: async () => { await deactivate(); router.back(); } },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 pt-14 pb-4 border-b border-gray-100">
        <Pressable onPress={() => router.back()}>
          <Text className="text-base text-gray-500">닫기</Text>
        </Pressable>
        <Text className="text-base font-semibold text-gray-900">알림 설정</Text>
        <Pressable onPress={handleSave}>
          <Text className="text-base font-semibold text-gray-900">저장</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5">
        <View className="mt-6">
          <Text className="text-sm font-medium text-gray-500 mb-3">알림 카테고리</Text>
          <View className="flex-row flex-wrap gap-2">
            {categories.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => toggleCategory(cat.id)}
                className={`px-4 py-2 rounded-full border ${
                  selectedCategoryIds.includes(cat.id)
                    ? 'bg-gray-900 border-gray-900'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text
                  className={`text-sm ${
                    selectedCategoryIds.includes(cat.id) ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {cat.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="mt-8">
          <Text className="text-sm font-medium text-gray-500 mb-3">알림 시간</Text>
          <View className="flex-row flex-wrap gap-2">
            {TIME_OPTIONS.map((time) => (
              <Pressable
                key={time}
                onPress={() => toggleTime(time)}
                className={`px-4 py-2 rounded-full border ${
                  selectedTimes.includes(time)
                    ? 'bg-gray-900 border-gray-900'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text
                  className={`text-sm ${
                    selectedTimes.includes(time) ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {time}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="mt-8">
          <Text className="text-sm font-medium text-gray-500 mb-3">스케줄링 기간</Text>
          <View className="flex-row gap-2">
            {PERIOD_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => setPeriod(opt.value)}
                className={`px-4 py-2 rounded-full border ${
                  period === opt.value
                    ? 'bg-gray-900 border-gray-900'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text
                  className={`text-sm ${
                    period === opt.value ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {settings?.isActive ? (
          <Pressable onPress={handleDeactivate} className="mt-10 py-3 items-center">
            <Text className="text-sm text-red-400">알림 끄기</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}
