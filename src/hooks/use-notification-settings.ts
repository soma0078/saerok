import { useCallback, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { storage } from '@/lib/storage';
import type { NotificationSettings } from '@/types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function scheduleNotifications(settings: NotificationSettings): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!settings.isActive) return;

  const quotes = (await storage.quotes.get()) ?? [];
  const categories = (await storage.categories.get()) ?? [];

  const activeCategoryIds = settings.categoryIds.filter((id) =>
    quotes.some((q) => q.categoryId === id)
  );

  if (activeCategoryIds.length === 0) return;

  const periodDays =
    settings.period === '7d' ? 7 : settings.period === '30d' ? 30 : 365;

  const start = new Date(settings.startDate);

  for (let day = 0; day < periodDays; day++) {
    for (const timeStr of settings.dailyTimes) {
      const [hour, minute] = timeStr.split(':').map(Number);
      const trigger = new Date(start);
      trigger.setDate(trigger.getDate() + day);
      trigger.setHours(hour, minute, 0, 0);

      if (trigger <= new Date()) continue;

      const categoryId =
        activeCategoryIds[Math.floor(Math.random() * activeCategoryIds.length)];
      const pool = quotes.filter((q) => q.categoryId === categoryId);
      const quote = pool[Math.floor(Math.random() * pool.length)];
      const category = categories.find((c) => c.id === categoryId);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: category?.name ?? '새록',
          body: quote.content,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: trigger },
      });
    }
  }
}

export function useNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);

  const load = useCallback(async () => {
    const data = await storage.notificationSettings.get();
    setSettings(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const requestPermission = async (): Promise<boolean> => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  };

  const saveSettings = async (next: NotificationSettings): Promise<boolean> => {
    const granted = await requestPermission();
    if (!granted) return false;

    await storage.notificationSettings.set(next);
    setSettings(next);
    await scheduleNotifications(next);
    return true;
  };

  const deactivate = async (): Promise<void> => {
    if (!settings) return;
    const next = { ...settings, isActive: false };
    await storage.notificationSettings.set(next);
    setSettings(next);
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  return { settings, saveSettings, deactivate, reload: load };
}
