import React from 'react';
import { Home, ScanLine, PieChart, MessageSquare } from 'lucide-react';
import useStore from '../store/useStore';
import { motion } from 'framer-motion';

const navItems = [
  { id: 'home', icon: Home, label: 'Dashboard' },
  { id: 'scan', icon: ScanLine, label: 'Scan' },
  { id: 'insights', icon: PieChart, label: 'Stats' },
  { id: 'coach', icon: MessageSquare, label: 'Coach' }
];

const Navigation = () => {
  const { activeTab, setActiveTab } = useStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="bg-[#111111]/80 backdrop-blur-2xl border border-white/5 rounded-[24px] flex justify-around items-center px-2 py-2 shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="relative flex flex-col items-center justify-center gap-1.5 w-16 h-14 rounded-2xl transition-all"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/[0.03] rounded-2xl border border-white/5"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                <div className={`relative z-10 transition-colors ${isActive ? 'text-neon' : 'text-white/30'}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                     <motion.div 
                       layoutId="glow"
                       className="absolute inset-0 blur-md opacity-50 bg-neon/30" 
                     />
                  )}
                </div>
                
                <span className={`text-[10px] font-black uppercase tracking-widest relative z-10 transition-colors ${isActive ? 'text-neon' : 'text-white/20'}`}>
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
