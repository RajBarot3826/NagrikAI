import { useEffect, useState } from 'react';
import { CircleDot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ActivityFeed({ activities = [] }) {
  const [feed, setFeed] = useState(activities);

  const getColor = (type) => {
    switch (type) {
      case 'NEW': return 'text-danger';
      case 'UPDATE': return 'text-warning';
      case 'RESOLVED': return 'text-success';
      default: return 'text-primary';
    }
  };

  return (
    <div className="glass-card p-4 h-full overflow-hidden flex flex-col">
      <h3 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-textSecondary flex items-center gap-2">
        <CircleDot size={16} className="text-primary animate-pulse" />
        Live City Activity
      </h3>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        <AnimatePresence>
          {feed.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3 text-sm relative"
            >
              <div className="flex flex-col items-center">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${getColor(item.type)}`} style={{ backgroundColor: 'currentColor' }} />
                {idx !== feed.length - 1 && <div className="w-[1px] h-full bg-border mt-2" />}
              </div>
              <div className="pb-4">
                <p className="text-textPrimary">{item.message}</p>
                <p className="text-xs text-textSecondary mt-1">{item.timeago} • {item.location}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
