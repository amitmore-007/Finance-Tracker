export interface Transaction {
  _id?: string;
  amount: number;
  description: string;
  category: string;
  date: string; // Changed from Date to string for better serialization
  type: 'income' | 'expense';
  createdAt?: string;
  updatedAt?: string;
}

export interface Budget {
  _id?: string;
  category: string;
  amount: number;
  month: number;
  year: number;
  spent?: number;
  period: 'monthly' | 'weekly' | 'yearly';
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}
