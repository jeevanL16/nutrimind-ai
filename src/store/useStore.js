import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateTargets, calculateHealthScore, calculateFoodTotals, calculateGlobalTotals } from '../utils/calculations';

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
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        steps: 0,
        items: []
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
        const itemTotals = calculateFoodTotals(food);
        
        const newItem = { 
          ...food, 
          id: Date.now(), 
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          ...itemTotals
        };

        const newItems = [newItem, ...state.todayLog.items];
        const newTotals = calculateGlobalTotals(newItems);
        
        const newLog = {
          ...state.todayLog,
          ...newTotals,
          items: newItems
        };
        
        const newScore = calculateHealthScore(newLog, state.goals);

        return {
          todayLog: newLog,
          user: { 
            ...state.user, 
            healthScore: newScore, 
            xp: state.user.xp + 25 
          }
        };
      }),

      removeFoodLog: (id) => set((state) => {
        const newItems = state.todayLog.items.filter(item => item.id !== id);
        const newTotals = calculateGlobalTotals(newItems);
        
        const newLog = {
          ...state.todayLog,
          ...newTotals,
          items: newItems
        };
        
        const newScore = calculateHealthScore(newLog, state.goals);

        return {
          todayLog: newLog,
          user: { 
            ...state.user, 
            healthScore: newScore 
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

