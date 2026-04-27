import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Zap, Award, Trophy, Star } from 'lucide-react';
import useStore from '../store/useStore';

const InsightsScreen = () => {
  const { user, todayLog, goals } = useStore();

  const weeklyData = [
    { day: 'Mon', score: 85, steps: 6000 },
    { day: 'Tue', score: 92, steps: 8500 },
    { day: 'Wed', score: 78, steps: 4000 },
    { day: 'Thu', score: 88, steps: 10500 },
    { day: 'Fri', score: 95, steps: 12000 },
    { day: 'Sat', score: 70, steps: 3000 },
    { day: 'Sun', score: user.healthScore, steps: todayLog.steps },
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
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="flex flex-col gap-5 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="px-1">
        <h2 className="text-2xl font-black">Insights</h2>
        <p className="text-xs text-white/40 font-medium mt-0.5">Your weekly health overview</p>
      </motion.div>

      {/* Weekly Score Chart */}
      <motion.div variants={itemVariants} className="glass-card p-5">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-neon" />
            <h3 className="font-bold text-sm">Weekly Trend</h3>
          </div>
          <div className="flex gap-3 text-[10px] text-white/40 font-semibold">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon inline-block" /> Score</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400/60 inline-block" /> Steps</span>
          </div>
        </div>

        <div className="flex items-end justify-between h-36 gap-1.5">
          {weeklyData.map((d, i) => {
            const isToday = i === weeklyData.length - 1;
            return (
              <div key={i} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                {isToday && (
                  <span className="text-[9px] text-neon font-black -mb-1">{d.score}</span>
                )}
                <div className="w-full relative flex items-end justify-center h-28 gap-0.5">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.min(100, (d.steps / 12000) * 100)}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08, type: "spring" }}
                    className="w-1.5 rounded-t-sm bg-blue-400/30"
                  />
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${d.score}%` }}
                    transition={{ duration: 1, delay: i * 0.08, type: "spring" }}
                    className={`w-3 rounded-t-md ${
                      d.score >= 80 ? 'bg-neon' : d.score >= 60 ? 'bg-amber-400' : 'bg-rose-500'
                    } ${isToday ? 'shadow-[0_0_12px_rgba(0,255,135,0.5)]' : ''}`}
                  />
                </div>
                <span className={`text-[10px] font-bold ${isToday ? 'text-neon' : 'text-white/40'}`}>{d.day}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-white/[0.02]"><Zap size={64} /></div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/15 flex items-center justify-center">
              <Zap size={16} className="text-orange-400" />
            </div>
          </div>
          <span className="text-3xl font-black block leading-none mb-1">{user.streak}</span>
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Day Streak</span>
        </div>
        
        <div className="glass-card p-4 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-white/[0.02]"><Trophy size={64} /></div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-secondary/15 flex items-center justify-center">
              <Trophy size={16} className="text-secondary" />
            </div>
          </div>
          <span className="text-3xl font-black block leading-none mb-1">{user.level}</span>
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Level</span>
        </div>
      </motion.div>

      {/* XP Progress */}
      <motion.div variants={itemVariants} className="glass-card p-5">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Star size={14} className="text-secondary" />
            <h3 className="font-bold text-sm">XP Progress</h3>
          </div>
          <span className="text-secondary text-xs font-black">{user.xp} / {xpForNextLevel}</span>
        </div>
        <div className="h-3 w-full bg-white/[0.04] rounded-full overflow-hidden mb-2 border border-white/[0.03]">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-secondary to-purple-400 rounded-full shadow-[0_0_12px_rgba(124,58,237,0.5)]"
          />
        </div>
        <p className="text-[10px] text-white/30 font-semibold text-right">{xpRemaining} XP to Level {user.level + 1}</p>
      </motion.div>

      {/* Badges */}
      <motion.div variants={itemVariants} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Award size={14} className="text-amber-400" />
          <h3 className="font-bold text-sm">Badges</h3>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {badges.map((badge, idx) => (
            <motion.div 
              key={badge.name}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + idx * 0.1, type: "spring" }}
              className={`flex flex-col items-center gap-2 py-3 px-1 rounded-2xl border transition-all ${
                badge.unlocked 
                  ? 'bg-neon/5 border-neon/20' 
                  : 'bg-white/[0.02] border-white/[0.04] opacity-40'
              }`}
            >
              <span className="text-2xl">{badge.emoji}</span>
              <span className="text-[8px] text-center font-bold text-white/50 leading-tight">{badge.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InsightsScreen;
