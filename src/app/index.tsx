import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useOnboardingStatus } from '@/hooks/use-onboarding-status';

export default function Index() {
  const { isCompleted, isLoading } = useOnboardingStatus();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) return null;

  return <Redirect href={isCompleted ? '/(main)' : '/(onboarding)'} />;
}
