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

  const updateCategory = async (id: string, name: string): Promise<void> => {
    const updated = categories.map((c) => (c.id === id ? { ...c, name } : c));
    await storage.categories.set(updated);
    setCategories(updated);
  };

  const deleteCategory = async (id: string): Promise<void> => {
    const updatedCategories = categories.filter((c) => c.id !== id);
    await storage.categories.set(updatedCategories);
    setCategories(updatedCategories);

    const quotes = (await storage.quotes.get()) ?? [];
    await storage.quotes.set(quotes.filter((q) => q.categoryId !== id));
  };

  return { categories, addCategory, updateCategory, deleteCategory, reload: load };
}
