import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, MapPin, ShieldCheck, Zap, TrendingUp, Users, BarChart3, Award, CheckCircle2, Truck } from 'lucide-react';
import Logo from '../components/Logo';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import { useFoodRescue } from '../context/FoodRescueContext';

  const LandingPage = ({ setPage }) => {
    const { listings, currentUser, openAuth, switchRole } = useFoodRescue();

    const handlePostClick = () => {
      if (!currentUser) {
        openAuth();
      } else {
        switchRole('donor');
        setPage('dashboard');
      }
    };

    return (
      <div className="min-h-screen bg-[#F5F0E8]">
        {/* Hero */}
        <section className="relative overflow-hidden pt-20 pb-32 px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }}
              className="z-10"
            >
              <h1 className="text-6xl lg:text-7xl font-extrabold text-[#0D2B1F] leading-[1.1] mb-6" style={{ fontFamily: 'Space Grotesk' }}>
                Food rescued.<br />
                <span className="text-[#1A9E6E]">Waste eliminated.</span><br />
                Community fed.
              </h1>
              <p className="text-xl text-[#1A1A1A]/70 mb-8 max-w-lg leading-relaxed">
                Connecting restaurants and households with local collectors to rescue surplus food in real-time. Join the movement to end urban food waste.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button onClick={handlePostClick}>Post a Listing</Button>
                <Button variant="outline" onClick={() => setPage('map')}>Find Food Near Me</Button>
              </div>
            </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-[500px] bg-white rounded-3xl shadow-2xl border-8 border-white overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[#e0e0e0] opacity-20" style={{ backgroundImage: 'radial-gradient(#1A9E6E 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full p-4">
                {listings.map((l, i) => (
                  <motion.div
                    key={l.id}
                    animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    className="absolute p-3 bg-white shadow-lg rounded-xl border border-[#1A9E6E]/20 flex items-center gap-3 cursor-pointer hover:border-[#1A9E6E]"
                    style={{ left: `${l.coords.x}%`, top: `${l.coords.y}%` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[#1A9E6E] animate-ping" />
                    <div>
                      <p className="text-xs font-bold text-[#0D2B1F]">{l.name}</p>
                      <p className="text-[10px] text-gray-500">{l.dist} away</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 bg-[#0D2B1F] text-white p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs opacity-70">Real-time Activity</p>
                <p className="font-bold">42 Rescues in the last hour</p>
              </div>
              <Zap className="text-yellow-400 fill-current" size={20} />
            </div>
          </motion.div>
        </div>
      </section>

    {/* Stats Bar */}
    <div className="bg-[#1A9E6E] py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between gap-8 text-white">
        <div className="text-center">
          <p className="text-3xl font-bold">12,400 kg</p>
          <p className="text-sm opacity-80">rescued this month</p>
        </div>
        <div className="w-px h-12 bg-white/20 hidden md:block" />
        <div className="text-center">
          <p className="text-3xl font-bold">340</p>
          <p className="text-sm opacity-80">active donors</p>
        </div>
        <div className="w-px h-12 bg-white/20 hidden md:block" />
        <div className="text-center">
          <p className="text-3xl font-bold">60-min</p>
          <p className="text-sm opacity-80">rescue window</p>
        </div>
        <div className="w-px h-12 bg-white/20 hidden md:block" />
        <div className="text-center">
          <p className="text-3xl font-bold">18,500</p>
          <p className="text-sm opacity-80">meals distributed</p>
        </div>
      </div>
    </div>

    {/* How it works */}
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-[#0D2B1F] mb-4" style={{ fontFamily: 'Space Grotesk' }}>Three Taps to Impact</h2>
        <p className="text-gray-500 max-w-xl mx-auto">Our streamlined process ensures food goes from plate to person before it hits the bin.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { step: "01", title: "Donor posts surplus", desc: "Restaurants or households snap a photo and set an expiry time.", icon: Leaf },
          { step: "02", title: "Collectors see it", desc: "Local NGOs and volunteers get instant pings based on location.", icon: MapPin },
          { step: "03", title: "Food claimed", desc: "Real-time coordination ensures pickup happens in minutes.", icon: ShieldCheck },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-10 rounded-3xl relative overflow-hidden group hover:shadow-xl transition-all">
            <span className="text-7xl font-black text-[#1A9E6E]/5 absolute -top-2 -right-2 leading-none">{item.step}</span>
            <div className="w-16 h-16 bg-[#F5F0E8] rounded-2xl flex items-center justify-center text-[#1A9E6E] mb-6 group-hover:bg-[#1A9E6E] group-hover:text-white transition-colors">
              <item.icon size={32} />
            </div>
            <h3 className="text-2xl font-bold text-[#0D2B1F] mb-3">{item.title}</h3>
            <p className="text-gray-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Dual-Persona Section */}
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-[#0D2B1F] mb-4" style={{ fontFamily: 'Space Grotesk' }}>Two Roles. One Mission.</h2>
        <p className="text-gray-500 max-w-xl mx-auto">Whether you're sharing surplus or rescuing it, we have powerful tools designed specifically for you.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Donor Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-[2rem] p-10 shadow-sm border border-[#1A9E6E]/10 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1A9E6E]/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-[#1A9E6E]/10" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-[#1A9E6E]/10 rounded-2xl flex items-center justify-center text-[#1A9E6E] mb-8">
              <Leaf size={32} />
            </div>
            <h3 className="text-3xl font-bold text-[#0D2B1F] mb-3" style={{ fontFamily: 'Space Grotesk' }}>For Food Donors</h3>
            <p className="text-gray-500 mb-8 border-b border-gray-100 pb-8 text-lg">Restaurants, bakeries, farms, and households. Turn your surplus food into instant social impact.</p>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#1A9E6E] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
                <span className="text-[#0D2B1F] font-medium">Post excess food in under 30 seconds.</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#1A9E6E] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
                <span className="text-[#0D2B1F] font-medium">Smart matching algorithms ping the closest NGOs instantly.</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#1A9E6E] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
                <span className="text-[#0D2B1F] font-medium">Earn automated Impact Scores for tax or sustainability reports.</span>
              </li>
            </ul>

            <Button 
              className="w-full py-4 text-lg bg-[#0D2B1F] text-white hover:bg-[#0D2B1F]/90"
              onClick={() => { openAuth('donor'); }}
            >
              Become a Donor
            </Button>
          </div>
        </motion.div>

        {/* Collector Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-[#0D2B1F] rounded-[2rem] p-10 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1A9E6E]/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-[#1A9E6E]/20" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-[#1A9E6E]/20 rounded-2xl flex items-center justify-center text-[#1A9E6E] mb-8">
              <Truck size={32} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>For Collectors</h3>
            <p className="text-white/60 mb-8 border-b border-white/10 pb-8 text-lg">NGOs, shelters, community fridges, and volunteers. Secure high-quality food seamlessly.</p>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#1A9E6E] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
                <span className="text-white font-medium">Live geographic radar feed of available surplus near you.</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#1A9E6E] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
                <span className="text-white font-medium">One-tap "Claim" system secures the pickup instantly.</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#1A9E6E] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
                <span className="text-white font-medium">Built-in AI Route Optimizer calculates fastest driving paths.</span>
              </li>
            </ul>

            <Button 
              className="w-full py-4 text-lg shadow-xl"
              onClick={() => { openAuth('collector'); }}
            >
              Become a Collector
            </Button>
          </div>
        </motion.div>

      </div>
    </section>

    {/* Impact Counter */}
    <section className="py-24 bg-[#0D2B1F] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 p-20 opacity-10">
        <Leaf size={400} className="fill-current" />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-8" style={{ fontFamily: 'Space Grotesk' }}>Unlike static lists, we use real-time geospatial coordination.</h2>
          <p className="text-white/60 mb-8 text-lg">Every minute matters. Our engine calculates the optimal route and matching algorithm to ensure 98% of posted food is successfully claimed.</p>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 bg-[#1A9E6E] rounded-full flex items-center justify-center mt-1">
                <CheckCircle2 size={14} />
              </div>
              <div>
                <h4 className="font-bold">Dynamic Expiry Tracking</h4>
                <p className="text-sm opacity-60">Visual countdowns create urgency for collectors.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 bg-[#1A9E6E] rounded-full flex items-center justify-center mt-1">
                <CheckCircle2 size={14} />
              </div>
              <div>
                <h4 className="font-bold">Automated Routing</h4>
                <p className="text-sm opacity-60">Save fuel and time with smart pickup batching.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4 pt-12">
            <StatCard label="Food Saved" value="1.2M kg" icon={TrendingUp} />
            <StatCard label="Communities" value="84" icon={Users} />
          </div>
          <div className="space-y-4">
            <StatCard label="CO2 Avoided" value="2.4k t" icon={BarChart3} />
            <StatCard label="Active NGOs" value="156" icon={Award} />
          </div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-[#0D2B1F] border-t border-white/10 py-16 px-6 text-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <Logo light />
          <p className="mt-6 text-white/50 max-w-sm">A collaborative platform by Team NOX for Hack-A-Geek. Rescuing surplus, feeding communities.</p>
        </div>
        <div>
          <h4 className="font-bold mb-6">Platform</h4>
          <ul className="space-y-4 text-white/50 text-sm">
            <li className="hover:text-[#1A9E6E] cursor-pointer">Interactive Map</li>
            <li className="hover:text-[#1A9E6E] cursor-pointer">Donor Dashboard</li>
            <li className="hover:text-[#1A9E6E] cursor-pointer">NGO Portal</li>
            <li className="hover:text-[#1A9E6E] cursor-pointer">PWA Mobile App</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Connect</h4>
          <ul className="space-y-4 text-white/50 text-sm">
            <li className="hover:text-[#1A9E6E] cursor-pointer">Support Center</li>
            <li className="hover:text-[#1A9E6E] cursor-pointer">Partner With Us</li>
            <li className="hover:text-[#1A9E6E] cursor-pointer">Impact Reports</li>
            <li className="hover:text-[#1A9E6E] cursor-pointer">Privacy Policy</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex justify-between items-center text-xs text-white/30">
        <span>© 2024 Team NOX · Hack-A-Geek Finalist</span>
        <div className="flex gap-4">
          <span>Twitter</span>
          <span>Instagram</span>
          <span>LinkedIn</span>
        </div>
      </div>
    </footer>
  </div>
  );
};

export default LandingPage;
