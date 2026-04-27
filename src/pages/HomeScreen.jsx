import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import HealthRing from '../components/HealthRing';
import { Plus, Zap, Flame, Footprints, Sparkles, ChevronRight, Utensils } from 'lucide-react';
import confetti from 'canvas-confetti';

const HomeScreen = () => {
  const { user, todayLog, goals, setGoalMode } = useStore();

  const getPercentage = (current, target) => Math.min(100, Math.round((current / target) * 100));

  // Memoize greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  // Memoize coach tip based on current logs
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
    if (todayLog.calories < goals.calories * 0.3) {
      return { icon: '🍽️', text: "You haven't eaten much yet. Don't skip meals — it hurts metabolism." };
    }
    return { icon: '✨', text: "Great balance today! Keep up this momentum to maintain your streak." };
  }, [todayLog, goals]);

  useEffect(() => {
    if (todayLog.calories > 0 && Math.abs(todayLog.calories - goals.calories) < 50) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#00FF87', '#7C3AED', '#ffffff'] });
    }
  }, [todayLog.calories, goals.calories]);

  const macros = [
    { name: 'Protein', current: todayLog.protein, target: goals.protein, color: 'from-blue-400 to-blue-600', bg: 'bg-blue-500' },
    { name: 'Carbs', current: todayLog.carbs, target: goals.carbs, color: 'from-amber-400 to-amber-600', bg: 'bg-amber-500' },
    { name: 'Fats', current: todayLog.fats, target: goals.fats, color: 'from-rose-400 to-rose-600', bg: 'bg-rose-500' },
  ];

  const goalModes = [
    { id: 'Fat Loss', emoji: '🔥', label: 'Fat Loss' },
    { id: 'Maintenance', emoji: '⚖️', label: 'Maintain' },
    { id: 'Muscle Gain', emoji: '💪', label: 'Gain' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const caloriesLeft = goals.calories - todayLog.calories;

  return (
    <motion.div 
      className="flex flex-col gap-5 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Greeting */}
      <motion.div variants={itemVariants} className="px-1">
        <p className="text-white/40 text-sm font-medium">{greeting}</p>
        <h2 className="text-2xl font-black tracking-tight">{user.name === 'Guest' ? 'Welcome back!' : user.name}</h2>
      </motion.div>

      {/* Health Score Ring */}
      <motion.div variants={itemVariants} className="flex flex-col items-center">
        <HealthRing score={user.healthScore} size={200} strokeWidth={14} />
      </motion.div>

      {/* Goal Mode Selector */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
        {goalModes.map((mode) => (
          <motion.button
            key={mode.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setGoalMode(mode.id)}
            aria-label={`Select ${mode.id} goal`}
            className={`relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border transition-all duration-300 overflow-hidden ${
              user.goalMode === mode.id 
                ? 'bg-neon/10 border-neon/40 shadow-[0_0_20px_rgba(0,255,135,0.15)]' 
                : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
            }`}
          >
            {user.goalMode === mode.id && (
              <motion.div layoutId="goal-glow" className="absolute inset-0 bg-neon/5 rounded-2xl" />
            )}
            <span className="text-xl relative z-10">{mode.emoji}</span>
            <span className={`text-xs font-bold relative z-10 ${user.goalMode === mode.id ? 'text-neon' : 'text-white/50'}`}>
              {mode.label}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Calories + Steps Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
        {/* Calories Card */}
        <div className="glass-card p-4 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-neon/5 rounded-full blur-2xl" />
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Flame size={14} className="text-orange-400" />
            </div>
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Calories</span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-3xl font-black tracking-tight">{todayLog.calories}</span>
            <span className="text-xs text-white/30 font-semibold">/ {goals.calories}</span>
          </div>
          <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden mb-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${getPercentage(todayLog.calories, goals.calories)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${todayLog.calories > goals.calories ? 'bg-red-500' : 'bg-gradient-to-r from-neon to-emerald-400'}`}
            />
          </div>
          <span className={`text-[10px] font-bold ${caloriesLeft > 0 ? 'text-neon/70' : 'text-red-400/70'}`}>
            {caloriesLeft > 0 ? `${caloriesLeft} kcal left` : `${Math.abs(caloriesLeft)} kcal over`}
          </span>
        </div>

        {/* Steps Card */}
        <div className="glass-card p-4 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-400/5 rounded-full blur-2xl" />
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Footprints size={14} className="text-blue-400" />
            </div>
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Steps</span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-3xl font-black tracking-tight">{todayLog.steps.toLocaleString()}</span>
            <span className="text-xs text-white/30 font-semibold">/ 10k</span>
          </div>
          <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden mb-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${getPercentage(todayLog.steps, 10000)}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"
            />
          </div>
          <span className="text-[10px] font-bold text-blue-400/70">
            ~{Math.round(todayLog.steps * 0.04)} kcal burned
          </span>
        </div>
      </motion.div>

      {/* Macronutrients */}
      <motion.div variants={itemVariants} className="glass-card p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold">Macronutrients</h3>
          <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">{user.goalMode} split</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {macros.map((macro, idx) => (
            <div key={macro.name} className="flex flex-col items-center gap-2">
              <div className="relative w-14 h-14">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="22" stroke="rgba(255,255,255,0.05)" strokeWidth="5" fill="transparent" />
                  <motion.circle 
                    initial={{ strokeDashoffset: 138 }}
                    animate={{ strokeDashoffset: 138 - (138 * getPercentage(macro.current, macro.target) / 100) }}
                    transition={{ duration: 1, delay: 0.3 + idx * 0.1 }}
                    cx="28" cy="28" r="22" 
                    stroke="url(#gradient)" strokeWidth="5" fill="transparent" strokeLinecap="round"
                    style={{ strokeDasharray: 138 }}
                    className={`${macro.bg}`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black">{getPercentage(macro.current, macro.target)}%</span>
              </div>
              <div className="text-center">
                <span className="text-xs font-bold block">{macro.current}g</span>
                <span className="text-[9px] text-white/40 font-semibold">{macro.name}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Coach Tip */}
      <motion.div variants={itemVariants}>
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="glass-card p-4 relative overflow-hidden group cursor-pointer border-neon/10 hover:border-neon/30 transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-neon/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-neon/10" />
          <div className="flex gap-4 items-center relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-neon/10 border border-neon/20 flex items-center justify-center text-xl flex-shrink-0">
              {coachTip.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={12} className="text-neon" />
                <h3 className="font-bold text-xs text-neon uppercase tracking-wider">AI Insight</h3>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">{coachTip.text}</p>
            </div>
            <ChevronRight size={16} className="text-white/20 flex-shrink-0" />
          </div>
        </motion.div>
      </motion.div>

      {/* Today's Meals */}
      <motion.div variants={itemVariants}>
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-2">
            <Utensils size={16} className="text-white/30" />
            <h2 className="font-bold text-base">Today's Meals</h2>
            <span className="text-[10px] bg-white/[0.06] px-2 py-0.5 rounded-full text-white/40 font-semibold">
              {todayLog.items.length}
            </span>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-black bg-neon px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,135,0.3)] hover:shadow-[0_0_25px_rgba(0,255,135,0.5)] transition-shadow"
            aria-label="Add Food"
          >
            <Plus size={14} strokeWidth={3} /> Add
          </motion.button>
        </div>
        
        <AnimatePresence>
          <div className="flex flex-col gap-2.5">
            {todayLog.items.map((item, idx) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card p-4 flex justify-between items-center group hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className="flex items-center gap-3.5">
                  <div className="bg-white/[0.04] w-11 h-11 rounded-xl flex items-center justify-center text-lg border border-white/[0.05] group-hover:scale-110 transition-transform duration-300">
                    🍲
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{item.name}</h4>
                    <p className="text-[11px] text-white/40 mt-0.5 font-medium">{item.time} • {item.protein}g protein</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-sm text-neon">{item.calories}</div>
                  <div className="text-[9px] text-white/30 uppercase font-bold tracking-wider">kcal</div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default HomeScreen;
