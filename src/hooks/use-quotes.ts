import { useCallback, useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import type { Quote } from '@/types';

export function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  const load = useCallback(async () => {
    const data = await storage.quotes.get();
    setQuotes(data ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const addQuote = async (content: string, categoryId: string): Promise<void> => {
    const existing = (await storage.quotes.get()) ?? [];
    const now = new Date().toISOString();
    const quote: Quote = {
      id: Date.now().toString(),
      categoryId,
      content,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [...existing, quote];
    await storage.quotes.set(updated);
    setQuotes(updated);
  };

  const updateQuote = async (id: string, content: string, categoryId: string): Promise<void> => {
    const updated = quotes.map((q) =>
      q.id === id ? { ...q, content, categoryId, updatedAt: new Date().toISOString() } : q
    );
    await storage.quotes.set(updated);
    setQuotes(updated);
  };

  const deleteQuote = async (id: string): Promise<void> => {
    const updated = quotes.filter((q) => q.id !== id);
    await storage.quotes.set(updated);
    setQuotes(updated);
  };

  return { quotes, addQuote, updateQuote, deleteQuote, reload: load };
}
