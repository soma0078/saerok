import { useCallback, useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import type { Category } from '@/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  const load = useCallback(async () => {
    const data = await storage.categories.get();
    setCategories(data ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const addCategory = async (name: string): Promise<Category> => {
    const category: Category = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
    };
    const updated = [...categories, category];
    await storage.categories.set(updated);
    setCategories(updated);
    return category;
  };

  return { categories, addCategory, reload: load };
}
