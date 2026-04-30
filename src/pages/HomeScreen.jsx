import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import HealthRing from '../components/HealthRing';
import { Plus, Zap, Flame, Footprints, Sparkles, ChevronRight, Utensils, TrendingUp, Activity, X } from 'lucide-react';

import confetti from 'canvas-confetti';

const HomeScreen = () => {
  const { user, todayLog, goals, setGoalMode, setActiveTab, removeFoodLog } = useStore();

  const [displayScore, setDisplayScore] = useState(0);

  // Health Score Count-up Animation
  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();
    const startScore = 0;
    const endScore = user.healthScore;

    const updateScore = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (outQuart)
      const easedProgress = 1 - Math.pow(1 - progress, 4);
      
      setDisplayScore(Math.floor(startScore + (endScore - startScore) * easedProgress));

      if (progress < 1) {
        requestAnimationFrame(updateScore);
      }
    };

    requestAnimationFrame(updateScore);
  }, [user.healthScore]);

  const getPercentage = (current, target) => Math.min(100, Math.round((current / target) * 100));

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const coachTip = useMemo(() => {
    if (todayLog.protein < goals.protein * 0.3) {
      return { icon: '🥩', text: "Protein is critically low — try eggs, paneer, or a shake to catch up!" };
    }
    if (todayLog.calories > goals.calories) {
      return { icon: '⚠️', text: "You've exceeded your calorie target. Keep the rest of the day light." };
    }
    if (todayLog.steps < 3000) {
      return { icon: '🚶', text: "You've barely moved today. A short walk can do wonders!" };
    }
    return { icon: '✨', text: "Great balance today! Keep up this momentum to maintain your streak." };
  }, [todayLog, goals]);

  useEffect(() => {
    if (todayLog.calories > 0 && Math.abs(todayLog.calories - goals.calories) < 50) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#00FF87', '#7C3AED', '#ffffff'] });
    }
  }, [todayLog.calories, goals.calories]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 260, damping: 20 } 
    }
  };

  const caloriesLeft = goals.calories - todayLog.calories;

  return (
    <motion.div 
      className="flex flex-col gap-6 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex justify-between items-center px-1">
        <div>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{greeting}</p>
          <h2 className="text-3xl font-black tracking-tight">{user.name}</h2>
        </div>
        <div className="flex gap-2">
           <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5">
              <TrendingUp size={18} className="text-neon" />
           </div>
        </div>
      </motion.div>

      {/* Hero Health Score */}
      <motion.div 
        variants={itemVariants} 
        className="flex flex-col items-center justify-center py-4 relative"
      >
        <div className="absolute inset-0 bg-neon/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative group">
          <HealthRing score={user.healthScore} size={240} strokeWidth={16} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <motion.span 
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="text-7xl font-black font-outfit"
             >
               {displayScore}
             </motion.span>
             <span className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] -mt-2">Health Score</span>
          </div>
        </div>
      </motion.div>

      {/* Core Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        {/* Calories Card */}
        <div className="glass-card p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
            <Flame size={24} className="text-orange-500" />
          </div>
          <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-3">Calories</p>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-black">{todayLog.calories}</span>
            <span className="text-xs text-white/20 font-bold">/ {goals.calories}</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${getPercentage(todayLog.calories, goals.calories)}%` }}
              className={`h-full rounded-full ${todayLog.calories > goals.calories ? 'bg-red-500' : 'bg-neon'}`}
            />
          </div>
        </div>

        {/* Steps Card */}
        <div className="glass-card p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
            <Footprints size={24} className="text-blue-500" />
          </div>
          <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-3">Activity</p>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-black">{todayLog.steps.toLocaleString()}</span>
            <span className="text-xs text-white/20 font-bold">/ 10k</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${getPercentage(todayLog.steps, 10000)}%` }}
              className="h-full rounded-full bg-blue-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Goal Selector */}
      <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {['Fat Loss', 'Maintenance', 'Muscle Gain'].map((mode) => (
          <button
            key={mode}
            onClick={() => setGoalMode(mode)}
            className={`whitespace-nowrap px-6 py-3 rounded-2xl text-sm font-bold border transition-all ${
              user.goalMode === mode 
                ? 'bg-neon/10 border-neon/30 text-neon' 
                : 'bg-white/5 border-white/5 text-white/40 hover:text-white/60'
            }`}
          >
            {mode}
          </button>
        ))}
      </motion.div>

      {/* Daily Activity / Meals */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-black flex items-center gap-2">
            <Utensils size={18} className="text-white/30" />
            Today's Log
          </h3>
          <button 
            onClick={() => setActiveTab('scan')}
            className="w-10 h-10 rounded-2xl bg-neon text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,255,135,0.3)]"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {todayLog.items.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center text-white/20 font-bold italic"
              >
                No meals logged yet. Use voice or camera!
              </motion.div>
            ) : (
              todayLog.items.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="glass-card p-4 flex justify-between items-center group relative overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                      {item.servingType === 'per100g' ? '⚖️' : '🍱'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm group-hover:text-neon transition-colors">
                        {item.quantity > 1 && `${item.quantity}x `}{item.name}
                      </h4>
                      <p className="text-[10px] text-white/30 font-black uppercase tracking-wider">
                        {item.time} • {item.servingType === 'per100g' ? `${item.servingSize}g` : '1 unit'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-lg font-black block text-neon">{item.caloriesTotal}</span>
                      <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Kcal</span>
                    </div>

                    <button 
                      onClick={() => removeFoodLog(item.id)}
                      className="p-2 rounded-xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* AI Context Card */}
      <motion.div 
        variants={itemVariants}
        onClick={() => setActiveTab('coach')}
        className="glass-card p-6 bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20 relative cursor-pointer overflow-hidden group"
      >
        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
           <Activity size={120} />
        </div>
        <div className="flex items-start gap-4 relative z-10">
           <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
              <Sparkles size={24} />
           </div>
           <div className="flex-1">
              <h4 className="font-bold text-secondary mb-1">Coach Insight</h4>
              <p className="text-sm text-white/60 leading-relaxed italic">
                "{coachTip.text}"
              </p>
           </div>
           <ChevronRight size={20} className="text-white/20" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomeScreen;
