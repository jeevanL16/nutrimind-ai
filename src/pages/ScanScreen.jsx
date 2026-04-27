import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Barcode, Upload, X, Sparkles, Check } from 'lucide-react';
import useStore from '../store/useStore';

const ScanScreen = () => {
  const [scanMode, setScanMode] = useState('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const { addFoodLog, setActiveTab } = useStore();

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        name: 'Masala Dosa',
        calories: 350,
        protein: 8,
        carbs: 45,
        fats: 12,
        confidence: 0.92
      });
    }, 2500);
  };

  const handleAddResult = () => {
    if (scanResult) {
      addFoodLog(scanResult);
      setActiveTab('home');
    }
  };

  const scanModes = [
    { id: 'camera', icon: Camera, label: 'Photo' },
    { id: 'barcode', icon: Barcode, label: 'Barcode' },
    { id: 'upload', icon: Upload, label: 'Upload' },
  ];

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-2xl font-black">Smart Scan</h2>
          <p className="text-xs text-white/40 font-medium mt-0.5">Identify food with AI vision</p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-3 gap-3">
        {scanModes.map((mode) => {
          const Icon = mode.icon;
          const isActive = scanMode === mode.id;
          return (
            <motion.button 
              key={mode.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScanMode(mode.id)}
              className={`flex flex-col items-center gap-2 py-3 rounded-2xl border transition-all duration-300 ${
                isActive 
                  ? 'bg-neon/10 border-neon/30 text-neon' 
                  : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:bg-white/[0.05]'
              }`}
              aria-label={`Switch to ${mode.label} mode`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{mode.label}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {!scanResult ? (
          <motion.div 
            key="scanner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="glass-card rounded-3xl overflow-hidden relative min-h-[350px] flex flex-col items-center justify-center cursor-pointer border-neon/10 hover:border-neon/30 transition-all duration-500"
            onClick={handleSimulateScan}
          >
            {/* Ambient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-neon/[0.02] to-transparent" />
            
            {/* Scanner Frame */}
            <div className="relative w-52 h-52">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-neon/60 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-neon/60 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-neon/60 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-neon/60 rounded-br-xl" />
              
              {/* Center crosshair */}
              {!isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-px bg-white/10" />
                  <div className="absolute w-px h-8 bg-white/10" />
                </div>
              )}
              
              {/* Scanning laser line */}
              {isScanning && (
                <motion.div 
                  initial={{ top: 0, opacity: 0 }}
                  animate={{ top: ['0%', '100%', '0%'], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-2 right-2 h-0.5 bg-neon shadow-[0_0_20px_rgba(0,255,135,1),0_0_40px_rgba(0,255,135,0.5)] rounded-full"
                />
              )}
              
              {/* Center icon */}
              {!isScanning && (
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Camera size={36} className="text-white/20" />
                </motion.div>
              )}
            </div>

            <div className="mt-6 text-center relative z-10">
              <p className="text-white/60 font-semibold text-sm mb-1">
                {isScanning ? 'Analyzing with AI...' : 'Tap to scan food'}
              </p>
              {isScanning && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.5, ease: "linear" }}
                  className="h-1 bg-neon rounded-full mx-auto mt-3 max-w-[120px] shadow-[0_0_10px_rgba(0,255,135,0.5)]"
                />
              )}
              {!isScanning && (
                <p className="text-white/30 text-[11px]">Point at food or upload a photo</p>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 flex flex-col items-center justify-center gap-5 relative overflow-hidden"
          >
            <button 
              onClick={() => setScanResult(null)}
              className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
              aria-label="Close result"
            >
              <X size={20} />
            </button>

            {/* Confidence badge */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-neon/10 border-2 border-neon/30 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,255,135,0.15)]"
            >
              <Check size={20} className="text-neon mb-0.5" />
              <span className="text-neon text-xs font-black">{Math.round(scanResult.confidence * 100)}%</span>
            </motion.div>

            <div className="text-center">
              <h3 className="text-2xl font-black mb-1">{scanResult.name}</h3>
              <p className="text-neon font-bold text-lg">{scanResult.calories} kcal</p>
            </div>

            <div className="w-full grid grid-cols-3 gap-3 text-center text-sm bg-white/[0.03] p-4 rounded-2xl border border-white/[0.05]">
              <div>
                <span className="block text-white/40 text-[10px] font-bold uppercase mb-1">Protein</span>
                <span className="font-black">{scanResult.protein}g</span>
              </div>
              <div className="border-x border-white/[0.05]">
                <span className="block text-white/40 text-[10px] font-bold uppercase mb-1">Carbs</span>
                <span className="font-black">{scanResult.carbs}g</span>
              </div>
              <div>
                <span className="block text-white/40 text-[10px] font-bold uppercase mb-1">Fats</span>
                <span className="font-black">{scanResult.fats}g</span>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddResult}
              className="w-full bg-neon text-black font-black py-3.5 rounded-2xl hover:bg-neon/90 transition-colors shadow-[0_0_20px_rgba(0,255,135,0.4)] text-sm flex items-center justify-center gap-2"
            >
              <Sparkles size={16} /> Log This Food
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScanScreen;
