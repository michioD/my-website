import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Globe } from 'lucide-react';

type Stats = { [country: string]: number };

export function VisitorStats() {
  const [stats, setStats] = useState<Stats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/stats')
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
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200 shadow-sm">
      <div className="flex items-center space-x-2 text-slate-900 font-semibold mb-2">
        <Globe size={14} className="text-blue-500" />
        <span className="text-xs">Recent Visitors</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {countries.map(([country, count]) => (
          <motion.div
            key={country}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-2 py-0.5 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-medium text-slate-600 flex items-center space-x-1.5 shadow-sm"
          >
            <span>{country}</span>
            <span className="bg-blue-100 text-blue-700 px-1 rounded-full font-bold">
              {count}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
