export interface NotificationSettings {
  categoryIds: string[];
  dailyTimes: string[];   // ["09:00", "21:00"]
  period: 'indefinite' | '7d' | '30d';
  startDate: string;      // ISO
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export interface Quote {
  id: string;
  categoryId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
