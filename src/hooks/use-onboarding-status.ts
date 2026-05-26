import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";

export function useOnboardingStatus() {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([storage.onboardingCompleted.get(), storage.user.get()]).then(
      ([completed, user]) => {
        setIsCompleted((completed ?? false) && user !== null);
        setIsLoading(false);
      },
    );
  }, []);

  const complete = async () => {
    await storage.onboardingCompleted.set(true);
    setIsCompleted(true);
  };

  const reset = async () => {
    await storage.onboardingCompleted.set(false);
    setIsCompleted(false);
  };

  return { isCompleted, isLoading, complete, reset };
}
