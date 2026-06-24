import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import ReportIssue from './pages/ReportIssue';
import LiveMap from './pages/LiveMap';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import IssueDetail from './pages/IssueDetail';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-textPrimary flex flex-col relative overflow-hidden">
        {/* Global Animated Background */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[120px] animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-secondary/20 blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[150px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
        <main className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/report" element={<ReportIssue />} />
              <Route path="/map" element={<LiveMap />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/heroes" element={<Leaderboard />} />
              <Route path="/issue/:id" element={<IssueDetail />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </AnimatePresence>
        </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
