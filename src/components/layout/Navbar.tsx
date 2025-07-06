'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  CreditCard, 
  BarChart3, 
  Target,
  Wallet,
  Menu,
  X,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Overview & insights',
  },
  {
    href: '/transactions',
    label: 'Transactions',
    icon: CreditCard,
    description: 'Manage payments',
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: BarChart3,
    description: 'Reports & trends',
  },
  {
    href: '/budgets',
    label: 'Budgets',
    icon: Target,
    description: 'Track spending',
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '80px'
        }}>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 30px rgba(102, 126, 234, 0.3)'
              }}
            >
              <Wallet size={24} color="white" />
            </motion.div>
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '900',
                margin: 0,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.5px'
              }}>
                FinanceTracker
              </h1>
              <p style={{
                fontSize: '12px',
                color: '#6b7280',
                margin: 0,
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Sparkles size={12} />
                Smart Money Management
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div style={{ display: 'none' }} className="md:flex">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(248, 250, 252, 0.8)',
              padding: '8px',
              borderRadius: '20px',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      borderRadius: '14px',
                      textDecoration: 'none',
                      color: isActive ? 'white' : '#6b7280',
                      background: isActive 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'transparent',
                      transition: 'all 0.3s ease',
                      fontSize: '14px',
                      fontWeight: '600',
                      boxShadow: isActive ? '0 8px 25px rgba(102, 126, 234, 0.3)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                        e.currentTarget.style.color = '#667eea';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {/* Active background animation */}
                    {isActive && (
                      <motion.div
                        layoutId="activeBackground"
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
                    
                    <item.icon size={18} />
                    <span>{item.label}</span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: 'white',
                          boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Stats Badge */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: '700',
              boxShadow: '0 12px 30px rgba(16, 185, 129, 0.3)',
              cursor: 'pointer'
            }}
            className="hidden lg:flex"
          >
            <TrendingUp size={16} />
            <span>Portfolio</span>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              border: 'none',
              background: isMobileMenuOpen 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'rgba(102, 126, 234, 0.1)',
              color: isMobileMenuOpen ? 'white' : '#667eea',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            className="md:hidden"
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.div>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 40,
                backdropFilter: 'blur(8px)'
              }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden"
            />
            
            {/* Mobile Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed',
                top: '100px',
                left: '24px',
                right: '24px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                zIndex: 45
              }}
              className="md:hidden"
            >
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px' 
              }}>
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '16px 20px',
                          borderRadius: '16px',
                          textDecoration: 'none',
                          color: isActive ? 'white' : '#374151',
                          background: isActive 
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          border: `2px solid ${isActive ? 'transparent' : 'rgba(0, 0, 0, 0.05)'}`,
                          boxShadow: isActive ? '0 12px 30px rgba(102, 126, 234, 0.3)' : 'none'
                        }}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          background: isActive 
                            ? 'rgba(255, 255, 255, 0.2)'
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isActive ? 'white' : 'white'
                        }}>
                          <item.icon size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            marginBottom: '2px'
                          }}>
                            {item.label}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            opacity: 0.7,
                            fontWeight: '500'
                          }}>
                            {item.description}
                          </div>
                        </div>
                        
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: 'white',
                              boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                            }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        @media (min-width: 768px) {
          .md\\:flex {
            display: flex !important;
          }
          .md\\:hidden {
            display: none !important;
          }
        }
        
        @media (min-width: 1024px) {
          .lg\\:flex {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
