'use client';

import { Navbar } from './Navbar';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative'
    }}>
      <Navbar />
      
      {/* Main content area */}
      <motion.main
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          paddingTop: '100px', // Space for fixed navbar
          padding: '100px 24px 24px 24px',
          minHeight: '100vh'
        }}
      >
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          width: '100%'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </motion.main>

      <style jsx>{`
        @media (min-width: 1024px) {
          main {
            margin-left: 280px !important;
            padding-top: 24px !important;
          }
        }
        
        @media (max-width: 1023px) {
          main {
            padding-top: 120px !important;
          }
        }
        
        @keyframes backgroundFloat {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg); 
            opacity: 1;
          }
          25% { 
            transform: translateY(-20px) translateX(10px) rotate(1deg); 
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-10px) translateX(-5px) rotate(-0.5deg); 
            opacity: 0.9;
          }
          75% { 
            transform: translateY(5px) translateX(-10px) rotate(0.5deg); 
            opacity: 0.7;
          }
        }
        
        @keyframes particle-0 {
          0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-10vh) translateX(50px) rotate(360deg); opacity: 0; }
        }
        
        @keyframes particle-1 {
          0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-10vh) translateX(-30px) rotate(-360deg); opacity: 0; }
        }
        
        @keyframes particle-2 {
          0% { transform: translateY(100vh) translateX(0px) scale(0.5); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-10vh) translateX(20px) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}