import React, { useState } from 'react';
import { Plus, Clock, Leaf, TrendingUp, Award, Zap, X } from 'lucide-react';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import { useFoodRescue } from '../context/FoodRescueContext';

const DonorDashboard = () => {
  const { listings, history, impactStats, addListing, currentUser } = useFoodRescue();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New listing state
  const [formData, setFormData] = useState({ name: '', qty: '', time: 60, tag: 'Veg', urgency: 'low' });

  const handlePost = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.qty) return;
    
    addListing({
      name: formData.name,
      qty: formData.qty,
      time: Number(formData.time),
      tags: [formData.tag],
      urgency: formData.urgency
    });
    
    setIsModalOpen(false);
    setFormData({ name: '', qty: '', time: 60, tag: 'Veg', urgency: 'low' });
  };

  // Calculate active listings dynamically
  const activeCount = listings.filter(l => l.donor === currentUser?.name).length;
  const filteredHistory = history.filter(h => h.donor === currentUser?.name);

  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#0D2B1F]" style={{ fontFamily: 'Space Grotesk' }}>Welcome back, {currentUser?.name}</h1>
          <p className="text-gray-500">Your impact is growing. {impactStats.kgRescued}kg rescued total!</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}><Plus size={20} /> Post New Listing</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard label="Active Listings" value={activeCount} icon={Clock} />
        <StatCard label="Total Donated" value={impactStats.totalDonated} sub="+1 this wk" icon={Leaf} />
        <StatCard label="kg Rescued" value={impactStats.kgRescued} icon={TrendingUp} />
        <StatCard label="Impact Score" value={impactStats.impactScore} icon={Award} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Clock size={20} className="text-[#1A9E6E]" /> Recent History</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-50">
                  <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Listing</th>
                  <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Qty</th>
                  <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredHistory.map((row, i) => (
                  <tr key={i} className="group">
                    <td className="py-4">
                      <p className="font-bold text-sm text-[#0D2B1F]">{row.name}</p>
                      <p className="text-xs text-gray-400">{row.date}</p>
                    </td>
                    <td className="py-4 text-sm text-gray-600">{row.qty}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                        row.status === 'Claimed' ? 'bg-blue-100 text-blue-600' :
                        row.status === 'Completed' ? 'bg-[#1A9E6E]/10 text-[#1A9E6E]' :
                        row.status === 'Active' ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-sm text-[#1A9E6E]">{row.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6">Achievement Badges</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { icon: Leaf, label: "Eco Pioneer", color: "text-green-500" },
                { icon: Zap, label: "Fast Rescuer", color: "text-yellow-500" },
                { icon: Award, label: "100kg Club", color: "text-purple-500" },
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center ${b.color}`}>
                    <b.icon size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 leading-tight">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[#0D2B1F] rounded-3xl p-8 shadow-sm text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Sustainable Score</h3>
              <p className="text-sm opacity-60 mb-6">You're in the top 5% of local bakers!</p>
              <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                <div className="bg-[#1A9E6E] h-full w-[94%]" />
              </div>
              <div className="flex justify-between mt-2 text-xs font-bold">
                <span>{impactStats.impactScore} / 100</span>
                <span className="text-[#1A9E6E]">Level 12</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Listing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0D2B1F]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-800">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-[#0D2B1F] mb-6" style={{ fontFamily: 'Space Grotesk' }}>Post Surplus Food</h2>
            <form onSubmit={handlePost} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Food Description</label>
                <input required type="text" placeholder="E.g., 2 Trays of Sandwiches" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A9E6E] focus:outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Estimated Quantity</label>
                <input required type="text" placeholder="E.g., 5kg or 10 portions" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A9E6E] focus:outline-none" value={formData.qty} onChange={e => setFormData({...formData, qty: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Expiry (mins)</label>
                  <input required type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A9E6E] focus:outline-none" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Urgency</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A9E6E] focus:outline-none" value={formData.urgency} onChange={e => setFormData({...formData, urgency: e.target.value})}>
                    <option value="low">Low</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Dietary Tag</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A9E6E] focus:outline-none" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})}>
                  <option value="Veg">Vegetarian</option>
                  <option value="Non-Veg">Non-Vegetarian</option>
                  <option value="GF">Gluten Free</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>
              <Button type="submit" className="w-full mt-6 py-4 text-lg hidden md:flex">Publish Listing</Button>
              <Button type="submit" className="w-full mt-6 py-3 md:hidden">Publish Listing</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;

