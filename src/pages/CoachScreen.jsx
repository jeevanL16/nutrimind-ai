import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Activity, ShieldCheck, Zap } from 'lucide-react';
import useStore from '../store/useStore';
import { sanitizeInput } from '../utils/calculations';
import { generateCoachResponse } from '../utils/aiCoach';

const CoachScreen = () => {
  const { user, todayLog, goals } = useStore();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      let initialMsg = '';
      const calRemaining = goals.calories - todayLog.calories;
      if (todayLog.steps < 3000) initialMsg = `Metabolic systems active. ${user.name}, activity levels are suboptimal (${todayLog.steps} steps). Increasing movement will optimize fat oxidation.`;
      else if (calRemaining < 0) initialMsg = `Calorie threshold reached. ${user.name}, prioritising hydration and micronutrient intake for the remainder of the cycle is advised.`;
      else initialMsg = `Greetings, ${user.name}. Metabolic fuel remaining: ${calRemaining} kcal. Systems are operational. How shall we optimize your ${user.goalMode} journey today?`;

      setMessages([{ id: 'initial', sender: 'ai', text: initialMsg, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;
    const cleanInput = sanitizeInput(inputValue.trim());
    const userMsg = { id: Date.now(), sender: 'user', text: cleanInput, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    setTimeout(() => {
      const reply = generateCoachResponse(cleanInput, { user, todayLog, goals });
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: reply, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  }, [inputValue, user, todayLog, goals]);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] lg:h-[calc(100vh-160px)]">
      {/* Premium Header */}
      <div className="flex justify-between items-center mb-6 px-2">
        <div className="flex items-center gap-4">
          <div className="relative">
             <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-[0_0_30px_rgba(124,58,237,0.2)]">
                <Bot size={32} />
             </div>
             <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon rounded-full border-4 border-[#0A0A0A]" 
             />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Metabolic Intelligence</h2>
            <p className="text-[10px] text-neon font-black uppercase tracking-[0.2em] flex items-center gap-2">
               <Zap size={10} className="fill-neon" /> Systems Operational
            </p>
          </div>
        </div>
        <div className="flex gap-2">
           <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5 text-white/40">
              <ShieldCheck size={20} />
           </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 glass-card rounded-[40px] p-6 flex flex-col overflow-hidden mb-6 border-white/5 bg-[#0D0D0D]/50 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-6 hide-scrollbar relative z-10">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 max-w-[90%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl border ${
                  msg.sender === 'user' 
                    ? 'bg-secondary/10 border-secondary/20 text-secondary' 
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}>
                  {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-5 py-4 rounded-[24px] ${
                    msg.sender === 'user' 
                      ? 'bg-secondary text-white rounded-tr-none shadow-[0_10px_30px_rgba(124,58,237,0.3)]' 
                      : 'bg-white/5 text-white/90 rounded-tl-none border border-white/5 backdrop-blur-md'
                  }`}>
                    <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-white/20 mt-2 font-black uppercase tracking-widest px-1">{msg.time}</span>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex gap-4 max-w-[90%] self-start"
              >
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 text-white/60 flex items-center justify-center flex-shrink-0">
                  <Bot size={20} />
                </div>
                <div className="px-6 py-5 rounded-[24px] rounded-tl-none bg-white/5 border border-white/5 flex gap-2 items-center">
                  <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-neon rounded-full" />
                  <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-neon rounded-full" />
                  <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-neon rounded-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-2" />
        </div>

        {/* Input Area */}
        <div className="pt-6 mt-2 border-t border-white/5 relative z-10">
          <div className="relative group">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query Metabolic Intelligence..."
              className="w-full bg-[#111] border border-white/10 rounded-[28px] py-5 pl-7 pr-16 text-sm text-white placeholder-white/20 focus:outline-none focus:border-secondary/50 transition-all shadow-inner group-hover:border-white/20"
            />
            <motion.button 
              whileHover={{ scale: 1.1, x: -4 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              className="absolute right-2 top-2 w-11 h-11 bg-secondary text-white rounded-[22px] flex items-center justify-center hover:bg-secondary/90 transition-all shadow-lg disabled:opacity-50"
              disabled={!inputValue.trim() || isTyping}
            >
              <Send size={18} className="ml-1" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachScreen;
