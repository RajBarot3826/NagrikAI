import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Map as MapIcon, Crosshair, ListFilter } from 'lucide-react';
import { getIssues } from '../utils/api';
import IssueCard from '../components/IssueCard';
import CategoryIcon from '../components/CategoryIcon';
import HeatmapLayer from '../components/HeatmapLayer';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getCustomIcon = (issue) => {
  const color = issue.severity >= 4 ? '#EF4444' : issue.severity === 3 ? '#F59E0B' : '#9AB17A'; // Updated to Teal for success/low sev
  
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #FBE8CE; box-shadow: 0 0 15px ${color}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; transition: transform 0.3s; cursor: pointer;">${issue.severity}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

export default function LiveMap() {
  const [activeIssue, setActiveIssue] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [liveIssues, setLiveIssues] = useState([]);
  const bhavnagarCenter = [21.7645, 72.1519];

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await getIssues();
        setLiveIssues(data);
      } catch (err) {
        console.error("Failed to fetch issues", err);
      }
    };
    fetchIssues();
  }, []);

  const heatmapPoints = liveIssues.map(issue => [
    issue.latitude, 
    issue.longitude, 
    issue.severity / 5 
  ]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex overflow-hidden relative"
    >
      {/* Full Screen Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={bhavnagarCenter} 
          zoom={14} 
          className="w-full h-full"
          zoomControl={false}
        >
          {/* Extremely dark map theme */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          <TileLayer
             url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
             opacity={0.6}
          />

          {!showHeatmap && liveIssues.map(issue => (
            <Marker 
              key={issue.id} 
              position={[issue.latitude, issue.longitude]}
              icon={getCustomIcon(issue)}
              eventHandlers={{
                click: () => setActiveIssue(issue),
              }}
            />
          ))}

          {showHeatmap && (
            <HeatmapLayer points={heatmapPoints} />
          )}
        </MapContainer>
      </div>

      {/* Floating Glass Sidebar (Left) */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        className="absolute top-6 left-6 bottom-6 w-[420px] rounded-2xl glass-card flex flex-col z-[400] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border border-primary/20"
      >
        <div className="p-6 border-b border-border/50 bg-surface/80 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display font-bold text-2xl flex items-center gap-3 text-textPrimary drop-shadow-md">
              <div className="p-2 bg-primary/20 rounded-lg text-primary"><MapIcon size={24} /></div>
              Command Radar
            </h2>
            <button 
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`p-2 rounded-lg transition-all ${showHeatmap ? 'bg-primary text-background shadow-[0_0_15px_rgba(154,177,122,0.5)]' : 'bg-surface border border-border text-textSecondary hover:text-primary'}`}
              title="Toggle Heatmap"
            >
              <Layers size={20} />
            </button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['All Zones', 'Critical', 'Potholes', 'Drainage', 'Lights'].map(filter => (
              <button key={filter} className="px-4 py-2 rounded-xl text-sm font-semibold border border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors whitespace-nowrap text-textSecondary hover:text-textPrimary">
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {liveIssues.map((issue, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={issue.id}
            >
              <IssueCard 
                issue={issue} 
                onClick={(i) => setActiveIssue(i)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Map Controls Floating (Right) */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-6 right-6 z-[400] flex flex-col gap-3"
      >
        <button className="p-4 bg-surface/80 backdrop-blur-xl border border-primary/20 rounded-xl text-textPrimary hover:text-primary transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:scale-110">
          <Crosshair size={24} />
        </button>
        <button className="p-4 bg-surface/80 backdrop-blur-xl border border-primary/20 rounded-xl text-textPrimary hover:text-primary transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:scale-110">
          <ListFilter size={24} />
        </button>
      </motion.div>

      {/* Floating Issue Detail Panel (Right) */}
      <AnimatePresence>
        {activeIssue && (
          <motion.div 
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-6 right-24 bottom-6 w-[450px] rounded-2xl glass-card flex flex-col z-[500] shadow-[0_0_50px_rgba(0,0,0,0.6)] overflow-hidden border border-primary/30"
          >
            <div className="relative h-64 overflow-hidden">
              <motion.img 
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                src={activeIssue.image_url} 
                className="w-full h-full object-cover" 
                alt={activeIssue.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
              
              <button 
                onClick={() => setActiveIssue(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/50 backdrop-blur-md flex items-center justify-center text-textPrimary hover:bg-primary hover:text-background transition-colors border border-white/10"
              >
                ✕
              </button>
              
              <div className="absolute bottom-6 left-6 flex gap-3">
                 <span className="px-3 py-1.5 rounded-lg glass-card text-xs font-bold text-textPrimary uppercase flex items-center gap-2 border border-primary/50 shadow-[0_0_15px_rgba(154,177,122,0.3)]">
                   <CategoryIcon category={activeIssue.category} size={16} /> {activeIssue.category}
                 </span>
                 <span className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white uppercase flex items-center gap-2 ${activeIssue.severity >= 4 ? 'bg-danger' : activeIssue.severity === 3 ? 'bg-warning' : 'bg-primary'}`}>
                   Level {activeIssue.severity}
                 </span>
              </div>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto">
              <h2 className="font-display font-bold text-2xl mb-3 leading-tight">{activeIssue.title}</h2>
              <p className="text-primary text-sm mb-6 font-mono flex items-center gap-2">
                <MapPin size={16} /> {activeIssue.address}
              </p>
              
              <div className="rounded-xl bg-surface/50 border border-primary/20 p-5 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary shadow-[0_0_10px_rgba(154,177,122,1)]"></div>
                <h3 className="text-sm font-semibold mb-3 text-textPrimary flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                  Gemini AI Analysis
                </h3>
                <p className="text-sm text-textSecondary leading-relaxed">
                  High severity anomaly detected. Structure integrity compromised. Recommend immediate dispatch of <strong className="text-primary">{activeIssue.department}</strong> units.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="col-span-2 btn-primary py-4 text-lg">Deploy Units (Admin)</button>
                <button className="col-span-1 btn-secondary py-3">Upvote ({activeIssue.upvotes})</button>
                <button className="col-span-1 btn-secondary py-3">Share</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
