import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Category, NotificationSettings, Quote, User } from '@/types';

const KEYS = {
  onboardingCompleted: '@saerok/onboardingCompleted',
  user: '@saerok/user',
  categories: '@saerok/categories',
  quotes: '@saerok/quotes',
  notificationSettings: '@saerok/notificationSettings',
} as const;

async function get<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

async function set<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  onboardingCompleted: {
    get: () => get<boolean>(KEYS.onboardingCompleted),
    set: (value: boolean) => set(KEYS.onboardingCompleted, value),
  },
  user: {
    get: () => get<User>(KEYS.user),
    set: (value: User) => set(KEYS.user, value),
  },
  categories: {
    get: () => get<Category[]>(KEYS.categories),
    set: (value: Category[]) => set(KEYS.categories, value),
  },
  quotes: {
    get: () => get<Quote[]>(KEYS.quotes),
    set: (value: Quote[]) => set(KEYS.quotes, value),
  },
  notificationSettings: {
    get: () => get<NotificationSettings>(KEYS.notificationSettings),
    set: (value: NotificationSettings) => set(KEYS.notificationSettings, value),
  },
  clearAll: () => AsyncStorage.multiRemove(Object.values(KEYS)),
};
