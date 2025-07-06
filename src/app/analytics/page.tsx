'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { formatCurrency } from '@/lib/utils';
import { Transaction } from '@/types';
import { CATEGORIES } from '@/lib/categories';
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3,
  DollarSign,
  Target,
  Zap,
  Award
} from 'lucide-react';

interface CategoryAnalysis {
  category: string;
  categoryName: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
  count: number;
}

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [categoryAnalysis, setCategoryAnalysis] = useState<CategoryAnalysis[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (transactions.length > 0) {
      calculateAnalytics();
    }
  }, [transactions, timeFilter]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = () => {
    // Filter transactions based on timeFilter
    const now = new Date();
    const filterDate = new Date();
    
    switch (timeFilter) {
      case '7d':
        filterDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        filterDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        filterDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const filteredTransactions = transactions.filter(
      transaction => new Date(transaction.date) >= filterDate
    );

    // Monthly trends
    const monthlyTrends = filteredTransactions.reduce((acc, transaction) => {
      const monthYear = new Date(transaction.date).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
      
      if (!acc[monthYear]) {
        acc[monthYear] = { month: monthYear, income: 0, expenses: 0, net: 0 };
      }
      
      if (transaction.type === 'income') {
        acc[monthYear].income += transaction.amount;
      } else {
        acc[monthYear].expenses += transaction.amount;
      }
      
      acc[monthYear].net = acc[monthYear].income - acc[monthYear].expenses;
      
      return acc;
    }, {} as Record<string, MonthlyData>);

    const trendData = Object.values(monthlyTrends).sort((a, b) => 
      new Date(a.month).getTime() - new Date(b.month).getTime()
    );

    setMonthlyData(trendData);

    // Category analysis
    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryAnalysisData = CATEGORIES.map(category => {
      const categoryTransactions = filteredTransactions.filter(t => 
        t.category === category.id && t.type === 'expense'
      );
      
      const amount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
      const count = categoryTransactions.length;
      const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
      
      return {
        category: category.id,
        categoryName: category.name,
        amount,
        count,
        percentage,
        color: category.color,
        icon: category.icon
      };
    }).filter(cat => cat.amount > 0).sort((a, b) => b.amount - a.amount);

    setCategoryAnalysis(categoryAnalysisData);
  };

 



  if (loading) {
    return (
      <Layout>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '70vh',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '6px solid rgba(102, 126, 234, 0.2)',
            borderTop: '6px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#667eea',
            textAlign: 'center'
          }}>
            Analyzing your financial data...
          </div>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '40px',
        padding: '20px 0'
      }}>
        {/* Enhanced Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          padding: '40px',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          animation: 'slideInDown 0.8s ease-out'
        }}>
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)
            `,
            zIndex: 0
          }} />
          
          <div style={{ 
            position: 'relative',
            zIndex: 1,
            display: 'flex', 
            flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
            justifyContent: 'space-between', 
            alignItems: window.innerWidth <= 768 ? 'flex-start' : 'center', 
            gap: '32px' 
          }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
                }}>
                  <BarChart3 size={28} />
                </div>
                <div>
                  <h1 style={{ 
                    fontSize: '42px', 
                    fontWeight: '900', 
                    margin: '0',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    letterSpacing: '-0.5px'
                  }}>
                    Analytics
                  </h1>
                </div>
              </div>
              <p style={{ 
                fontSize: '18px',
                color: '#6b7280', 
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontWeight: '500'
              }}>
                <Zap size={20} style={{ color: '#667eea' }} />
                Discover insights and optimize your spending patterns
              </p>
            </div>

            {/* Enhanced Time Filter */}
            <div style={{ 
              display: 'flex', 
              gap: '6px', 
              flexWrap: 'wrap',
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '8px',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              {(['7d', '30d', '90d', '1y'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeFilter(period)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '16px',
                    border: 'none',
                    background: timeFilter === period 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'transparent',
                    color: timeFilter === period ? 'white' : '#6b7280',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: timeFilter === period ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: timeFilter === period ? '0 8px 20px rgba(102, 126, 234, 0.3)' : 'none'
                  }}
                >
                  {{
                    '7d': '7 Days',
                    '30d': '30 Days', 
                    '90d': '90 Days',
                    '1y': '1 Year'
                  }[period]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Overview Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : window.innerWidth <= 1024 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: '24px',
          animation: 'slideInUp 0.8s ease-out 0.2s both'
        }}>
          {[
            {
              title: 'Total Income',
              value: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
              icon: TrendingUp,
              gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              shadowColor: 'rgba(16, 185, 129, 0.4)',
              bgPattern: 'radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)'
            },
            {
              title: 'Total Expenses',
              value: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
              icon: TrendingDown,
              gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              shadowColor: 'rgba(245, 158, 11, 0.4)',
              bgPattern: 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)'
            },
            {
              title: 'Net Balance',
              value: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) -
                     transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
              icon: DollarSign,
              gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              shadowColor: 'rgba(59, 130, 246, 0.4)',
              bgPattern: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)'
            },
            {
              title: 'Total Transactions',
              value: transactions.length,
              icon: Award,
              gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              shadowColor: 'rgba(139, 92, 246, 0.4)',
              bgPattern: 'radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
              isCount: true
            }
          ].map((card, index) => (
            <div
              key={card.title}
              style={{
                background: card.gradient,
                borderRadius: '24px',
                padding: '32px',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                transform: 'translateY(0)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `0 20px 40px ${card.shadowColor}`,
                cursor: 'pointer',
                animation: `cardFloat 6s ease-in-out infinite ${index * 0.5}s`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 25px 50px ${card.shadowColor}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = `0 20px 40px ${card.shadowColor}`;
              }}
            >
              {/* Background Pattern */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: card.bgPattern,
                zIndex: 1
              }} />
              
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  marginBottom: '20px' 
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <card.icon size={24} />
                  </div>
                  <span style={{ 
                    fontSize: '16px', 
                    opacity: 0.9,
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                  }}>
                    {card.title}
                  </span>
                </div>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: '800',
                  letterSpacing: '-1px',
                  lineHeight: '1.2'
                }}>
                  {card.isCount ? card.value : formatCurrency(card.value)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth <= 1024 ? '1fr' : '1.2fr 1fr',
          gap: '32px',
          animation: 'slideInUp 0.8s ease-out 0.4s both'
        }}>
          {/* Enhanced Category Breakdown */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '28px',
            padding: '40px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative Elements */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
              borderRadius: '50%',
              zIndex: 1
            }} />
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: '#1f2937',
                  margin: '0 0 12px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <PieChart size={20} color="white" />
                  </div>
                  Expense Breakdown
                </h2>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '16px', fontWeight: '500' }}>
                  Analyze your spending patterns across categories
                </p>
              </div>

              {categoryAnalysis.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#6b7280'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px auto'
                  }}>
                    <PieChart size={40} style={{ opacity: 0.5 }} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                    No Data Available
                  </h3>
                  <p style={{ margin: 0, opacity: 0.7 }}>
                    No expense data found for the selected period
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {categoryAnalysis.slice(0, 6).map((category, index) => (
                    <div
                      key={category.category}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        padding: '24px',
                        background: `linear-gradient(135deg, ${category.color}08, ${category.color}15)`,
                        borderRadius: '20px',
                        border: `2px solid ${category.color}20`,
                        animation: `slideInRight 0.6s ease-out ${index * 0.1}s both`,
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(8px) scale(1.02)';
                        e.currentTarget.style.boxShadow = `0 15px 35px ${category.color}25`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0) scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div 
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          background: `linear-gradient(135deg, ${category.color}40, ${category.color}60)`,
                          boxShadow: `0 8px 20px ${category.color}30`
                        }}
                      >
                        {category.icon}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <h3 style={{ 
                          fontSize: '18px',
                          fontWeight: '700', 
                          color: '#1f2937', 
                          margin: '0 0 8px 0' 
                        }}>
                          {category.categoryName}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            height: '8px',
                            width: '120px',
                            background: 'rgba(0, 0, 0, 0.1)',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              height: '100%',
                              width: `${category.percentage}%`,
                              background: `linear-gradient(90deg, ${category.color}, ${category.color}dd)`,
                              borderRadius: '4px',
                              transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                              animation: `expandBar 1.5s ease-out ${index * 0.1 + 0.5}s both`
                            }}></div>
                          </div>
                          <span style={{ 
                            fontSize: '14px', 
                            color: category.color,
                            fontWeight: '600'
                          }}>
                            {category.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '20px',
                          fontWeight: '800',
                          color: '#1f2937',
                          marginBottom: '4px'
                        }}>
                          {formatCurrency(category.amount)}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#6b7280',
                          background: 'rgba(107, 114, 128, 0.1)',
                          padding: '4px 8px',
                          borderRadius: '8px',
                          fontWeight: '500'
                        }}>
                          {category.count} transaction{category.count !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Monthly Trend */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '28px',
            padding: '40px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative Elements */}
            <div style={{
              position: 'absolute',
              top: '-30px',
              left: '-30px',
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(29, 78, 216, 0.1))',
              borderRadius: '50%',
              zIndex: 1
            }} />
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: '#1f2937',
                  margin: '0 0 12px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <BarChart3 size={20} color="white" />
                  </div>
                  Monthly Flow
                </h2>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '16px', fontWeight: '500' }}>
                  Track your financial trends over time
                </p>
              </div>

              {monthlyData.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#6b7280'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px auto'
                  }}>
                    <BarChart3 size={40} style={{ opacity: 0.5 }} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                    No Trends Available
                  </h3>
                  <p style={{ margin: 0, opacity: 0.7 }}>
                    Add transactions to see monthly trends
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {monthlyData.slice(0, 6).map((month, index) => {
                    const maxAmount = Math.max(...monthlyData.map(m => Math.max(m.income, m.expenses)));
                    return (
                      <div key={month.month} style={{
                        animation: `slideInLeft 0.6s ease-out ${index * 0.1}s both`,
                        padding: '20px',
                        background: 'linear-gradient(135deg, #f8fafc, #ffffff)',
                        borderRadius: '16px',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px'
                        }}>
                          <span style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>
                            {month.month}
                          </span>
                          <span style={{ 
                            fontSize: '16px', 
                            fontWeight: '700',
                            color: month.net >= 0 ? '#10b981' : '#ef4444',
                            background: month.net >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            padding: '4px 12px',
                            borderRadius: '12px'
                          }}>
                            {month.net >= 0 ? '+' : ''}{formatCurrency(month.net)}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '12px', height: '40px', alignItems: 'center' }}>
                          {/* Income bar */}
                          <div style={{
                            height: '16px',
                            width: `${(month.income / maxAmount) * 100}%`,
                            minWidth: '30px',
                            background: 'linear-gradient(90deg, #10b981, #059669)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingRight: '12px',
                            animation: `expandWidth 1.2s ease-out ${index * 0.1 + 0.3}s both`,
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                          }}>
                            <span style={{ 
                              fontSize: '11px', 
                              color: 'white', 
                              fontWeight: '700',
                              whiteSpace: 'nowrap'
                            }}>
                              {formatCurrency(month.income)}
                            </span>
                          </div>
                          
                          {/* Expense bar */}
                          <div style={{
                            height: '16px',
                            width: `${(month.expenses / maxAmount) * 100}%`,
                            minWidth: '30px',
                            background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingRight: '12px',
                            animation: `expandWidth 1.2s ease-out ${index * 0.1 + 0.4}s both`,
                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                          }}>
                            <span style={{ 
                              fontSize: '11px', 
                              color: 'white', 
                              fontWeight: '700',
                              whiteSpace: 'nowrap'
                            }}>
                              {formatCurrency(month.expenses)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Enhanced Legend */}
                  <div style={{
                    display: 'flex',
                    gap: '24px',
                    justifyContent: 'center',
                    marginTop: '20px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.8))',
                    borderRadius: '16px',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        background: 'linear-gradient(90deg, #10b981, #059669)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(16, 185, 129, 0.3)'
                      }} />
                      <span style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>Income</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(245, 158, 11, 0.3)'
                      }} />
                      <span style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>Expenses</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Insights Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '28px',
          padding: '40px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          animation: 'slideInUp 0.8s ease-out 0.6s both',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 10% 20%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 90% 80%, rgba(118, 75, 162, 0.05) 0%, transparent 50%)
            `,
            zIndex: 1
          }} />
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '900',
              color: '#1f2937',
              margin: '0 0 32px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Target size={24} color="white" />
              </div>
              Financial Insights
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(3, 1fr)',
              gap: '24px'
            }}>
            {[ 
              {
                title: 'Top Spending Category',
                value: categoryAnalysis.length > 0 
                  ? `${categoryAnalysis[0].categoryName} - ${formatCurrency(categoryAnalysis[0].amount)}`
                  : 'No data available',
                gradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                border: 'rgba(59, 130, 246, 0.2)',
                titleColor: '#1e40af',
                icon: '🎯'
              },
              {
                title: 'Average Daily Spending',
                value: formatCurrency(
                  transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) / 30
                ),
                gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                border: 'rgba(16, 185, 129, 0.2)',
                titleColor: '#065f46',
                icon: '📊'
              },
              {
                title: 'Savings Rate',
                value: `${(() => {
                  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
                  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
                  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;
                  return savingsRate.toFixed(1);
                })()}%`,
                gradient: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
                border: 'rgba(245, 158, 11, 0.2)',
                titleColor: '#92400e',
                icon: '💰'
              }
            ].map((insight, index) => (
                <div
                  key={insight.title}
                  style={{
                    padding: '28px',
                    background: insight.gradient,
                    borderRadius: '20px',
                    border: `2px solid ${insight.border}`,
                    animation: `slideInUp 0.6s ease-out ${index * 0.1 + 0.2}s both`,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    e.currentTarget.style.boxShadow = `0 15px 30px ${insight.border}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    fontSize: '32px',
                    marginBottom: '12px',
                    textAlign: 'center'
                  }}>
                    {insight.icon}
                  </div>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: '700', 
                    color: insight.titleColor, 
                    margin: '0 0 12px 0',
                    textAlign: 'center'
                  }}>
                    {insight.title}
                  </h3>
                  <p style={{ 
                    color: '#374151', 
                    margin: 0, 
                    fontSize: '16px',
                    fontWeight: '600',
                    textAlign: 'center',
                    lineHeight: '1.4'
                  }}>
                    {insight.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes expandWidth {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        
        @keyframes expandBar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        
        @keyframes cardFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-2px);
          }
        }
      `}</style>
    </Layout>
  );
}