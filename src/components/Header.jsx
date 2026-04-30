import React from 'react';
import { Award, Flame, User } from 'lucide-react';
import useStore from '../store/useStore';
import { motion } from 'framer-motion';

const Header = () => {
  const { user } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0A]/60 backdrop-blur-3xl border-b border-white/[0.04] py-4 px-6 lg:bg-transparent lg:border-none">
      <div className="flex justify-between items-center w-full">
        {/* Only show logo on mobile/tablet */}
        <div className="flex items-center gap-3 lg:hidden">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="NutriMind Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter leading-none mb-0.5">NutriMind<span className="text-neon">.AI</span></h1>
            <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.2em]">Metabolic Intel</p>
          </div>
        </div>

        {/* Space filler for desktop layout (since sidebar has title) */}
        <div className="hidden lg:block"></div>
        
        <div className="flex gap-3 items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-orange-500/5 border border-orange-500/10 rounded-2xl px-4 py-2"
          >
            <Flame size={14} className="text-orange-500" />
            <span className="text-xs font-black">{user.streak}d</span>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-secondary/5 border border-secondary/10 rounded-2xl px-4 py-2"
          >
            <Award size={14} className="text-secondary" />
            <span className="text-xs font-black">{user.xp.toLocaleString()} <span className="text-white/20">XP</span></span>
          </motion.div>

          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-white/10 transition-colors cursor-pointer">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
