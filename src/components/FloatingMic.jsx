import React, { useEffect, useRef } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import useStore from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const FOOD_DB = {
  dosa:    { name: 'Dosa',     calories: 150, protein: 4, carbs: 25, fats: 5 },
  idli:    { name: 'Idli',     calories: 60,  protein: 2, carbs: 12, fats: 0.5 },
  biryani: { name: 'Biryani',  calories: 400, protein: 15, carbs: 50, fats: 15 },
  roti:    { name: 'Roti',     calories: 120, protein: 3, carbs: 20, fats: 3 },
  rice:    { name: 'Rice',     calories: 200, protein: 4, carbs: 44, fats: 0.5 },
  sambar:  { name: 'Sambar',   calories: 80,  protein: 4, carbs: 12, fats: 2 },
  apple:   { name: 'Apple',    calories: 95,  protein: 0.5, carbs: 25, fats: 0.3 },
  paneer:  { name: 'Paneer',   calories: 250, protein: 18, carbs: 3, fats: 18 },
  egg:     { name: 'Egg',      calories: 75,  protein: 6, carbs: 1, fats: 5 },
  chapati: { name: 'Chapati',  calories: 120, protein: 3, carbs: 20, fats: 3 },
};

/**
 * Parses voice command to extract food and quantity.
 * @param {string} text - Raw voice transcript
 * @returns {object|null} Parsed food log entry or null
 */
const parseVoiceCommand = (text) => {
  const lower = text.toLowerCase();
  
  for (const [key, food] of Object.entries(FOOD_DB)) {
    if (lower.includes(key)) {
      const match = lower.match(/(\d+)/);
      const qty = match ? parseInt(match[1]) : 1;
      return {
        name: `${qty}x ${food.name}`,
        calories: food.calories * qty,
        protein: food.protein * qty,
        carbs: food.carbs * qty,
        fats: food.fats * qty,
      };
    }
  }
  return null;
};

const FloatingMic = () => {
  const { isMicActive, toggleMic, addFoodLog } = useStore();
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const parsed = parseVoiceCommand(transcript);
        if (parsed) {
          addFoodLog(parsed);
        } else {
          addFoodLog({ name: transcript, calories: 100, protein: 5, carbs: 12, fats: 3 });
        }
        toggleMic();
      };

      recognitionRef.current.onerror = () => { toggleMic(); };
      recognitionRef.current.onend = () => {
        if (useStore.getState().isMicActive) toggleMic();
      };
    }
  }, [addFoodLog, toggleMic]);

  useEffect(() => {
    if (isMicActive && recognitionRef.current) {
      try { recognitionRef.current.start(); } catch (e) { /* already running */ }
    } else if (!isMicActive && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { /* already stopped */ }
    }
  }, [isMicActive]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <div className="relative flex justify-center items-center">
        <AnimatePresence>
          {isMicActive && (
            <>
              <motion.div
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute w-16 h-16 rounded-full bg-neon/30"
              />
              <motion.div
                initial={{ scale: 1, opacity: 0.4 }}
                animate={{ scale: 1.6, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                className="absolute w-16 h-16 rounded-full bg-neon/20"
              />
            </>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleMic}
          aria-label={isMicActive ? 'Stop listening' : 'Start voice input'}
          className={`w-14 h-14 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
            isMicActive 
              ? 'bg-neon text-black shadow-[0_0_25px_rgba(0,255,135,0.6)]' 
              : 'bg-[#111] text-neon border border-neon/20 hover:border-neon/50 shadow-[0_0_20px_rgba(0,255,135,0.15)]'
          }`}
        >
          {isMicActive ? <Loader2 size={24} className="animate-spin" /> : <Mic size={24} />}
        </motion.button>
      </div>
      
      <AnimatePresence>
        {isMicActive && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#111]/90 backdrop-blur-xl px-4 py-2 rounded-xl text-xs text-neon font-bold border border-neon/20"
          >
            Listening... try "2 dosa"
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingMic;
