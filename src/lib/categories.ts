import { Category } from '@/types';

export const CATEGORIES: Category[] = [
  { id: 'food', name: 'Food & Dining', icon: '🍕', color: '#FF6B6B' },
  { id: 'transport', name: 'Transportation', icon: '🚗', color: '#4ECDC4' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#45B7D1' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#96CEB4' },
  { id: 'bills', name: 'Bills & Utilities', icon: '⚡', color: '#FECA57' },
  { id: 'healthcare', name: 'Healthcare', icon: '⚕️', color: '#FF9FF3' },
  { id: 'education', name: 'Education', icon: '📚', color: '#54A0FF' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: '#5F27CD' },
  { id: 'income', name: 'Income', icon: '💰', color: '#00D2D3' },
  { id: 'other', name: 'Other', icon: '📦', color: '#8395A7' },
];

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(cat => cat.id === id);
}

export function getCategoryColor(categoryId: string): string {
  const category = getCategoryById(categoryId);
  return category?.color || '#8395A7';
}
