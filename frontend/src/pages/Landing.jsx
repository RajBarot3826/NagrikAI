import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import { ShieldCheck, MapPin, Search, Cpu, Activity, Zap } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    in: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
    out: { opacity: 0, scale: 1.02, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="flex-1 flex flex-col relative"
    >
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-32 overflow-hidden min-h-[90vh]">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="z-10 text-center max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass-card mb-10 text-primary font-mono text-sm border-primary/30 shadow-[0_0_20px_rgba(154,177,122,0.2)]">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
            Live Intelligence Network Active
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="font-display text-6xl md:text-8xl font-bold mb-6 leading-[1.1] tracking-tight">
            Every Pothole.<br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-textPrimary via-primary to-secondary inline-block pb-2">
              Every Voice.
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-textSecondary mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            The world's first <strong className="text-primary font-semibold">5-Agent AI ecosystem</strong> designed exclusively for civic infrastructure. Report, route, and resolve faster than ever.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => navigate('/report')}
              className="btn-primary text-xl px-10 py-5 flex items-center gap-3 shadow-[0_0_40px_rgba(154,177,122,0.4)] hover:scale-105"
            >
              <Zap size={24} /> Initialize Report
            </button>
            <button 
              onClick={() => navigate('/map')}
              className="btn-secondary text-xl px-10 py-5 flex items-center gap-3 bg-surface/50 backdrop-blur-md"
            >
              <Activity size={24} /> Enter Live Grid
            </button>
          </motion.div>
        </motion.div>

        {/* Floating Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="z-10 w-full max-w-6xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 px-4"
        >
          <div className="glass-card p-8 text-center transform transition-all hover:scale-105 hover:-translate-y-2 border-t-2 border-t-primary/50">
            <h3 className="text-5xl font-display font-bold text-textPrimary mb-3 drop-shadow-[0_0_15px_rgba(255,240,228,0.5)]">
              1,247
            </h3>
            <p className="text-primary uppercase tracking-[0.2em] text-sm font-bold">Anomalies Detected</p>
          </div>
          <div className="glass-card p-8 text-center transform transition-all hover:scale-105 hover:-translate-y-2 border-t-2 border-t-success/50">
            <h3 className="text-5xl font-display font-bold text-textPrimary mb-3 drop-shadow-[0_0_15px_rgba(255,240,228,0.5)]">
              892
            </h3>
            <p className="text-success uppercase tracking-[0.2em] text-sm font-bold">Issues Resolved</p>
          </div>
          <div className="glass-card p-8 text-center transform transition-all hover:scale-105 hover:-translate-y-2 border-t-2 border-t-textSecondary/50">
            <h3 className="text-5xl font-display font-bold text-textPrimary mb-3 drop-shadow-[0_0_15px_rgba(255,240,228,0.5)]">
              12,450
            </h3>
            <p className="text-textSecondary uppercase tracking-[0.2em] text-sm font-bold">Active Agents</p>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="py-32 relative z-10 bg-background/80 backdrop-blur-xl border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-textPrimary drop-shadow-md">The Neural Architecture</h2>
            <p className="text-xl text-textSecondary max-w-3xl mx-auto font-light">A synchronized swarm of 5 AI agents handling classification, deduplication, and SLA management instantly.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Cpu, title: "VisionAgent", color: "text-primary", desc: "Gemini 2.0 visual analysis for instant anomaly classification and severity scoring." },
              { icon: Search, title: "DedupeAgent", color: "text-secondary", desc: "Spatial proximity embeddings to prevent duplicate dispatches and save resources." },
              { icon: MapPin, title: "RoutingAgent", color: "text-warning", desc: "Algorithmic assignment to correct municipal departments with dynamic SLAs." },
              { icon: ShieldCheck, title: "EscalationAgent", color: "text-danger", desc: "Continuous temporal monitoring to flag SLA breaches and escalate." }
            ].map((agent, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-card p-8 relative overflow-hidden group shadow-2xl"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-current opacity-10 rounded-full blur-3xl ${agent.color}`}></div>
                <div className={`${agent.color} mb-6 group-hover:scale-125 transition-transform duration-500 drop-shadow-[0_0_10px_currentColor]`}>
                  <agent.icon size={48} strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-bold text-2xl mb-3 text-textPrimary">{agent.title}</h3>
                <p className="text-base text-textSecondary leading-relaxed">{agent.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
