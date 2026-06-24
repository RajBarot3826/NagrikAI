import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../components/StatCard';
import InsightCard from '../components/InsightCard';
import ActivityFeed from '../components/ActivityFeed';
import { TrendingUp, Users, CheckCircle2, AlertOctagon, Loader } from 'lucide-react';
import { getDashboardData, getIssues } from '../utils/api';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsData, issues] = await Promise.all([
          getDashboardData(),
          getIssues()
        ]);
        
        setAnalytics(analyticsData);
        
        // Map recent issues to activities
        const mappedActivities = issues.slice(-5).map(issue => ({
          type: issue.status === 'OPEN' ? 'NEW' : issue.status,
          message: issue.title,
          location: issue.category,
          timeago: 'recently'
        }));
        setRecentActivities(mappedActivities.reverse());
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <Loader className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  const { kpi, status_data, category_data, trend_data, insights } = analytics;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      className="p-4 md:p-8 max-w-[1400px] mx-auto w-full space-y-8"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="font-display text-4xl font-bold text-textPrimary tracking-tight">Command Center</h1>
          <p className="text-primary mt-2 font-mono text-sm">REAL-TIME ANALYTICS / BHAVNAGAR MUNICIPAL CORP</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4">
          <select className="bg-surface/50 backdrop-blur-md border border-primary/20 rounded-xl px-5 py-2.5 outline-none text-textPrimary cursor-pointer hover:border-primary/50 transition-colors">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
          <button className="btn-primary py-2.5">Generate Report</button>
        </div>
      </motion.div>

      {/* KPI Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Anomalies" value={kpi?.total || 0} icon={<AlertOctagon />} trend="Live" />
        <StatCard title="Successfully Resolved" value={kpi?.resolved || 0} icon={<CheckCircle2 />} trend="Live" />
        <StatCard title="Avg Resolution Time" value={kpi?.avg_resolution_time || 0} suffix=" hrs" icon={<TrendingUp />} />
        <StatCard title="Active Field Agents" value={kpi?.field_agents || 0} icon={<Users />} trend="Live" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-6">
            <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-primary rounded-full"></div>
              Issue Categories (Live)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={category_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3B" vertical={false} />
                  <XAxis dataKey="name" stroke="#94A3B8" tick={{fill: '#94A3B8'}} />
                  <YAxis stroke="#94A3B8" tick={{fill: '#94A3B8'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FBE8CE', border: '1px solid #C3CC93', borderRadius: '12px' }}
                    itemStyle={{ color: '#FFF0E4' }}
                  />
                  <Bar dataKey="count" fill="#9AB17A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 group hover:border-primary/40 transition-colors">
              <h3 className="font-display font-semibold mb-8 text-xl flex items-center gap-3">
                <span className="w-2 h-6 bg-secondary rounded-full"></span>
                Reporting Trend (Live)
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend_data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#004A4A" vertical={false} />
                    <XAxis dataKey="day" stroke="#FFF0E4" tick={{ fill: '#FFF0E4', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#FBE8CE', borderColor: '#9AB17A', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="issues" stroke="#C3CC93" strokeWidth={4} dot={{ fill: '#C3CC93', strokeWidth: 2, r: 4 }} activeDot={{ r: 8, fill: '#9AB17A' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-8 group hover:border-primary/40 transition-colors">
              <h3 className="font-display font-semibold mb-8 text-xl flex items-center gap-3">
                <span className="w-2 h-6 bg-warning rounded-full"></span>
                Status Breakdown (Live)
              </h3>
              <div className="h-56 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={status_data} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                      {status_data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#FBE8CE', borderColor: '#9AB17A', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Insights + Feed) */}
        <motion.div variants={itemVariants} className="space-y-8 flex flex-col">
          <div className="glass-card p-8 border border-primary/30 relative overflow-hidden shadow-[0_0_30px_rgba(154,177,122,0.15)]">
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-primary/20 rounded-full filter blur-[50px] animate-pulse"></div>
            <h3 className="font-display font-bold mb-6 text-xl flex items-center gap-3 text-textPrimary relative z-10">
              <div className="p-2 bg-primary/20 rounded-lg"><span className="text-xl">✨</span></div>
              Gemini Insights (Live)
            </h3>
            <div className="space-y-5 relative z-10">
              {insights && insights.map((insight, idx) => (
                <InsightCard key={idx} insight={insight} />
              ))}
            </div>
          </div>

          <div className="glass-card p-8 flex-1 min-h-[400px]">
             <h3 className="font-display font-semibold mb-6 text-xl text-textPrimary">Live Activity Stream</h3>
             <ActivityFeed activities={recentActivities} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
