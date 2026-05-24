import { storage } from '@/lib/storage';
import type { Quote } from '@/types';

export function useQuotes() {
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
    await storage.quotes.set([...existing, quote]);
  };

  return { addQuote };
}
