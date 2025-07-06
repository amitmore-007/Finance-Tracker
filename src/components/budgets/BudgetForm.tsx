'use client';

import { useState } from 'react';
import { CATEGORIES } from '@/lib/categories';
import { motion } from 'framer-motion';

interface Budget {
  _id?: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  month: number;
  year: number;
}

interface BudgetFormProps {
  onSubmit: (budget: Omit<Budget, '_id'>) => void;
  initialData?: Budget;
  onCancel?: () => void;
  existingCategories?: string[];
}

export function BudgetForm({ onSubmit, initialData, onCancel, existingCategories = [] }: BudgetFormProps) {
  const currentDate = new Date();
  const [formData, setFormData] = useState({
    category: initialData?.category || '',
    amount: initialData?.amount?.toString() || '',
    month: initialData?.month?.toString() || (currentDate.getMonth() + 1).toString(),
    year: initialData?.year?.toString() || currentDate.getFullYear().toString(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableCategories = CATEGORIES.filter(cat => 
    cat.id !== 'income' && (!existingCategories.includes(cat.id) || cat.id === initialData?.category)
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.month) {
      newErrors.month = 'Month is required';
    }

    if (!formData.year) {
      newErrors.year = 'Year is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        category: formData.category,
        amount: parseFloat(formData.amount),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        period: 'monthly'
      });

      if (!initialData) {
        setFormData({
          category: '',
          amount: '',
          month: (currentDate.getMonth() + 1).toString(),
          year: currentDate.getFullYear().toString(),
        });
      }
    } catch (error) {
      console.error('Error submitting budget:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() + i);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '40px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}
    >
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#1f2937',
          margin: '0 0 8px 0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}>
          {initialData ? 'Edit Budget' : 'Create Budget'}
        </h2>
        <p style={{ color: '#6b7280', margin: 0, fontSize: '16px' }}>
          {initialData ? 'Update your budget details' : 'Set spending limits for better financial control'}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Category Selection */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '12px'
          }}>
            Category
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px'
          }}>
            {availableCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setFormData({ ...formData, category: category.id })}
                disabled={!!initialData}
                style={{
                  padding: '16px 12px',
                  borderRadius: '16px',
                  border: '2px solid',
                  borderColor: formData.category === category.id ? category.color : 'rgba(0, 0, 0, 0.1)',
                  background: formData.category === category.id 
                    ? `linear-gradient(135deg, ${category.color}20, ${category.color}40)`
                    : 'white',
                  cursor: initialData ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: initialData ? 0.6 : 1
                }}
              >
                <span style={{ fontSize: '24px' }}>{category.icon}</span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: formData.category === category.id ? category.color : '#6b7280'
                }}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
          {errors.category && (
            <p style={{ color: '#ef4444', fontSize: '14px', margin: '8px 0 0 0', fontWeight: '500' }}>
              {errors.category}
            </p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '12px'
          }}>
            Budget Amount ($)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '18px',
              fontWeight: '600',
              border: `2px solid ${errors.amount ? '#ef4444' : 'rgba(0, 0, 0, 0.1)'}`,
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.8)',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              if (!errors.amount) {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!errors.amount) {
                e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          {errors.amount && (
            <p style={{ color: '#ef4444', fontSize: '14px', margin: '8px 0 0 0', fontWeight: '500' }}>
              {errors.amount}
            </p>
          )}
        </div>

        {/* Month and Year */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '12px'
            }}>
              Month
            </label>
            <select
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              disabled={!!initialData}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                border: `2px solid ${errors.month ? '#ef4444' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.8)',
                outline: 'none',
                transition: 'all 0.3s ease',
                cursor: initialData ? 'not-allowed' : 'pointer',
                opacity: initialData ? 0.6 : 1
              }}
            >
              <option value="">Select month</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            {errors.month && (
              <p style={{ color: '#ef4444', fontSize: '14px', margin: '8px 0 0 0', fontWeight: '500' }}>
                {errors.month}
              </p>
            )}
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '12px'
            }}>
              Year
            </label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              disabled={!!initialData}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                border: `2px solid ${errors.year ? '#ef4444' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.8)',
                outline: 'none',
                transition: 'all 0.3s ease',
                cursor: initialData ? 'not-allowed' : 'pointer',
                opacity: initialData ? 0.6 : 1
              }}
            >
              <option value="">Select year</option>
              {years.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
            {errors.year && (
              <p style={{ color: '#ef4444', fontSize: '14px', margin: '8px 0 0 0', fontWeight: '500' }}>
                {errors.year}
              </p>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: '18px',
              borderRadius: '16px',
              border: 'none',
              background: isSubmitting 
                ? 'rgba(102, 126, 234, 0.5)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)';
              }
            }}
          >
            {isSubmitting ? 'Creating...' : (initialData ? 'Update Budget' : 'Create Budget')}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '18px',
                borderRadius: '16px',
                border: '2px solid rgba(0, 0, 0, 0.1)',
                background: 'white',
                color: '#6b7280',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.color = '#667eea';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.color = '#6b7280';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
}
