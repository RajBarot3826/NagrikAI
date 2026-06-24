import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Camera, MapPin, ArrowRight, Share2, CheckCircle2, Bot, Mic, MicOff } from 'lucide-react';
import AgentProcessing from '../components/AgentProcessing';
import { analyzeImage, analyzeVoice, createReport } from '../utils/api';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function ReportIssue() {
  const [step, setStep] = useState(1);
  const [inputMode, setInputMode] = useState('image'); // 'image' or 'voice'
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  
  // Voice State
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  
  const { width, height } = useWindowSize();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN'; // Default to Hindi to capture mixed Hindi/English/Gujarati

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      if (transcript.trim().length > 5) {
        startVoiceAnalysis(transcript);
      }
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const startVoiceAnalysis = async (text) => {
    setIsProcessing(true);
    try {
      const result = await analyzeVoice(text);
      setAiResult(result);
    } catch (e) {
      console.error("Voice Analysis failed", e);
      setAiResult({
         title: "Voice Anomaly Detected",
         category: "OTHER",
         severity: 3,
         description: text || "Could not fetch AI analysis."
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    setIsProcessing(true);
    try {
      // Convert preview string if needed, or pass directly since it's base64
      const result = await analyzeImage(preview);
      setAiResult(result);
    } catch (e) {
      console.error("Analysis failed", e);
      // Fallback if no backend keys
      setAiResult({
         title: "Anomaly Detected",
         category: "OTHER",
         severity: 3,
         description: "Could not fetch AI analysis. Proceeding with manual review."
      });
    }
  };

  const handleAnalysisComplete = () => {
    setIsProcessing(false);
    setStep(3);
  };

  const submitReport = async () => {
    try {
      await createReport({
        latitude: 21.7645 + (Math.random() * 0.01 - 0.005),
        longitude: 72.1519 + (Math.random() * 0.01 - 0.005),
        ai_analysis: aiResult
      });
      setStep(4);
    } catch (e) {
      console.error("Submit failed", e);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center p-4 md:p-8 max-w-[1200px] mx-auto w-full relative z-10"
    >
      <AnimatePresence>
        {isProcessing && <AgentProcessing onComplete={handleAnalysisComplete} />}
      </AnimatePresence>

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-4xl mb-12 text-center"
      >
        <h1 className="font-display text-5xl font-bold mb-6 text-textPrimary tracking-tight">Report Anomaly</h1>
        <div className="flex gap-4 justify-center items-center max-w-xl mx-auto">
          {[1, 2, 3].map((s, i) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`h-3 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-primary shadow-[0_0_15px_rgba(154,177,122,0.6)]' : 'bg-surface border border-primary/20'}`} />
            </div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-2xl glass-card p-10 text-center flex flex-col items-center shadow-[0_0_40px_rgba(0,0,0,0.3)]"
          >
            <div className="flex w-full mb-8 bg-surface/50 p-1 rounded-xl border border-primary/20">
              <button 
                onClick={() => setInputMode('image')}
                className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${inputMode === 'image' ? 'bg-primary text-white shadow-md' : 'text-textPrimary hover:bg-primary/10'}`}
              >
                <Camera size={20} /> Visual Scan
              </button>
              <button 
                onClick={() => setInputMode('voice')}
                className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${inputMode === 'voice' ? 'bg-primary text-white shadow-md' : 'text-textPrimary hover:bg-primary/10'}`}
              >
                <Mic size={20} /> Voice Reporter (Multilingual)
              </button>
            </div>

            {inputMode === 'image' ? (
              <>
                <h2 className="text-2xl font-bold mb-8 text-textPrimary flex items-center gap-3">
                  <Camera className="text-primary" /> Visual Input Required
                </h2>
            
            <div 
              className="w-full aspect-[16/9] rounded-2xl border-2 border-dashed border-primary/40 hover:border-primary bg-surface/50 hover:bg-primary/5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden mb-8 group shadow-inner"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <motion.img 
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center">
                  <UploadCloud size={64} className="text-primary mb-4 drop-shadow-[0_0_10px_rgba(154,177,122,0.5)] group-hover:animate-bounce" />
                  <p className="text-lg text-textPrimary mb-2 font-semibold">Click or drag anomaly image here</p>
                  <p className="text-sm text-primary font-mono bg-primary/10 px-3 py-1 rounded-full">JPG, PNG / Max 10MB</p>
                </motion.div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <div className="flex gap-4 w-full mb-8">
              <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
                <Camera size={20} /> Live Capture
              </button>
              <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
                <MapPin size={20} /> Extract EXIF Data
              </button>
            </div>

            <button 
              disabled={!preview}
              onClick={startAnalysis}
              className={`w-full text-xl flex items-center justify-center gap-3 py-4 transition-all duration-300 ${preview ? 'btn-primary' : 'bg-surface text-textSecondary rounded-xl cursor-not-allowed border border-border'}`}
            >
              Initialize Gemini Analysis <Bot size={24} />
            </button>
            </>
            ) : (
              <div className="flex flex-col items-center w-full">
                <h2 className="text-2xl font-bold mb-4 text-textPrimary flex items-center gap-3">
                  <Mic className="text-primary" /> Speak Your Report
                </h2>
                <p className="text-textSecondary mb-8">Supports English, Hindi, and Gujarati. Speak naturally, Gemini will extract the details.</p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleRecording}
                  className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 border-4 transition-all duration-300 ${isRecording ? 'bg-danger/20 border-danger text-danger shadow-[0_0_50px_rgba(239,68,68,0.5)] animate-pulse' : 'bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(154,177,122,0.4)] hover:bg-primary/30'}`}
                >
                  {isRecording ? <MicOff size={48} /> : <Mic size={48} />}
                </motion.button>

                <div className="w-full min-h-[120px] bg-surface/50 border border-primary/20 rounded-xl p-4 text-left text-lg text-textPrimary mb-6 flex flex-col justify-between">
                  {transcript || <span className="text-textSecondary/50 italic">"Ghar ke paas bohot bada khadda hai..."</span>}
                  {isRecording && <div className="w-4 h-4 rounded-full bg-danger animate-ping self-end mt-2"></div>}
                </div>

                <button 
                  disabled={transcript.trim().length < 5 && !isRecording}
                  onClick={isRecording ? toggleRecording : () => startVoiceAnalysis(transcript)}
                  className={`w-full text-xl flex items-center justify-center gap-3 py-4 transition-all duration-300 ${(transcript.trim().length >= 5 || isRecording) ? 'btn-primary' : 'bg-surface text-textSecondary rounded-xl cursor-not-allowed border border-border'}`}
                >
                  {isRecording ? 'Stop & Analyze' : 'Analyze Voice'} <Bot size={24} />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {step === 3 && aiResult && (
          <motion.div 
            key="step3"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="glass-card p-8 border border-primary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px]"></div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-textPrimary">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-[0_0_15px_rgba(154,177,122,0.3)]"><Bot size={20}/></div>
                VisionAgent Output
              </h2>
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-6 border border-border/50 relative shadow-inner">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-4">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-primary">
                    <span>CONFIDENCE: 98.4%</span>
                    <span>LAT: 21.76 LON: 72.15</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="p-4 bg-surface/50 rounded-xl border border-primary/20 hover:border-primary/50 transition-colors">
                  <p className="text-xs text-primary font-mono mb-1">CLASSIFICATION</p>
                  <p className="font-semibold text-lg">{aiResult.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface/50 rounded-xl border border-primary/20 hover:border-primary/50 transition-colors">
                    <p className="text-xs text-primary font-mono mb-1">TYPE</p>
                    <p className="font-semibold">{aiResult.category}</p>
                  </div>
                  <div className="p-4 bg-surface/50 rounded-xl border border-danger/30 hover:border-danger/60 transition-colors bg-danger/5">
                    <p className="text-xs text-danger font-mono mb-1">SEVERITY INDEX</p>
                    <p className="font-bold text-xl text-danger">{aiResult.severity}/5</p>
                  </div>
                </div>
                <div className="p-4 bg-surface/50 rounded-xl border border-success/30 hover:border-success/60 transition-colors bg-success/5">
                  <p className="text-xs text-success font-mono mb-1">ROUTING PROTOCOL</p>
                  <p className="font-semibold">{aiResult.department}</p>
                  <p className="text-sm mt-1 opacity-80">SLA Enforced: {aiResult.sla_hours} hrs</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.3)]">
              <h2 className="text-2xl font-bold mb-6 text-textPrimary">Verify & Authorize</h2>
              <div className="space-y-6 flex-1">
                <div>
                  <label className="block text-sm font-mono text-primary mb-2">SYSTEM GENERATED TITLE</label>
                  <input type="text" defaultValue={aiResult.title} className="w-full bg-surface/80 border border-border/80 rounded-xl p-4 text-textPrimary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-inner" />
                </div>
                <div>
                  <label className="block text-sm font-mono text-primary mb-2">GEO-LOCATION</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" size={18} />
                    <input type="text" defaultValue="Waghawadi Road, Bhavnagar" className="w-full bg-surface/80 border border-border/80 rounded-xl p-4 pl-12 text-textPrimary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-inner" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-mono text-primary mb-2">CONTEXTUAL DATA</label>
                  <textarea rows={4} className="w-full bg-surface/80 border border-border/80 rounded-xl p-4 text-textPrimary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-inner" placeholder="Add more context..." defaultValue={aiResult.description}></textarea>
                </div>
              </div>
              
              <button onClick={submitReport} className="w-full btn-primary py-5 text-lg mt-8 flex items-center justify-center gap-2 group">
                Dispatch Request <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div 
            key="step4"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-2xl glass-card p-12 text-center relative overflow-hidden border border-success/30 shadow-[0_0_50px_rgba(154,177,122,0.2)]"
          >
            <Confetti width={width} height={height} recycle={false} numberOfPieces={800} gravity={0.15} colors={['#9AB17A', '#C3CC93', '#FFF0E4', '#FFECC5']} />
            
            <div className="absolute inset-0 bg-success/5 animate-pulse"></div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, delay: 0.2 }}
              className="w-24 h-24 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-8 relative z-10 shadow-[0_0_40px_rgba(154,177,122,0.5)] border-2 border-success/50"
            >
              <CheckCircle2 size={50} strokeWidth={2.5} />
            </motion.div>
            
            <h2 className="text-4xl font-display font-bold mb-4 relative z-10 text-textPrimary">Anomaly Logged</h2>
            <p className="text-lg text-textSecondary mb-8 relative z-10 max-w-md mx-auto">
              ID <strong className="text-textPrimary bg-surface px-2 py-1 rounded">#NAG-8492</strong> dispatched securely to <br/><span className="text-success font-semibold">{aiResult?.department}</span>.
            </p>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-surface/80 rounded-xl p-6 mb-10 border border-primary/30 relative z-10 shadow-inner"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <Zap className="text-warning" fill="currentColor" />
                <p className="text-xl font-bold text-primary">+50 Reputation</p>
              </div>
              <p className="text-sm text-textSecondary font-mono">2 reports remaining for 'Sevak' clearance.</p>
            </motion.div>

            <div className="flex gap-4 relative z-10">
              <button onClick={() => {setStep(1); setPreview(null); setAiResult(null);}} className="flex-1 btn-secondary py-4 text-lg">
                Log New Anomaly
              </button>
              <button className="flex-1 btn-primary py-4 text-lg flex items-center justify-center gap-3">
                <Share2 size={20} /> Broadcast
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Dummy Zap icon since I used it above
const Zap = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
