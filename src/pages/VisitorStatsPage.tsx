import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { flag } from 'country-emoji';

type Stats = { [country: string]: number };

export default function VisitorStatsPage() {
  const [stats, setStats] = useState<Stats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data: Stats) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const countries = Object.entries(stats).sort((a, b) => b[1] - a[1]);
  const maxCount = countries.length > 0 ? countries[0][1] : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-12 md:py-24 max-w-3xl mx-auto"
    >
      <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 group">
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>
      
      <header className="mb-12">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
          Visitor Demographics
        </h1>
        <p className="text-lg text-slate-600">
          A permanent record of website visitors aggregated by nationality.
        </p>
      </header>

      {loading ? (
        <div className="text-slate-500 italic">Loading records...</div>
      ) : countries.length === 0 ? (
        <div className="text-slate-500">No visitors recorded yet.</div>
      ) : (
        <div className="space-y-4">
          {countries.map(([country, count], index) => {
            const widthPercentage = Math.max((count / maxCount) * 100, 1);
            return (
              <motion.div 
                key={country}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center space-x-4"
              >
                <div className="w-28 flex items-center justify-end space-x-2 shrink-0">
                  <span className="text-sm font-medium text-slate-700 text-right truncate w-full" title={country}>
                    {country}
                  </span>
                  <span className="text-xl leading-none">{flag(country) || '🌐'}</span>
                </div>
                <div className="flex-grow h-8 bg-slate-100 rounded-r-md flex items-center">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercentage}%` }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.05 }}
                    className="h-full bg-blue-500 rounded-r-md flex items-center justify-end px-3 min-w-[2rem]"
                  >
                    <span className="text-white font-bold text-xs">{count}</span>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
