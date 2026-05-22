import { useEffect, useState } from 'react';
import { storage } from '../lib/storage';

export function useOnboardingStatus() {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storage.onboardingCompleted.get().then((value) => {
      setIsCompleted(value ?? false);
      setIsLoading(false);
    });
  }, []);

  return { isCompleted, isLoading };
}
