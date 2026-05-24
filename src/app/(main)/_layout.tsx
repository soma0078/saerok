import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create-quote" options={{ presentation: 'modal' }} />
      <Stack.Screen name="setting" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
