import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Train, Clock, CheckCircle2, Activity, Search } from 'lucide-react';

interface RouteStatus {
  route_id: string;
  name: string;
  color: string;
  predicted_delay_seconds: number;
  status: string;
}

export default function SLMetro() {
  const [routes, setRoutes] = useState<RouteStatus[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAllPredictions = async () => {
    try {
      const response = await fetch('https://metro.michiod.site/status');
      if (response.ok) {
        const data = await response.json();
        setRoutes(data.routes);
        setLastUpdated(new Date());
        setError('');
      } else {
        throw new Error('Failed to fetch from prediction server.');
      }
    } catch (err: any) {
      setError('Failed to connect to the prediction server. Ensure the FastAPI backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPredictions();
    // Real-time update every 10 seconds
    const interval = setInterval(fetchAllPredictions, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredRoutes = routes.filter(route => 
    route.route_id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    route.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-slate-900 text-white rounded-xl shadow-sm">
                <Activity size={28} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Live SL Network Status
              </h1>
            </div>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              Real-time delay predictions across the entire Stockholm transit network, updated automatically every 10 seconds.
            </p>
          </div>
          
          <div className="flex flex-col items-end">
            {lastUpdated && (
              <span className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search lines (e.g. 17, 40)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-64 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>
        </motion.div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl font-medium border border-red-100">
            {error}
          </div>
        )}

        {loading && routes.length === 0 ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence>
              {filteredRoutes.map((route) => {
                const isDelayed = route.status === 'delayed';

                return (
                  <motion.div
                    key={route.route_id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-slate-300 transition-all group"
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${route.color} ring-4 ring-slate-50 group-hover:ring-${route.color}/10 transition-all`} />
                          <h2 className="text-lg font-bold text-slate-900 tracking-tight">{route.name}</h2>
                        </div>
                        <Train size={16} className="text-slate-300" />
                      </div>

                      <div className={`p-3 rounded-lg flex items-center space-x-3 transition-colors ${
                        isDelayed 
                          ? 'bg-orange-50/50 group-hover:bg-orange-50' 
                          : 'bg-emerald-50/50 group-hover:bg-emerald-50'
                      }`}>
                        {isDelayed ? <Clock size={18} className="text-orange-500 shrink-0"/> : <CheckCircle2 size={18} className="text-emerald-500 shrink-0"/>}
                        <div>
                          <p className={`text-xs font-bold uppercase tracking-wider ${
                            isDelayed ? 'text-orange-900' : 'text-emerald-900'
                          }`}>
                            {isDelayed ? 'Delayed' : 'On Time'}
                          </p>
                          <p className={`text-sm font-medium ${isDelayed ? 'text-orange-700' : 'text-emerald-700'}`}>
                            {route.predicted_delay_seconds}s avg
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {filteredRoutes.length === 0 && !error && (
              <div className="col-span-full py-12 text-center text-slate-500">
                No routes found matching "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
