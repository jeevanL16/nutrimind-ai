import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Zap, Award, Trophy, Star, Activity, BarChart3 } from 'lucide-react';
import useStore from '../store/useStore';

const InsightsScreen = () => {
  const { user, todayLog, goals } = useStore();

  const weeklyData = [
    { day: 'M', score: 85, steps: 6000 },
    { day: 'T', score: 92, steps: 8500 },
    { day: 'W', score: 78, steps: 4000 },
    { day: 'T', score: 88, steps: 10500 },
    { day: 'F', score: 95, steps: 12000 },
    { day: 'S', score: 70, steps: 3000 },
    { day: 'S', score: user.healthScore, steps: todayLog.steps },
  ];

  const xpForNextLevel = 2000;
  const xpProgress = (user.xp / xpForNextLevel) * 100;
  const xpRemaining = xpForNextLevel - user.xp;

  const badges = [
    { name: '7-Day Streak', emoji: '🔥', unlocked: user.streak >= 7 },
    { name: 'Protein Pro', emoji: '💪', unlocked: todayLog.protein >= goals.protein },
    { name: 'Step Master', emoji: '🏃', unlocked: todayLog.steps >= 10000 },
    { name: 'Clean Eater', emoji: '🥗', unlocked: user.healthScore >= 90 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } }
  };

  return (
    <motion.div 
      className="flex flex-col gap-6 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="px-1">
        <h2 className="text-3xl font-black tracking-tight">Metabolic Analytics</h2>
        <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Weekly Intelligence Overview</p>
      </motion.div>

      {/* Analytics Chart */}
      <motion.div variants={itemVariants} className="glass-card p-6 bg-[#0E0E0E]/50">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon/10 flex items-center justify-center">
              <BarChart3 size={20} className="text-neon" />
            </div>
            <div>
               <h3 className="font-bold text-sm">Vitality Trend</h3>
               <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Last 7 Days</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-neon" />
                <span className="text-[10px] font-bold text-white/40 uppercase">Score</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-[10px] font-bold text-white/40 uppercase">Activity</span>
             </div>
          </div>
        </div>

        <div className="flex items-end justify-between h-48 gap-3">
          {weeklyData.map((d, i) => {
            const isToday = i === weeklyData.length - 1;
            return (
              <div key={i} className="flex flex-col items-center gap-3 flex-1">
                <div className="w-full relative flex items-end justify-center h-32 gap-1 group">
                   <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.min(100, (d.steps / 12000) * 100)}%` }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                    className="w-1 rounded-full bg-secondary/30 group-hover:bg-secondary/50 transition-colors"
                  />
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${d.score}%` }}
                    transition={{ duration: 1, delay: i * 0.05 + 0.2 }}
                    className={`w-2.5 rounded-full ${
                      isToday ? 'bg-neon shadow-[0_0_20px_rgba(0,255,135,0.4)]' : 'bg-white/10'
                    }`}
                  />
                  {isToday && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-6 text-[10px] font-black text-neon"
                    >
                      {d.score}
                    </motion.div>
                  )}
                </div>
                <span className={`text-[11px] font-black tracking-widest ${isToday ? 'text-neon' : 'text-white/20'}`}>{d.day}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Gamification Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        <div className="glass-card p-5 relative overflow-hidden bg-orange-500/[0.02]">
          <Zap size={48} className="absolute -right-4 -bottom-4 text-orange-500/10" />
          <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-2">Current Streak</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black">{user.streak}</span>
            <span className="text-sm font-bold text-orange-500">Days</span>
          </div>
        </div>
        
        <div className="glass-card p-5 relative overflow-hidden bg-secondary/[0.02]">
          <Trophy size={48} className="absolute -right-4 -bottom-4 text-secondary/10" />
          <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-2">Meta Level</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black">{user.level}</span>
            <span className="text-sm font-bold text-secondary">Expert</span>
          </div>
        </div>
      </motion.div>

      {/* XP Engine */}
      <motion.div variants={itemVariants} className="glass-card p-6 border-secondary/20 bg-secondary/[0.02]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-secondary" />
            <h3 className="font-bold text-sm tracking-tight">XP Mastery Progress</h3>
          </div>
          <span className="text-[10px] font-black text-white/40">{user.xp.toLocaleString()} / {xpForNextLevel.toLocaleString()}</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-3">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            className="h-full bg-gradient-to-r from-secondary to-purple-500 rounded-full"
          />
        </div>
        <div className="flex justify-between items-center">
           <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Level {user.level}</span>
           <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{xpRemaining} XP to Level {user.level + 1}</span>
        </div>
      </motion.div>

      {/* Achievement Matrix */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <h3 className="font-bold text-sm tracking-tight mb-6 flex items-center gap-2">
           <Award size={18} className="text-amber-500" />
           Achievement Matrix
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge, idx) => (
            <div 
              key={badge.name}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                badge.unlocked 
                  ? 'bg-white/[0.04] border-white/10' 
                  : 'bg-black/40 border-white/5 opacity-30 grayscale'
              }`}
            >
              <div className="text-3xl">{badge.emoji}</div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-wider text-white/40 mb-0.5">
                   {badge.unlocked ? 'Unlocked' : 'Locked'}
                 </p>
                 <h4 className="text-xs font-bold leading-tight">{badge.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InsightsScreen;
