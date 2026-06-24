import { Shield, ShieldAlert, Award, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BadgeDisplay({ level = 'Nagrik' }) {
  const getBadgeDetails = () => {
    switch (level) {
      case 'Legend':
        return { icon: <Crown size={24} />, color: 'text-warning', bg: 'bg-warning/20', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]' };
      case 'Hero':
        return { icon: <Award size={24} />, color: 'text-primary', bg: 'bg-primary/20', shadow: 'shadow-[0_0_15px_rgba(0,212,255,0.5)]' };
      case 'Sevak':
        return { icon: <ShieldAlert size={24} />, color: 'text-success', bg: 'bg-success/20', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' };
      default:
        return { icon: <Shield size={24} />, color: 'text-textSecondary', bg: 'bg-surface', shadow: '' };
    }
  };

  const badge = getBadgeDetails();

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 ${badge.bg} ${badge.shadow}`}
    >
      <span className={badge.color}>{badge.icon}</span>
      <span className={`font-display font-bold text-sm ${badge.color}`}>{level}</span>
    </motion.div>
  );
}
