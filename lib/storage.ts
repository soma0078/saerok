import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  onboardingCompleted: '@saerok/onboardingCompleted',
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
};
