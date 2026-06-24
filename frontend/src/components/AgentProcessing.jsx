import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScanSearch, Tags, AlertTriangle, MapPin, Search, Network, CheckCircle2 } from 'lucide-react';

const steps = [
  { id: 1, label: 'VisionAgent scanning image...', icon: <ScanSearch />, duration: 800 },
  { id: 2, label: 'Categorizing issue type...', icon: <Tags />, duration: 1200 },
  { id: 3, label: 'Assessing severity (1-5)...', icon: <AlertTriangle />, duration: 1400 },
  { id: 4, label: 'Extracting location context...', icon: <MapPin />, duration: 1600 },
  { id: 5, label: 'DedupeAgent checking duplicates...', icon: <Search />, duration: 2100 },
  { id: 6, label: 'RoutingAgent assigning department...', icon: <Network />, duration: 2300 }
];

export default function AgentProcessing({ onComplete }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    let timers = [];
    let cumulativeTime = 0;

    steps.forEach((step, index) => {
      cumulativeTime += step.duration;
      const timer = setTimeout(() => {
        setCurrentStepIndex(index + 1);
        if (index === steps.length - 1) {
          setTimeout(() => onComplete(), 500);
        }
      }, cumulativeTime);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 mx-auto mb-6 rounded-full border-4 border-secondary/30 border-t-secondary border-r-primary flex items-center justify-center relative shadow-[0_0_40px_rgba(124,58,237,0.3)]"
          >
            <span className="text-3xl">🤖</span>
          </motion.div>
          <h2 className="font-display text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            NagrikAI Engine
          </h2>
          <p className="text-textSecondary mt-2">Processing civic intelligence...</p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = currentStepIndex > index;
            const isCurrent = currentStepIndex === index;
            const isWaiting = currentStepIndex < index;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isWaiting ? 0 : 1, x: isWaiting ? -20 : 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isCurrent ? 'bg-secondary/10 border-secondary/30 shadow-[0_0_15px_rgba(124,58,237,0.2)]' : 
                  isCompleted ? 'bg-surface border-border' : 'hidden'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${isCurrent ? 'text-secondary animate-pulse' : isCompleted ? 'text-textSecondary' : ''}`}>
                    {step.icon}
                  </div>
                  <span className={`text-sm font-mono ${isCompleted ? 'text-textSecondary' : 'text-textPrimary'}`}>
                    {step.label}
                  </span>
                </div>
                {isCompleted && <CheckCircle2 size={18} className="text-success" />}
                {isCurrent && <span className="text-xs font-mono text-secondary animate-pulse">Running</span>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
