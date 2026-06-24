import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { SEEDED_ISSUES } from '../utils/seededData';

export default function Admin() {
  const getSLAStatus = (hours) => {
    if (hours < 12) return { text: 'Critical', color: 'text-danger', bg: 'bg-danger/20' };
    if (hours < 24) return { text: 'Warning', color: 'text-warning', bg: 'bg-warning/20' };
    return { text: 'On Track', color: 'text-success', bg: 'bg-success/20' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-secondary/20 text-secondary rounded-lg border border-secondary/30">
          <Shield size={32} />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">Department Portal</h1>
          <p className="text-textSecondary">Roads & Infrastructure Department</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 border-t-4 border-t-danger">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-textSecondary font-medium">SLA Breaches</h3>
            <AlertTriangle className="text-danger" size={20} />
          </div>
          <p className="text-3xl font-display font-bold text-danger">3</p>
          <p className="text-xs text-textSecondary mt-2">Requires immediate action</p>
        </div>
        <div className="glass-card p-6 border-t-4 border-t-warning">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-textSecondary font-medium">Due Today</h3>
            <Clock className="text-warning" size={20} />
          </div>
          <p className="text-3xl font-display font-bold text-warning">8</p>
          <p className="text-xs text-textSecondary mt-2">Approaching deadline</p>
        </div>
        <div className="glass-card p-6 border-t-4 border-t-success">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-textSecondary font-medium">Resolved (Week)</h3>
            <CheckCircle className="text-success" size={20} />
          </div>
          <p className="text-3xl font-display font-bold text-success">45</p>
          <p className="text-xs text-success mt-2">+12% vs last week</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="font-display font-bold text-xl">Active Queue</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-surface border border-border rounded text-sm hover:border-primary transition-colors">Sort by SLA</button>
            <button className="px-3 py-1 bg-surface border border-border rounded text-sm hover:border-primary transition-colors">Filter: Critical</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/50 text-textSecondary text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Issue ID</th>
                <th className="p-4 font-medium">Details</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">SLA Countdown</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {SEEDED_ISSUES.slice(0, 4).map((issue, idx) => {
                const hoursLeft = idx === 0 ? 4 : idx === 1 ? 18 : 36;
                const sla = getSLAStatus(hoursLeft);
                
                return (
                  <tr key={issue.id} className="border-b border-border hover:bg-surface/30 transition-colors">
                    <td className="p-4 font-mono text-xs text-textSecondary">#NA-{8400 + parseInt(issue.id)}</td>
                    <td className="p-4">
                      <p className="font-medium text-textPrimary">{issue.title}</p>
                      <p className="text-xs text-danger font-semibold mt-1">Severity {issue.severity}/5</p>
                    </td>
                    <td className="p-4 text-sm text-textSecondary">{issue.address}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${sla.bg} border border-${sla.color.split('-')[1]}`}></span>
                        <span className={`font-mono font-bold ${sla.color}`}>{hoursLeft}h left</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <select className="bg-surface border border-border rounded px-2 py-1 text-sm outline-none focus:border-primary">
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Mark Resolved</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
