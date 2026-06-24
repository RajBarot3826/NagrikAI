import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import CategoryIcon from '../components/CategoryIcon';
import SeverityBadge from '../components/SeverityBadge';
import { Clock, MapPin, ThumbsUp, CheckCircle, Share2, MessageSquare, Globe, Loader } from 'lucide-react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { useState, useEffect } from 'react';
import { getIssue } from '../utils/api';

export default function IssueDetail() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [lang, setLang] = useState('EN');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const data = await getIssue(id);
        setIssue(data);
      } catch (e) {
        console.error("Failed to fetch issue", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  const getTranslatedAnalysis = (text, targetLang) => {
    if (targetLang === 'HI') return "हाल की बारिश के कारण एक बड़ा गड्ढा बन गया है। यह बाईं लेन में फैला है, जिससे दोपहिया वाहनों के लिए गंभीर खतरा है। तत्काल मरम्मत की आवश्यकता है।";
    if (targetLang === 'GU') return "તાજેતરના વરસાદને કારણે એક મોટો ખાડો પડ્યો છે. તે ડાબી લેનમાં ફેલાયેલો છે, જે દ્વિચક્રી વાહનો માટે ગંભીર ખતરો ઊભો કરે છે. તાત્કાલિક સમારકામની જરૂર છે.";
    return text || "A massive pothole has formed likely due to recent rains. It spans across the left lane, posing a critical danger to two-wheelers. Immediate patching required.";
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <Loader className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (!issue) {
    return <div className="text-center text-white mt-20">Issue not found.</div>;
  }

  const aiAnalysisText = issue.description || "A massive pothole has formed likely due to recent rains. It spans across the left lane, posing a critical danger to two-wheelers. Immediate patching required.";


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 md:p-8 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card overflow-hidden">
          <div className="relative h-64 md:h-96">
            {issue.status === 'RESOLVED' ? (
              <BeforeAfterSlider 
                beforeImage={issue.image_url} 
                afterImage={"https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600"} 
              />
            ) : (
              <img src={issue.image_url} alt={issue.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute top-4 right-4 flex gap-2">
              <span className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur text-sm font-bold text-white flex items-center gap-2 shadow-lg">
                <CategoryIcon category={issue.category} size={16} /> {issue.category}
              </span>
              <SeverityBadge severity={issue.severity} />
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-3xl font-display font-bold text-white drop-shadow-lg mb-2">{issue.title}</h1>
              <div className="flex gap-4 text-white/90 text-sm drop-shadow">
                <span className="flex items-center gap-1"><MapPin size={16} /> {issue.address}</span>
                <span className="flex items-center gap-1"><Clock size={16} /> {issue.reported_at}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-5 mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full filter blur-[40px]"></div>
              <div className="flex justify-between items-start mb-2 relative z-10">
                <h3 className="font-display font-semibold flex items-center gap-2">
                  <span className="text-secondary">✨</span> AI Analysis
                </h3>
                <div className="flex bg-surface rounded border border-border overflow-hidden">
                  <button onClick={() => setLang('EN')} className={`px-2 py-1 text-xs font-medium ${lang==='EN' ? 'bg-primary text-white' : 'text-textSecondary hover:bg-white/5'}`}>EN</button>
                  <button onClick={() => setLang('HI')} className={`px-2 py-1 text-xs font-medium border-l border-border ${lang==='HI' ? 'bg-primary text-white' : 'text-textSecondary hover:bg-white/5'}`}>HI</button>
                  <button onClick={() => setLang('GU')} className={`px-2 py-1 text-xs font-medium border-l border-border ${lang==='GU' ? 'bg-primary text-white' : 'text-textSecondary hover:bg-white/5'}`}>GU</button>
                </div>
              </div>
              <p className="text-textPrimary leading-relaxed text-sm relative z-10">
                {getTranslatedAnalysis(aiAnalysisText, lang)}
              </p>
              <div className="flex gap-2 mt-4 relative z-10">
                <span className="text-xs px-2 py-1 bg-surface border border-border rounded text-textSecondary">road damage</span>
                <span className="text-xs px-2 py-1 bg-surface border border-border rounded text-textSecondary">urgent</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-border">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors font-medium border border-primary/30">
                  <ThumbsUp size={18} /> Upvote ({issue.upvotes})
                </button>
                <button className="flex items-center gap-2 text-success hover:bg-success/10 px-4 py-2 rounded-lg transition-colors font-medium border border-success/30">
                  <CheckCircle size={18} /> Verify Match
                </button>
              </div>
              <button className="p-2 text-textSecondary hover:text-white transition-colors">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="glass-card p-6">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <MessageSquare size={20} /> Community Updates
          </h3>
          
          <div className="flex gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex flex-shrink-0 items-center justify-center text-primary font-bold">You</div>
            <div className="flex-1">
              <input type="text" placeholder="Add an update or comment..." className="w-full bg-surface border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-surface flex flex-shrink-0 items-center justify-center text-textSecondary text-xs">RD</div>
              <div className="bg-surface p-3 rounded-lg border border-border text-sm flex-1">
                <p className="font-semibold text-primary mb-1">Rahul Desai <span className="text-textSecondary font-normal ml-2">5 hours ago</span></p>
                <p>I almost fell here last night. It's really dangerous because there is no street light nearby either.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-6">
          <h3 className="font-display font-bold text-lg mb-4">Status Tracking</h3>
          
          <div className="relative pl-6 space-y-6">
            <div className="absolute top-2 bottom-2 left-[11px] w-[2px] bg-border"></div>
            
            <div className="relative">
              <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-background"></div>
              <p className="font-semibold text-primary">Reported</p>
              <p className="text-xs text-textSecondary">By Community Hero • {issue.reported_at}</p>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-warning ring-4 ring-background"></div>
              <p className="font-semibold text-warning">Assigned to Dept</p>
              <p className="text-xs text-textSecondary">Routed by AI • {issue.department}</p>
              <div className="mt-2 bg-surface border border-border p-3 rounded text-sm">
                <p className="text-textSecondary mb-1">Target SLA</p>
                <p className="font-mono text-danger font-semibold">48 Hours</p>
              </div>
            </div>
            
            <div className={`relative ${issue.status !== 'RESOLVED' ? 'opacity-50' : ''}`}>
              <div className={`absolute -left-[29px] top-1 w-4 h-4 rounded-full border-2 ring-4 ring-background ${issue.status === 'RESOLVED' ? 'bg-success border-success' : 'bg-surface border-border'}`}></div>
              <p className={`font-semibold ${issue.status === 'RESOLVED' ? 'text-success' : ''}`}>Resolved</p>
              <p className="text-xs text-textSecondary">{issue.status === 'RESOLVED' ? 'Issue has been fixed' : 'Pending action'}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
           <h3 className="font-display font-bold text-lg mb-4">Location</h3>
           <div className="w-full h-48 bg-surface rounded-lg border border-border overflow-hidden relative flex items-center justify-center">
             <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#1E2A3B 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
             <MapPin size={32} className="text-danger" />
             <p className="absolute bottom-2 text-xs font-mono text-textSecondary">{issue.latitude}, {issue.longitude}</p>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
