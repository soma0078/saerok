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
