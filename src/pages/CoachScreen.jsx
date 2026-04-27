import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';
import { sanitizeInput } from '../utils/calculations';

const CoachScreen = () => {
  const { user, todayLog, goals } = useStore();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: `Hi ${user.name}! I'm tracking your ${user.goalMode} goal. How are you feeling today?`, time: '08:00 AM' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Generate contextual initial message based on goal and steps
    const timer = setTimeout(() => {
      let contextualMsg = '';
      
      if (todayLog.steps < 5000) {
        contextualMsg = `You're at ${todayLog.steps} steps. A quick 15-minute walk could help boost your metabolism for your ${user.goalMode} goal!`;
      } else if (todayLog.calories > goals.calories) {
        contextualMsg = "You've crossed your calorie limit for today. Try to stick to water and fibrous vegetables if you're still hungry.";
      } else if (todayLog.protein < goals.protein * 0.4 && todayLog.calories > goals.calories * 0.5) {
        contextualMsg = "Your protein intake is a bit low compared to your calories. Let's aim for lean protein in your next meal!";
      } else {
        contextualMsg = "Your macros and steps look fantastic today. You are completely on track! 🚀";
      }

      if (messages.length === 1) {
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          sender: 'ai', 
          text: contextualMsg,
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }]);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;

    // SECURITY: Sanitize input to prevent XSS
    const cleanInput = sanitizeInput(inputValue.trim());

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: cleanInput,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setIsTyping(true);

    // Enhanced rule-based response
    setTimeout(() => {
      let reply = "I'm still learning! But based on your logs, consistency is your best friend right now.";
      const lowerInput = cleanInput.toLowerCase();
      
      if (lowerInput.includes('hungry') || lowerInput.includes('starving')) {
        if (user.goalMode === 'Fat Loss') {
          reply = "Fat loss can make you feel hungry. Drink a large glass of water, wait 20 mins. If you're still hungry, grab cucumber or celery!";
        } else {
          reply = "Since your goal is " + user.goalMode + ", it's okay to have a nutrient-dense snack like Greek yogurt or almonds.";
        }
      } else if (lowerInput.includes('workout') || lowerInput.includes('exercise')) {
        reply = `Awesome! Make sure to log those extra calories burned. Since you're focusing on ${user.goalMode}, protein recovery is crucial within 2 hours.`;
      } else if (lowerInput.includes('sweet') || lowerInput.includes('craving')) {
        reply = "Cravings are normal! A piece of dark chocolate (70%+) or some berries can satisfy that sweet tooth without breaking your macros.";
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
      setIsTyping(false);
    }, 1200);
  }, [inputValue, user.goalMode]);

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="flex justify-between items-center px-2 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-neon/10 flex items-center justify-center text-neon border border-neon/30 shadow-[0_0_20px_rgba(0,255,135,0.15)] relative overflow-hidden">
            <div className="absolute inset-0 bg-neon/5 animate-pulse" />
            <Bot size={26} className="relative z-10" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Nutri Coach</h2>
            <p className="text-xs text-neon flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-neon shadow-[0_0_8px_rgba(0,255,135,0.8)] animate-pulse" /> AI Assistant
            </p>
          </div>
        </div>
        <div className="bg-white/5 p-2 rounded-xl text-white/50 border border-white/5">
          <Sparkles size={18} />
        </div>
      </div>

      <div className="flex-1 glass-card rounded-3xl p-4 flex flex-col overflow-hidden mb-4 border-white/10 shadow-2xl">
        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-5 hide-scrollbar">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 24 }}
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${msg.sender === 'user' ? 'bg-secondary' : 'bg-neon text-black'}`}>
                  {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-secondary text-white rounded-tr-sm shadow-[0_4px_15px_rgba(124,58,237,0.3)]' 
                      : 'bg-white/10 text-white/90 rounded-tl-sm border border-white/5 backdrop-blur-md'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-white/40 mt-1.5 font-medium">{msg.time}</span>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-3 max-w-[85%] self-start"
              >
                <div className="w-8 h-8 rounded-full bg-neon text-black flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot size={14} />
                </div>
                <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-white/10 border border-white/5 flex gap-1.5 items-center">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-neon rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-neon rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-neon rounded-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-1" />
        </div>

        <div className="pt-4 mt-2 border-t border-white/5 relative">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your AI Coach..."
            aria-label="Message input"
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-5 pr-14 text-sm text-white placeholder-white/40 focus:outline-none focus:border-neon/50 focus:bg-black/60 focus:ring-1 focus:ring-neon/30 transition-all shadow-inner"
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            aria-label="Send message"
            className="absolute right-2 top-1/2 mt-2 -translate-y-1/2 w-10 h-10 bg-neon rounded-xl text-black flex items-center justify-center hover:bg-neon/90 transition-colors shadow-[0_0_15px_rgba(0,255,135,0.4)] disabled:opacity-50 disabled:shadow-none"
            disabled={!inputValue.trim() || isTyping}
          >
            <Send size={18} className="ml-1" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CoachScreen;
