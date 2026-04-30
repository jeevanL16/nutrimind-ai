import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Mic, X, Loader2, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingMic = () => {
  const { isMicActive, toggleMic, addFoodLog } = useStore();
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (isMicActive) toggleMic();
    };

    recognition.onend = () => {
      // Auto-stop handled by toggleMic
    };

    recognitionRef.current = recognition;
  }, [isMicActive, toggleMic]);

  // Handle Start/Stop
  useEffect(() => {
    if (isMicActive && recognitionRef.current) {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Recognition start error:', e);
      }
    } else if (!isMicActive && recognitionRef.current) {
      recognitionRef.current.stop();
      if (transcript) {
        handleProcessVoice(transcript);
      }
    }
  }, [isMicActive]);

  const handleProcessVoice = async (text) => {
    setIsProcessing(true);
    // Simulate AI parsing of natural language
    // In a real app, this would call an LLM or NLU service
    setTimeout(() => {
      const lower = text.toLowerCase();
      let detectedFood = null;
      
      // Simple logic for the demo (realistic but local)
      if (lower.includes('apple')) detectedFood = { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fats: 0.3 };
      else if (lower.includes('pizza')) detectedFood = { name: 'Pizza slice', calories: 285, protein: 12, carbs: 36, fats: 10 };
      else if (lower.includes('coffee')) detectedFood = { name: 'Black Coffee', calories: 2, protein: 0.2, carbs: 0, fats: 0 };
      else if (lower.includes('rice')) detectedFood = { name: 'Bowl of Rice', calories: 200, protein: 4, carbs: 44, fats: 0.5 };
      
      if (detectedFood) {
        addFoodLog(detectedFood);
      } else if (text.trim().length > 3) {
        // Fallback for unknown foods mentioned
        addFoodLog({ 
          name: text.split(' ').slice(-1)[0], 
          calories: 150, 
          protein: 5, 
          carbs: 20, 
          fats: 5 
        });
      }
      
      setIsProcessing(false);
      setTranscript('');
    }, 1500);
  };

  return (
    <>
      <AnimatePresence>
        {isMicActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
          >
            <button 
              onClick={toggleMic}
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="relative mb-12">
              {/* Pulse Waves */}
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-neon/20 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 2, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute inset-0 bg-neon/10 rounded-full"
              />
              
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="w-32 h-32 rounded-full bg-neon flex items-center justify-center text-black shadow-[0_0_50px_rgba(0,255,135,0.4)] relative z-10"
              >
                <Mic size={48} strokeWidth={2.5} />
              </motion.div>
            </div>

            <h2 className="text-3xl font-black mb-4">Listening...</h2>
            
            <div className="max-w-md w-full min-h-[100px] flex items-center justify-center">
              <p className="text-xl text-white/60 font-medium italic">
                {transcript || 'Say something like "I had a bowl of rice"'}
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 flex flex-col items-center gap-4"
            >
              <div className="flex gap-2">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 24, 8] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1 bg-neon rounded-full"
                  />
                ))}
              </div>
              <button 
                onClick={toggleMic}
                className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-2xl font-bold transition-all"
              >
                Done Speaking
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] bg-white text-black px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-3 font-bold"
          >
            <Loader2 className="animate-spin text-secondary" size={20} />
            AI Processing Transcript...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger - only visible when not in overlay */}
      {!isMicActive && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <motion.button
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMic}
            className="w-16 h-16 rounded-full bg-neon flex items-center justify-center text-black shadow-[0_10px_30px_rgba(0,255,135,0.4)] neon-glow group transition-all"
          >
            <Mic size={28} className="group-hover:scale-110 transition-transform" />
          </motion.button>
        </div>
      )}
    </>
  );
};

export default FloatingMic;
