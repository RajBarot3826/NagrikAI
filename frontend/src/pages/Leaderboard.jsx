import { motion } from 'framer-motion';
import BadgeDisplay from '../components/BadgeDisplay';

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Rahul Desai', ward: 'Ward 4', reports: 56, verified: 34, score: 2450, badge: 'Legend' },
  { rank: 2, name: 'Pooja Patel', ward: 'Ward 8', reports: 42, verified: 28, score: 1890, badge: 'Hero' },
  { rank: 3, name: 'Amit Shah', ward: 'Ward 3', reports: 38, verified: 15, score: 1540, badge: 'Hero' },
  { rank: 4, name: 'Sneha Rao', ward: 'Ward 5', reports: 25, verified: 12, score: 1120, badge: 'Sevak' },
  { rank: 5, name: 'Vikram Singh', ward: 'Ward 1', reports: 18, verified: 5, score: 850, badge: 'Sevak' },
];

export default function Leaderboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8"
    >
      {/* Top Section - My Impact */}
      <div className="glass-card p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full filter blur-[50px]"></div>
        
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-surface" />
            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="377" strokeDashoffset="120" className="text-primary" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-display">845</span>
            <span className="text-[10px] uppercase text-textSecondary">XP</span>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-display font-bold mb-2">Priya Sharma</h2>
          <p className="text-textSecondary mb-4">Bhavnagar • Ward 5</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <BadgeDisplay level="Sevak" />
            <div className="bg-surface border border-border px-3 py-1.5 rounded-full text-xs font-semibold text-textSecondary flex items-center gap-2">
              <span className="text-success">✓</span> 12 Verified
            </div>
            <div className="bg-surface border border-border px-3 py-1.5 rounded-full text-xs font-semibold text-textSecondary flex items-center gap-2">
              <span className="text-primary">📸</span> 18 Reports
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 text-center min-w-[200px]">
          <p className="text-xs text-textSecondary uppercase tracking-wider mb-1">Next Badge</p>
          <p className="font-display font-bold text-primary mb-2">Hero</p>
          <p className="text-xs text-textSecondary">155 XP to unlock</p>
        </div>
      </div>

      {/* Ward Challenge Banner */}
      <div className="bg-gradient-to-r from-secondary/20 to-primary/20 border border-secondary/30 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-lg text-white">🏆 Ward Challenge</h3>
          <p className="text-sm text-textSecondary mt-1">Ward 4 is leading this week! Report issues to help your ward win.</p>
        </div>
        <div className="mt-4 md:mt-0 w-full md:w-64">
          <div className="flex justify-between text-xs mb-1">
            <span>Ward 4</span>
            <span className="text-primary">Ward 5 (You)</span>
          </div>
          <div className="h-2 bg-surface rounded-full overflow-hidden flex">
            <div className="h-full bg-success w-[60%]"></div>
            <div className="h-full bg-primary w-[40%]"></div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="font-display font-bold text-xl">Top Citizens</h3>
          <select className="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm outline-none">
            <option>All Wards</option>
            <option>Ward 1</option>
            <option>Ward 3</option>
            <option>Ward 4</option>
            <option>Ward 5</option>
            <option>Ward 8</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/50 text-textSecondary text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Rank</th>
                <th className="p-4 font-medium">Citizen</th>
                <th className="p-4 font-medium">Ward</th>
                <th className="p-4 font-medium">Reports</th>
                <th className="p-4 font-medium">Score</th>
                <th className="p-4 font-medium">Badge</th>
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD_DATA.map((user) => (
                <tr key={user.rank} className="border-b border-border hover:bg-surface/30 transition-colors">
                  <td className="p-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      user.rank === 1 ? 'bg-warning/20 text-warning' : 
                      user.rank === 2 ? 'bg-slate-400/20 text-slate-300' :
                      user.rank === 3 ? 'bg-amber-700/20 text-amber-600' : 'text-textSecondary'
                    }`}>
                      {user.rank}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-textPrimary">{user.name}</td>
                  <td className="p-4 text-textSecondary text-sm">{user.ward}</td>
                  <td className="p-4 text-sm">
                    <span className="text-primary">{user.reports}</span> / <span className="text-success">{user.verified}</span>
                  </td>
                  <td className="p-4 font-mono text-primary font-semibold">{user.score}</td>
                  <td className="p-4">
                    <BadgeDisplay level={user.badge} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
