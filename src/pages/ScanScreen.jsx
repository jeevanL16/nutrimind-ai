import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Barcode, Upload, X, Sparkles, Check, RefreshCw, ChevronRight, AlertCircle, Search, Scan, Plus, Keyboard, Calculator } from 'lucide-react';
import useStore from '../store/useStore';
import { predictFood, COMMON_FOODS, findNutrition } from '../utils/aiVision';

const ScanScreen = () => {
  const [scanMode, setScanMode] = useState('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [showManualSelection, setShowManualSelection] = useState(false);
  
  // Manual Entry Form State
  const [manualForm, setManualForm] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    quantity: 1,
    servingSize: 100,
    servingType: 'unit' // 'unit' or 'per100g'
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  
  const { addFoodLog, setActiveTab } = useStore();

  const startCamera = useCallback(async () => {
    setError(null);
    setIsCameraReady(false);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraReady(true);
      }
    } catch (err) {
      setError(err.name === 'NotAllowedError' ? 'Camera access required' : 'Camera error');
      setScanMode('upload');
    }
  }, []);

  useEffect(() => {
    if (scanMode === 'camera') startCamera();
    else if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, [scanMode, startCamera]);

  const handleCaptureAndAnalyze = async () => {
    if (!isCameraReady || !videoRef.current) return;
    setIsScanning(true);
    setError(null);
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const results = await predictFood(canvas);
      setPredictions(results);
      if (results.length > 0 && results[0].probability > 0.15) setScanResult(results[0]);
      else setError('Unable to detect food clearly');
    } catch (err) {
      setError('Analysis failed');
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsScanning(true);
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      try {
        const results = await predictFood(img);
        setPredictions(results);
        if (results.length > 0 && results[0].probability > 0.1) setScanResult(results[0]);
        else setError('Unable to detect food');
      } catch (err) {
        setError('Analysis failed');
      } finally {
        setIsScanning(false);
      }
    };
  };

  const handleAddResult = (result) => {
    const food = result || scanResult;
    addFoodLog({
      ...food,
      quantity: 1,
      servingSize: food.servingSize || 100,
      servingType: food.servingType || 'unit'
    });
    setActiveTab('home');
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualForm.name) return;
    
    addFoodLog({
      name: manualForm.name,
      calories: parseFloat(manualForm.calories) || 0,
      protein: parseFloat(manualForm.protein) || 0,
      carbs: parseFloat(manualForm.carbs) || 0,
      fats: parseFloat(manualForm.fats) || 0,
      quantity: parseFloat(manualForm.quantity) || 1,
      servingSize: manualForm.servingType === 'per100g' ? parseFloat(manualForm.servingSize) : 1,
      servingType: manualForm.servingType
    });
    setManualForm({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
      quantity: 1,
      servingSize: 100,
      servingType: 'unit'
    });
    setActiveTab('home');
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="flex justify-between items-end px-1">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Food Entry</h2>
          <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mt-1">Metabolic Core Analysis</p>
        </div>
        {(scanResult || (error && scanMode === 'camera') || showManualSelection) && (
          <button 
            onClick={() => { setScanResult(null); setError(null); setPredictions([]); setShowManualSelection(false); }}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
          >
            <RefreshCw size={20} />
          </button>
        )}
      </div>

      {!scanResult && !showManualSelection && (
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'camera', icon: Camera, label: 'Vision' },
            { id: 'manual', icon: Keyboard, label: 'Manual' },
            { id: 'upload', icon: Upload, label: 'Upload' },
            { id: 'barcode', icon: Barcode, label: 'Code' }
          ].map((mode) => (
            <button 
              key={mode.id}
              onClick={() => {
                setScanMode(mode.id);
                // Clear camera specific errors when switching modes
                if (mode.id !== 'camera') setError(null);
              }}
              className={`flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all ${
                scanMode === mode.id ? 'bg-neon/10 border-neon/30 text-neon' : 'bg-white/5 border-white/5 text-white/40'
              }`}
            >
              <mode.icon size={18} />
              <span className="text-[8px] font-black uppercase tracking-widest">{mode.label}</span>
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!scanResult && !showManualSelection ? (
          <motion.div 
            key="scanner"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-[40px] overflow-hidden relative min-h-[450px] flex flex-col items-center justify-center border-white/5"
          >
            {scanMode === 'camera' && (
              <div className="absolute inset-0 z-0">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale-[0.2] opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/40" />
              </div>
            )}

            {scanMode === 'manual' && (
              <form onSubmit={handleManualSubmit} className="w-full h-full p-8 flex flex-col gap-4 relative z-10">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Food Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Grilled Chicken"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-neon/50 outline-none transition-all"
                    value={manualForm.name}
                    onChange={e => setManualForm({...manualForm, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Serving Type</label>
                    <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                      {['unit', 'per100g'].map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setManualForm({...manualForm, servingType: t})}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${manualForm.servingType === t ? 'bg-neon text-black' : 'text-white/40'}`}
                        >
                          {t === 'unit' ? 'Unit' : 'Per 100g'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">
                      {manualForm.servingType === 'unit' ? 'Quantity' : 'Grams'}
                    </label>
                    <input 
                      required
                      type="number" 
                      placeholder="0"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-neon/50 outline-none transition-all"
                      value={manualForm.servingType === 'unit' ? manualForm.quantity : manualForm.servingSize}
                      onChange={e => setManualForm({
                        ...manualForm, 
                        [manualForm.servingType === 'unit' ? 'quantity' : 'servingSize']: e.target.value
                      })}
                    />
                  </div>
                </div>

                {manualForm.servingType === 'per100g' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Number of Servings</label>
                    <input 
                      type="number" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm"
                      value={manualForm.quantity}
                      onChange={e => setManualForm({...manualForm, quantity: e.target.value})}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Base Calories</label>
                    <input 
                      required
                      type="number" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm"
                      value={manualForm.calories}
                      onChange={e => setManualForm({...manualForm, calories: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Base Protein</label>
                    <input 
                      type="number" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm"
                      value={manualForm.protein}
                      onChange={e => setManualForm({...manualForm, protein: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="mt-4 bg-neon text-black font-black py-5 rounded-[24px] shadow-lg flex items-center justify-center gap-2 text-lg active:scale-95 transition-all"
                >
                  <Plus size={24} /> Log Meal
                </button>
              </form>
            )}

            {scanMode === 'upload' && (
              <div className="text-center p-12 relative z-10">
                <div className="w-24 h-24 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                  <Upload size={32} className="text-white/20" />
                </div>
                <h3 className="text-xl font-black mb-2">Import Image</h3>
                <p className="text-white/40 text-sm mb-8 max-w-[200px] mx-auto">Select a clear photo of your meal for analysis.</p>
                <label className="bg-neon text-black font-black px-10 py-4 rounded-2xl cursor-pointer hover:scale-105 transition-all inline-block shadow-lg">
                  Choose Photo
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              </div>
            )}

            {scanMode === 'barcode' && (
              <div className="text-center p-12 relative z-10">
                <div className="w-24 h-24 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                  <Barcode size={32} className="text-white/20" />
                </div>
                <h3 className="text-xl font-black mb-2">Barcode Scan</h3>
                <p className="text-white/40 text-sm mb-4">Scan product barcodes for instant data.</p>
                <div className="text-[10px] font-black text-neon uppercase tracking-widest px-4 py-2 bg-neon/10 rounded-full inline-block">Coming Soon</div>
              </div>
            )}

            {scanMode === 'camera' && isCameraReady && !isScanning && (
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-10">
                <div className="relative w-72 h-72 mb-12">
                   <div className="absolute -top-2 -left-2 w-12 h-12 border-t-4 border-l-4 border-neon rounded-tl-3xl" />
                   <div className="absolute -top-2 -right-2 w-12 h-12 border-t-4 border-r-4 border-neon rounded-tr-3xl" />
                   <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-4 border-l-4 border-neon rounded-bl-3xl" />
                   <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-4 border-r-4 border-neon rounded-br-3xl" />
                   <div className="absolute inset-4 border border-white/10 rounded-2xl animate-pulse" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCaptureAndAnalyze}
                  className="w-24 h-24 rounded-full border-8 border-white/10 p-1 flex items-center justify-center bg-white/5"
                >
                  <div className="w-full h-full rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center">
                     <Scan size={32} className="text-black" />
                  </div>
                </motion.button>
              </div>
            )}

            {isScanning && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-24 h-24 border-2 border-dashed border-neon/50 rounded-full flex items-center justify-center mb-6"
                >
                  <Sparkles size={32} className="text-neon" />
                </motion.div>
                <h3 className="text-2xl font-black text-white">Metabolic Engine</h3>
                <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Decoding Nutrients...</p>
              </div>
            )}

            {error && scanMode === 'camera' && !isScanning && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0A0A0A]/90 p-12 text-center">
                <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h3 className="text-2xl font-black mb-2">Detection Failed</h3>
                <p className="text-white/40 text-sm mb-8">{error}</p>
                <button 
                  onClick={() => setShowManualSelection(true)}
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold transition-all border border-white/10"
                >
                  Select from List
                </button>
              </div>
            )}

          </motion.div>
        ) : showManualSelection ? (
          <motion.div key="manual-list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
             <div className="glass-card p-4">
                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {COMMON_FOODS.map((food, idx) => (
                    <button key={idx} onClick={() => handleAddResult(food)} className="flex items-center justify-between p-5 bg-white/[0.03] hover:bg-white/[0.08] rounded-3xl border border-white/5 transition-all group">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl">🥗</div>
                        <div>
                          <span className="font-bold text-white group-hover:text-neon transition-colors block leading-tight">{food.name}</span>
                          <span className="text-[10px] text-white/30 font-black uppercase tracking-wider">{food.calories} kcal • {food.protein}g protein</span>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-white/20 group-hover:text-neon transition-all" />
                    </button>
                  ))}
                </div>
             </div>
             <button onClick={() => setShowManualSelection(false)} className="text-white/40 font-bold text-xs uppercase tracking-widest py-4 hover:text-white transition-colors text-center">Back to Vision</button>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 flex flex-col gap-8 relative overflow-hidden border-neon/20 bg-neon/[0.02]">
            <div className="flex justify-between items-start">
              <div className="max-w-[70%]">
                <span className="text-neon text-[10px] font-black uppercase tracking-[0.3em] bg-neon/10 px-4 py-1.5 rounded-full mb-4 inline-block">Vision Complete</span>
                <h3 className="text-4xl font-black tracking-tighter leading-tight">{scanResult.name}</h3>
              </div>
              <div className="w-20 h-20 rounded-3xl bg-neon/10 border border-neon/20 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,255,135,0.2)]">
                <Check size={28} className="text-neon mb-0.5" />
                <span className="text-[10px] font-black text-neon">{Math.round(scanResult.probability * 100)}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-[32px] border border-white/5">
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-2">Metabolic Load</p>
                <div className="flex items-baseline gap-1">
                   <p className="text-3xl font-black text-neon">{scanResult.calories}</p>
                   <p className="text-xs font-bold text-white/20 uppercase">Kcal</p>
                </div>
              </div>
              <div className="bg-white/5 p-6 rounded-[32px] border border-white/5">
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-2">Protein Density</p>
                <div className="flex items-baseline gap-1">
                   <p className="text-3xl font-black">{scanResult.protein}</p>
                   <p className="text-xs font-bold text-white/20 uppercase">Grams</p>
                </div>
              </div>
            </div>

            {predictions.length > 1 && (
              <div className="space-y-4">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">AI Probability Alternatives</p>
                <div className="flex flex-col gap-2">
                  {predictions.slice(1, 3).map((pred, idx) => (
                    <button key={idx} onClick={() => setScanResult(pred)} className="w-full flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.06] rounded-2xl border border-white/5 text-sm transition-all group">
                      <span className="font-bold text-white/60 group-hover:text-white">{pred.className.split(',')[0]}</span>
                      <span className="text-[10px] font-black text-white/20 uppercase">{Math.round(pred.probability * 100)}% match</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 pt-4">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleAddResult()} className="w-full bg-neon text-black font-black py-5 rounded-[24px] shadow-[0_10px_40px_rgba(0,255,135,0.3)] flex items-center justify-center gap-3 text-lg">
                <Check size={24} strokeWidth={3} /> Log for Analysis
              </motion.button>
              <button onClick={() => setShowManualSelection(true)} className="w-full py-2 text-white/30 font-bold hover:text-white transition-colors text-xs uppercase tracking-widest">Inaccurate? Select from list</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScanScreen;
