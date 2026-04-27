import React from 'react';
import { Home, ScanLine, PieChart, MessageSquare } from 'lucide-react';
import useStore from '../store/useStore';
import { motion } from 'framer-motion';

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'scan', icon: ScanLine, label: 'Scan' },
  { id: 'spacer', icon: null, label: '' },
  { id: 'insights', icon: PieChart, label: 'Insights' },
  { id: 'coach', icon: MessageSquare, label: 'Coach' }
];

const Navigation = () => {
  const { activeTab, setActiveTab } = useStore();

  return (
    <nav className="fixed bottom-0 w-full z-40 px-4 pb-4 pt-2 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent pointer-events-none" role="tablist" aria-label="Main navigation">
      <div className="container mx-auto max-w-md pointer-events-auto">
        <div className="glass-card !rounded-2xl flex justify-between items-center px-3 py-2 !bg-[#0d0d0d]/80 !border-white/[0.06] !shadow-[0_-4px_30px_rgba(0,0,0,0.6)]">
          {navItems.map((item) => {
            if (item.id === 'spacer') {
              return <div key="spacer" className="w-14" aria-hidden="true" />;
            }
            
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                whileTap={{ scale: 0.9 }}
                className="relative flex flex-col items-center justify-center gap-1 w-16 h-14 rounded-xl"
                aria-label={`Navigate to ${item.label}`}
                aria-current={isActive ? 'page' : undefined}
                role="tab"
                tabIndex={0}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-neon/10 rounded-xl border border-neon/20"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                <motion.div
                  animate={{ 
                    y: isActive ? -2 : 0,
                    scale: isActive ? 1.1 : 1
                  }}
                  className={`relative z-10 ${isActive ? 'text-neon' : 'text-white/40'}`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                </motion.div>
                
                <span className={`text-[9px] font-bold relative z-10 tracking-wide ${isActive ? 'text-neon' : 'text-white/30'}`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
