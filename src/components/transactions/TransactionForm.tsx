'use client';

import { useState } from 'react';
import { Transaction } from '@/types';
import { CATEGORIES } from '@/lib/categories';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, '_id'>) => void;
  initialData?: Transaction;
  onCancel?: () => void;
}

export function TransactionForm({ onSubmit, initialData, onCancel }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    amount: initialData?.amount?.toString() || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : 
          new Date().toISOString().split('T')[0],
    type: initialData?.type || 'expense' as 'income' | 'expense'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
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
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        category: formData.category,
        date: new Date(formData.date).toISOString(),
        type: formData.type
      });

      if (!initialData) {
        setFormData({
          amount: '',
          description: '',
          category: '',
          date: new Date().toISOString().split('T')[0],
          type: 'expense'
        });
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCategories = CATEGORIES.filter(cat => 
    formData.type === 'income' ? cat.id === 'income' : cat.id !== 'income'
  );

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '40px',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    }}>
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
          {initialData ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>
        <p style={{ color: '#6b7280', margin: 0, fontSize: '16px' }}>
          {initialData ? 'Update your transaction details' : 'Track your income and expenses'}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Transaction Type */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '12px'
          }}>
            Transaction Type
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['expense', 'income'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, type: type as 'income' | 'expense', category: '' })}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '16px',
                  border: '2px solid',
                  borderColor: formData.type === type ? '#667eea' : 'rgba(0, 0, 0, 0.1)',
                  background: formData.type === type 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'white',
                  color: formData.type === type ? 'white' : '#6b7280',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'capitalize'
                }}
              >
                {type === 'income' ? '💰 Income' : '💳 Expense'}
              </button>
            ))}
          </div>
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
            Amount ($)
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

        {/* Description */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '12px'
          }}>
            Description
          </label>
          <input
            type="text"
            placeholder="Enter transaction description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              border: `2px solid ${errors.description ? '#ef4444' : 'rgba(0, 0, 0, 0.1)'}`,
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.8)',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              if (!errors.description) {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!errors.description) {
                e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          {errors.description && (
            <p style={{ color: '#ef4444', fontSize: '14px', margin: '8px 0 0 0', fontWeight: '500' }}>
              {errors.description}
            </p>
          )}
        </div>

        {/* Category */}
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
                style={{
                  padding: '16px 12px',
                  borderRadius: '16px',
                  border: '2px solid',
                  borderColor: formData.category === category.id ? category.color : 'rgba(0, 0, 0, 0.1)',
                  background: formData.category === category.id 
                    ? `linear-gradient(135deg, ${category.color}20, ${category.color}40)`
                    : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
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

        {/* Date */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '12px'
          }}>
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              border: `2px solid ${errors.date ? '#ef4444' : 'rgba(0, 0, 0, 0.1)'}`,
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.8)',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              if (!errors.date) {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!errors.date) {
                e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          {errors.date && (
            <p style={{ color: '#ef4444', fontSize: '14px', margin: '8px 0 0 0', fontWeight: '500' }}>
              {errors.date}
            </p>
          )}
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
            {isSubmitting ? 'Saving...' : (initialData ? 'Update Transaction' : 'Add Transaction')}
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
    </div>
  );
}
