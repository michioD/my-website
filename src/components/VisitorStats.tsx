import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { flag } from 'country-emoji';

type Stats = { [country: string]: number };

export function VisitorStats() {
  const [stats, setStats] = useState<Stats>({});
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data: Stats) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching visitor stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-slate-400 text-sm italic">Loading visitor data...</div>;
  }

  const countries = Object.entries(stats).sort((a, b) => b[1] - a[1]);
  if (countries.length === 0) {
      return (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-500 font-semibold">
          <Globe size={14} />
          <span className="text-xs">Awaiting first visitor...</span>
          </div>
          </div>
      );
  }


  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200 shadow-sm">
      <div 
        className="flex items-center justify-between text-slate-900 font-semibold cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <Globe size={14} className="text-blue-500" />
          <span className="text-xs">Recent Visitors</span>
        </div>
        <div className="text-slate-400 hover:text-slate-600 transition-colors">
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="flex flex-wrap gap-1.5 overflow-hidden"
          >
            {countries.map(([country, count]) => (
              <motion.div
                key={country}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-2 py-0.5 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-medium text-slate-600 flex items-center space-x-1.5 shadow-sm"
              >
                <span className="flex items-center gap-1">
                  <span>{flag(country) || '🌐'}</span>
                  <span>{country}</span>
                </span>
                <span className="bg-blue-100 text-blue-700 px-1 rounded-full font-bold">
                  {count}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
