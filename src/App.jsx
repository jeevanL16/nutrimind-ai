import React, { useEffect, useState, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useStore from './store/useStore';
import Header from './components/Header';
import Navigation from './components/Navigation';
import FloatingMic from './components/FloatingMic';
import { WifiOff, Loader2, Home, ScanLine, PieChart, MessageSquare, ChevronRight } from 'lucide-react';

const HomeScreen = React.lazy(() => import('./pages/HomeScreen'));
const ScanScreen = React.lazy(() => import('./pages/ScanScreen'));
const InsightsScreen = React.lazy(() => import('./pages/InsightsScreen'));
const CoachScreen = React.lazy(() => import('./pages/CoachScreen'));

const pageVariants = {
  initial: { opacity: 0, scale: 0.98, filter: 'blur(10px)' },
  in: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  out: { opacity: 0, scale: 1.02, filter: 'blur(10px)' }
};

const Sidebar = () => {
  const { activeTab, setActiveTab } = useStore();
  const navItems = [
    { id: 'home', icon: Home, label: 'Dashboard' },
    { id: 'scan', icon: ScanLine, label: 'Smart Scan' },
    { id: 'insights', icon: PieChart, label: 'Analytics' },
    { id: 'coach', icon: MessageSquare, label: 'AI Coach' }
  ];

  return (
    <div className="hidden lg:flex flex-col w-72 h-screen fixed left-0 top-0 bg-[#070707] border-r border-white/5 p-6 z-50">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 rounded-xl bg-neon flex items-center justify-center text-black font-black">N</div>
        <h1 className="text-xl font-black tracking-tight">NutriMind<span className="text-neon">.AI</span></h1>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${
                isActive 
                  ? 'bg-neon/10 text-neon border border-neon/10' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="font-bold text-sm">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={16} />}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="glass-card p-4 bg-secondary/5 border-secondary/10">
           <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Premium Plan</p>
           <p className="text-xs text-white/60 mb-3">Unlock advanced AI metabolic insights.</p>
           <button className="w-full py-2.5 bg-secondary text-white text-xs font-bold rounded-xl shadow-lg">Upgrade Now</button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { activeTab, hasSeenSplash, setHasSeenSplash } = useStore();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showSplash, setShowSplash] = useState(!hasSeenSplash);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if (showSplash) {
      setTimeout(() => {
        setShowSplash(false);
        setHasSeenSplash();
      }, 2500);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showSplash, setHasSeenSplash]);

  if (showSplash) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0A0A0A] overflow-hidden">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col items-center gap-8"
        >
          <div className="relative w-32 h-32">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-t-2 border-l-2 border-neon/40 rounded-[40px]"
            />
            <div className="absolute inset-2 bg-gradient-to-br from-neon/20 to-transparent rounded-[32px] backdrop-blur-xl flex items-center justify-center border border-white/10">
               <span className="text-5xl font-black text-neon">N</span>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-black tracking-tighter mb-2">NutriMind<span className="text-neon">.AI</span></h1>
            <p className="text-white/20 font-bold tracking-[0.3em] uppercase text-[10px]">Intelligence for Metabolism</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const renderScreen = () => {
    switch(activeTab) {
      case 'home': return <HomeScreen key="home" />;
      case 'scan': return <ScanScreen key="scan" />;
      case 'insights': return <InsightsScreen key="insights" />;
      case 'coach': return <CoachScreen key="coach" />;
      default: return <HomeScreen key="home" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      <Sidebar />
      
      <div className="flex-1 lg:pl-72 relative min-h-screen flex flex-col">
        <Header />
        
        <AnimatePresence>
          {isOffline && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest py-2 px-4 text-center border-b border-red-500/20"
            >
              Offline Mode Active • Using Local Cache
            </motion.div>
          )}
        </AnimatePresence>
        
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:px-8">
          <Suspense fallback={
            <div className="flex justify-center items-center h-[50vh]">
              <Loader2 className="animate-spin text-neon" size={32} />
            </div>
          }>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              >
                {renderScreen()}
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </main>

        <FloatingMic />
        <div className="lg:hidden">
          <Navigation />
        </div>
      </div>
    </div>
  );
}

export default App;
