import React from 'react';
import { Award, Flame } from 'lucide-react';
import useStore from '../store/useStore';
import { motion } from 'framer-motion';

const Header = () => {
  const { user } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/70 backdrop-blur-2xl border-b border-white/[0.03] py-3.5 px-5">
      <div className="container mx-auto max-w-2xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] overflow-hidden shadow-[0_0_15px_rgba(0,255,135,0.15)] border border-white/10 bg-black flex items-center justify-center">
            <img src="/logo.png" alt="NutriMind Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none mb-0.5">NutriMind<span className="text-neon">.AI</span></h1>
            <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.15em]">Level {user.level} Explorer</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1.5"
          >
            <Flame size={13} className="text-orange-400" />
            <span className="text-[11px] font-black">{user.streak}</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1.5"
          >
            <Award size={13} className="text-secondary" />
            <span className="text-[11px] font-black">{user.xp} <span className="text-white/30">XP</span></span>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
