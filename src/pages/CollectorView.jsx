import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, ChevronRight, Navigation, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import Countdown from '../components/Countdown';
import { useFoodRescue } from '../context/FoodRescueContext';
import { calculateDistance } from '../utils/distance';

const CollectorView = () => {
  const { listings, claimListing, userLocation } = useFoodRescue();
  const [filter, setFilter] = useState('All');
  const [claimedIds, setClaimedIds] = useState([]);
  const [routeApplied, setRouteApplied] = useState(false);

  // Filter listings by claims and 5km radius
  let activeListings = listings.filter(l => !claimedIds.includes(l.id));
  
  if (userLocation) {
    activeListings = activeListings.filter(l => calculateDistance(userLocation[0], userLocation[1], l.position[0], l.position[1]) <= 5);
  }
  
  if (filter === 'Urgent') {
    activeListings = activeListings.filter(l => l.urgency === 'critical' || l.urgency === 'high');
  }

  const handleClaim = (id) => {
    claimListing(id);
    setClaimedIds(prev => [...prev, id]);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#0D2B1F]" style={{ fontFamily: 'Space Grotesk' }}>Available Now</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter(filter === 'Urgent' ? 'All' : 'Urgent')}
              className={`px-4 py-2 rounded-full text-xs font-bold shadow-sm transition-colors ${filter === 'Urgent' ? 'bg-[#1A9E6E] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            >
              Urgent
            </button>
            <button className="px-4 py-2 bg-white text-gray-500 rounded-full text-xs font-bold shadow-sm hover:bg-gray-50">Near Me</button>
          </div>
        </div>
        
        <div className="space-y-6">
          <AnimatePresence>
            {activeListings.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-gray-400">
                <p>No active listings found in this area.</p>
              </motion.div>
            )}
            {activeListings.map(l => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0, overflow: 'hidden' }}
                whileHover={{ y: -5 }}
                key={l.id} 
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-6"
              >
                <div className="w-32 h-32 rounded-2xl bg-gray-100 flex-shrink-0 overflow-hidden relative">
                  <img src={`https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=200&h=200&fit=crop`} className="w-full h-full object-cover" alt="food" />
                  {l.urgency === 'critical' && <div className="absolute top-2 left-2 bg-[#E8523A] text-white text-[10px] font-bold px-2 py-1 rounded-md animate-pulse">CRITICAL</div>}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-bold text-lg text-[#0D2B1F]">{l.name}</h3>
                      <div className="flex items-center gap-2 text-[#E8523A]">
                        <Clock size={16} />
                        <Countdown minutes={l.time} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin size={14} /> {l.donor} · {userLocation ? calculateDistance(userLocation[0], userLocation[1], l.position[0], l.position[1]).toFixed(1) + 'km' : l.dist}
                    </p>
                    <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
                      <span className="text-[10px] px-2 py-1 bg-gray-50 rounded font-bold text-gray-500 uppercase whitespace-nowrap">{l.qty}</span>
                      {l.tags.map(t => <span key={t} className="text-[10px] px-2 py-1 bg-[#1A9E6E]/10 rounded font-bold text-[#1A9E6E] uppercase whitespace-nowrap">{t}</span>)}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => handleClaim(l.id)} className="flex-1 py-2 text-sm">Claim Rescue</Button>
                    <Button variant="outline" className="p-2 flex-shrink-0"><ChevronRight size={18} /></Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-[#0D2B1F] text-white p-6 rounded-3xl transition-all">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Navigation size={18} className="text-[#1A9E6E]" /> Route Optimizer</h3>
          
          {routeApplied ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="py-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#1A9E6E]/20 rounded-full flex items-center justify-center mb-4 text-[#1A9E6E]">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="font-bold text-lg">Route Synced!</h4>
                <p className="text-sm opacity-60 mt-2">Sent to your mobile app.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-sm opacity-60 mb-6">We found {Math.min(3, activeListings.length)} listings on your way. Picking up all would save 8 mins of driving.</p>
              <div className="space-y-4 mb-6">
                {activeListings.slice(0, 2).map((l, idx) => (
                  <div key={l.id} className={`flex gap-3 items-center border-l-2 pl-4 ${idx === 0 ? 'border-[#1A9E6E]' : 'border-white/20'}`}>
                    <div className={`text-xs font-bold ${idx !== 0 && 'opacity-60'}`}>{idx + 1}. {l.donor}</div>
                  </div>
                ))}
                <div className="flex gap-3 items-center border-l-2 border-white/20 pl-4">
                  <div className="text-xs font-bold opacity-60">{Math.min(3, activeListings.length)}. Drop off at Food Bank</div>
                </div>
              </div>
              <Button onClick={() => setRouteApplied(true)} variant="primary" className="w-full">Apply Route</Button>
            </motion.div>
          )}
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4">My Team (NGO View)</h3>
          <div className="space-y-4">
            {[
              { name: "Sarah K.", status: "Picking up...", color: "bg-blue-500" },
              { name: "John Doe", status: "Idle", color: "bg-gray-300" },
              { name: "Emma R.", status: "In transit", color: "bg-green-500" },
            ].map((v, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${v.color}`} />
                  <span className="text-sm font-bold">{v.name}</span>
                </div>
                <span className="text-[10px] text-gray-400">{v.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectorView;
