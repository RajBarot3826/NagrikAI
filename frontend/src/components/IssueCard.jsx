import { Clock, MapPin, ThumbsUp } from 'lucide-react';
import CategoryIcon from './CategoryIcon';
import SeverityBadge from './SeverityBadge';
import { motion } from 'framer-motion';

export default function IssueCard({ issue, onClick }) {
  const getStatusColor = (status) => {
    if (status === 'RESOLVED') return 'text-success';
    if (status === 'IN_PROGRESS') return 'text-warning';
    return 'text-danger';
  };

  return (
    <motion.div 
      variants={{
        rest: { scale: 1, boxShadow: "0 0 0 rgba(0,212,255,0)" },
        hover: { scale: 1.02, boxShadow: "0 0 20px rgba(0,212,255,0.15)" }
      }}
      initial="rest"
      whileHover="hover"
      className="glass-card p-4 cursor-pointer"
      onClick={() => onClick && onClick(issue)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-surface rounded-lg">
            <CategoryIcon category={issue.category} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm line-clamp-1">{issue.title}</h3>
            <p className={getStatusColor(issue.status) + " text-xs font-medium"}>
              {issue.status.replace('_', ' ')}
            </p>
          </div>
        </div>
        <SeverityBadge severity={issue.severity} />
      </div>

      {issue.image_url && (
        <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
          <img src={issue.image_url} alt={issue.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-center justify-between text-textSecondary text-xs">
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          <span className="line-clamp-1 max-w-[120px]">{issue.address || issue.ward}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><Clock size={14} /> 2h ago</span>
          <span className="flex items-center gap-1 text-primary"><ThumbsUp size={14} /> {issue.upvotes}</span>
        </div>
      </div>
    </motion.div>
  );
}
