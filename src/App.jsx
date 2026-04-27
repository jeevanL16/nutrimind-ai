import React, { useEffect, useState, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useStore from './store/useStore';
import Header from './components/Header';
import Navigation from './components/Navigation';
import FloatingMic from './components/FloatingMic';
import { WifiOff, Loader2 } from 'lucide-react';

// Lazy load pages for better performance
const HomeScreen = React.lazy(() => import('./pages/HomeScreen'));
const ScanScreen = React.lazy(() => import('./pages/ScanScreen'));
const InsightsScreen = React.lazy(() => import('./pages/InsightsScreen'));
const CoachScreen = React.lazy(() => import('./pages/CoachScreen'));

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -15 }
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
      }, 2000);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showSplash, setHasSeenSplash]);

  if (showSplash) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#050505]">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-28 h-28 rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(0,255,135,0.3)] border border-white/10 relative">
            <div className="absolute inset-0 bg-neon/10 animate-pulse" />
            <img src="/logo.png" alt="NutriMind AI Logo" className="w-full h-full object-cover relative z-10" />
          </div>
          <h1 className="text-4xl font-black tracking-tight drop-shadow-xl">NutriMind<span className="text-neon">.AI</span></h1>
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
    <div className="min-h-screen bg-background relative pb-24 overflow-x-hidden selection:bg-neon selection:text-black">
      <Header />
      
      {/* Offline Indicator */}
      <AnimatePresence>
        {isOffline && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-red-500/90 text-white text-xs font-semibold py-1.5 px-4 flex justify-center items-center gap-2 z-50 sticky top-[72px] backdrop-blur-md"
          >
            <WifiOff size={14} /> You are offline. Data is saved locally.
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="container mx-auto px-4 pt-6 max-w-2xl">
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
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      <FloatingMic />
      <Navigation />
    </div>
  );
}

export default App;
