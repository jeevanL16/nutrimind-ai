import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateTargets, calculateHealthScore } from '../utils/calculations';

const useStore = create(
  persist(
    (set, get) => ({
      user: {
        name: 'Guest',
        healthScore: 85,
        xp: 1250,
        level: 4,
        streak: 12,
        language: 'en',
        goalMode: 'Fat Loss', // Fat Loss, Muscle Gain, Maintenance
        baseTDEE: 2200
      },
      
      goals: calculateTargets('Fat Loss', 2200),

      todayLog: {
        calories: 1450,
        protein: 95,
        carbs: 140,
        fats: 45,
        steps: 6400,
        items: [
          { id: 1, name: 'Masala Dosa', calories: 350, protein: 8, time: '09:00 AM' },
          { id: 2, name: 'Filter Coffee', calories: 80, protein: 2, time: '09:30 AM' },
          { id: 3, name: 'Chicken Biryani', calories: 650, protein: 35, time: '01:30 PM' }
        ]
      },
      
      activeTab: 'home',
      isMicActive: false,
      hasSeenSplash: false,
      
      setHasSeenSplash: () => set({ hasSeenSplash: true }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      setGoalMode: (mode) => set((state) => {
        const newTargets = calculateTargets(mode, state.user.baseTDEE);
        return {
          user: { ...state.user, goalMode: mode },
          goals: newTargets
        };
      }),

      addSteps: (amount) => set((state) => {
        const newSteps = state.todayLog.steps + amount;
        return { todayLog: { ...state.todayLog, steps: newSteps } };
      }),

      addFoodLog: (food) => set((state) => {
        const newLog = {
          ...state.todayLog,
          calories: state.todayLog.calories + food.calories,
          protein: state.todayLog.protein + food.protein,
          carbs: state.todayLog.carbs + (food.carbs || 0),
          fats: state.todayLog.fats + (food.fats || 0),
          items: [{ ...food, id: Date.now(), time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }, ...state.todayLog.items]
        };
        
        const newScore = calculateHealthScore(newLog, state.goals);

        return {
          todayLog: newLog,
          user: { 
            ...state.user, 
            healthScore: newScore, 
            xp: state.user.xp + 25 // Gamification XP for logging
          }
        };
      }),
      
      toggleMic: () => set((state) => ({ isMicActive: !state.isMicActive })),
      setLanguage: (lang) => set((state) => ({ user: { ...state.user, language: lang } }))
    }),
    {
      name: 'nutrimind-storage',
    }
  )
);

export default useStore;
