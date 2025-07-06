'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  CreditCard, 
  BarChart3, 
  Target,
  TrendingUp,
  Menu,
  X,
  Wallet
} from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Overview & insights',
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    href: '/transactions',
    label: 'Transactions',
    icon: CreditCard,
    description: 'Manage payments',
    gradient: 'from-green-500 to-teal-600'
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: BarChart3,
    description: 'Reports & trends',
    gradient: 'from-orange-500 to-red-600'
  },
  {
    href: '/budgets',
    label: 'Budgets',
    icon: Target,
    description: 'Track spending',
    gradient: 'from-purple-500 to-pink-600'
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  if (!mounted) return null;

  return (
    <>
      {/* Enhanced Mobile menu button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          zIndex: 50,
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          border: 'none',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 40px rgba(102, 126, 234, 0.4)',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        className="lg:hidden"
      >
        <motion.div
          animate={{ rotate: isMobileOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.div>
      </motion.button>

      {/* Enhanced Desktop Sidebar */}
      <motion.aside
        initial={{ x: -320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.6 }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          width: '280px',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)',
          backdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '30px 0 60px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden'
        }}
        className="hidden lg:flex"
      >
        {/* Animated background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)
          `,
          animation: 'float 6s ease-in-out infinite'
        }} />

        {/* Enhanced Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            padding: '40px 32px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            zIndex: 2
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)',
                position: 'relative'
              }}
            >
              <Wallet size={24} color="white" />
            </motion.div>
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '900',
                margin: 0,
                background: 'linear-gradient(135deg, #fff 0%, #e2e8f0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.5px'
              }}>
                FinanceTracker
              </h1>
              <p style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.6)',
                margin: 0,
                fontWeight: '500',
                letterSpacing: '0.5px'
              }}>
                Smart Money Management
              </p>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Navigation */}
        <nav style={{ flex: 1, padding: '24px 16px', position: 'relative', zIndex: 2 }}>
          <div style={{ marginBottom: '24px' }}>
            <p style={{
              fontSize: '11px',
              fontWeight: '700',
              color: 'rgba(255, 255, 255, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              margin: '0 0 16px 16px'
            }}>
              Main Menu
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    whileHover={{ x: 6 }}
                  >
                    <Link
                      href={item.href}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px 20px',
                        borderRadius: '14px',
                        textDecoration: 'none',
                        color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)',
                        background: isActive 
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : 'transparent',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        transform: isActive ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: isActive ? '0 12px 30px rgba(102, 126, 234, 0.3)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {/* Animated background for active state */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '14px',
                            zIndex: -1
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      
                      {/* Icon with animation */}
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        style={{
                          transform: isActive ? 'scale(1.1)' : 'scale(1)',
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        <item.icon size={20} />
                      </motion.div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '15px',
                          fontWeight: '700',
                          marginBottom: '2px',
                          letterSpacing: '-0.3px'
                        }}>
                          {item.label}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          opacity: 0.8,
                          fontWeight: '500'
                        }}>
                          {item.description}
                        </div>
                      </div>

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: 'white',
                            boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)'
                          }}
                        />
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Enhanced Bottom Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{
            padding: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            zIndex: 2
          }}
        >
          <motion.div 
            whileHover={{ y: -4, scale: 1.02 }}
            style={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ marginBottom: '12px' }}>
              <TrendingUp size={24} color="#667eea" />
            </div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '800',
              color: 'white',
              margin: '0 0 4px 0',
              letterSpacing: '-0.3px'
            }}>
              Track Your Progress
            </h3>
            <p style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: 0,
              lineHeight: '1.4',
              fontWeight: '500'
            }}>
              Stay on top of your financial goals
            </p>
          </motion.div>
        </motion.div>
      </motion.aside>

      {/* Enhanced Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                zIndex: 45,
                backdropFilter: 'blur(8px)'
              }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden"
            />
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed',
                left: 0,
                top: 0,
                height: '100vh',
                width: '280px',
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)',
                backdropFilter: 'blur(24px)',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '30px 0 60px rgba(0, 0, 0, 0.4)',
                overflow: 'hidden'
              }}
              className="lg:hidden"
            >
              {/* Same enhanced content as desktop but optimized for mobile */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `
                  radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)
                `,
                animation: 'float 6s ease-in-out infinite'
              }} />

              <div style={{
                padding: '80px 24px 24px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                zIndex: 2
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)'
                  }}>
                    <Wallet size={24} color="white" />
                  </div>
                  <div>
                    <h1 style={{
                      fontSize: '24px',
                      fontWeight: '900',
                      margin: 0,
                      background: 'linear-gradient(135deg, #fff 0%, #e2e8f0 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent'
                    }}>
                      FinanceTracker
                    </h1>
                    <p style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      margin: 0,
                      fontWeight: '500'
                    }}>
                      Smart Money Management
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav style={{ flex: 1, padding: '24px 16px', position: 'relative', zIndex: 2 }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.1 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '16px 20px',
                            borderRadius: '14px',
                            textDecoration: 'none',
                            color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)',
                            background: isActive 
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              : 'transparent',
                            transition: 'all 0.3s ease',
                            boxShadow: isActive ? '0 12px 30px rgba(102, 126, 234, 0.3)' : 'none'
                          }}
                        >
                          <item.icon size={22} />
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: '15px',
                              fontWeight: '700',
                              marginBottom: '2px'
                            }}>
                              {item.label}
                            </div>
                            <div style={{
                              fontSize: '11px',
                              opacity: 0.8
                            }}>
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        @media (min-width: 1024px) {
          .lg\\:hidden {
            display: none !important;
          }
          .lg\\:flex {
            display: flex !important;
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
      `}</style>
    </>
  );
}
    </>
  );
}
         