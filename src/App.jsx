import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Leaf, Truck } from 'lucide-react';
import Logo from './components/Logo';
import Button from './components/Button';
import LandingPage from './pages/LandingPage';
import InteractiveMap from './pages/InteractiveMap';
import DonorDashboard from './pages/DonorDashboard';
import CollectorView from './pages/CollectorView';
import MobilePWA from './pages/MobilePWA';
import AuthModal from './components/AuthModal';

import { FoodRescueProvider, useFoodRescue } from './context/FoodRescueContext';

function AppContent() {
  const [page, setPage] = useState('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, openAuth, switchRole, logout } = useFoodRescue();

  const handleNavClick = (p) => {
    setPage(p.toLowerCase());
    setMobileMenuOpen(false);
  };

  const renderPage = () => {
    if (page === 'map') return <InteractiveMap />;
    if (page === 'pwa') return <MobilePWA />;
    if (page === 'landing') return <LandingPage setPage={setPage} />;
    
    // Auth Protected Routes
    if (page === 'dashboard') {
      if (!currentUser) return <LandingPage setPage={setPage} />;
      return currentUser.role === 'donor' ? <DonorDashboard /> : <CollectorView />;
    }

    return <LandingPage setPage={setPage} />;
  };

  const publicNav = ['Map', 'PWA'];
  const authNav = ['Map', 'Dashboard', 'PWA'];

  const currentNav = currentUser ? authNav : publicNav;

  return (
    <div className="font-sans text-[#1A1A1A] bg-[#F5F0E8] min-h-screen selection:bg-[#1A9E6E] selection:text-white relative">
      <AuthModal />
      
      {/* Navigation */}
      <nav className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div onClick={() => setPage('landing')} className="cursor-pointer">
            <Logo />
          </div>
          
          <div className="hidden md:flex gap-8 items-center font-bold text-sm text-gray-500">
            {currentNav.map((p) => (
              <button 
                key={p} 
                onClick={() => handleNavClick(p)}
                className={`transition-colors hover:text-[#1A9E6E] ${page === p.toLowerCase() ? 'text-[#1A9E6E]' : ''}`}
              >
                {p === 'PWA' ? 'Mobile App' : p}
              </button>
            ))}

            {currentUser ? (
              <div className="flex items-center gap-6 border-l pl-6 border-gray-200">
                {/* Role Switcher */}
                <div className="flex p-1 bg-gray-100 rounded-full cursor-pointer relative shadow-inner">
                  <div 
                    className="absolute inset-y-1 bg-white rounded-full shadow-sm transition-all duration-300"
                    style={{ width: '50%', left: currentUser.role === 'donor' ? '4px' : 'calc(50% - 4px)' }}
                  />
                  <button 
                    onClick={() => { switchRole('donor'); setPage('dashboard'); }}
                    className={`relative z-10 px-4 py-1.5 text-xs font-bold rounded-full flex items-center gap-1 transition-colors ${currentUser.role === 'donor' ? 'text-[#1A9E6E]' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Leaf size={14} /> Donor
                  </button>
                  <button 
                    onClick={() => { switchRole('collector'); setPage('dashboard'); }}
                    className={`relative z-10 px-4 py-1.5 text-xs font-bold rounded-full flex items-center gap-1 transition-colors ${currentUser.role === 'collector' ? 'text-[#1A9E6E]' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Truck size={14} /> Collector
                  </button>
                </div>
                
                {/* User Info / Logout */}
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-[#0D2B1F]">{currentUser.name}</span>
                  <button onClick={logout} className="text-[10px] text-gray-400 hover:text-red-500 transition-colors uppercase cursor-pointer text-right outline-none">Sign Out</button>
                </div>
              </div>
            ) : (
              <Button onClick={openAuth} variant="secondary" className="px-5 py-2 text-xs">Sign In</Button>
            )}
          </div>

          <button className="md:hidden text-[#0D2B1F]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-16 bg-white z-40 md:hidden p-8 flex flex-col gap-6"
          >
            {currentNav.map((p) => (
              <button 
                key={p} 
                onClick={() => handleNavClick(p)}
                className="text-2xl font-bold text-left hover:text-[#1A9E6E]"
              >
                {p === 'PWA' ? 'Mobile App' : p}
              </button>
            ))}

            {currentUser ? (
              <div className="mt-auto space-y-6">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Switch Role</p>
                  <div className="flex gap-4">
                    <button onClick={() => { switchRole('donor'); setPage('dashboard'); setMobileMenuOpen(false); }} className={`flex-1 py-3 overflow-hidden rounded-xl font-bold flex items-center justify-center gap-2 ${currentUser.role === 'donor' ? 'bg-[#1A9E6E]/10 text-[#1A9E6E] ring-1 ring-[#1A9E6E]' : 'bg-gray-50 text-gray-500'}`}><Leaf size={18}/> Donor</button>
                    <button onClick={() => { switchRole('collector'); setPage('dashboard'); setMobileMenuOpen(false); }} className={`flex-1 py-3 overflow-hidden rounded-xl font-bold flex items-center justify-center gap-2 ${currentUser.role === 'collector' ? 'bg-[#1A9E6E]/10 text-[#1A9E6E] ring-1 ring-[#1A9E6E]' : 'bg-gray-50 text-gray-500'}`}><Truck size={18}/> NGO</button>
                  </div>
                </div>
                <div>
                  <Button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full bg-red-50 text-red-500 hover:bg-red-100 border-none shadow-none text-left pl-6">Sign Out</Button>
                </div>
              </div>
            ) : (
              <div className="mt-auto">
                <Button onClick={() => { openAuth(); setMobileMenuOpen(false); }} className="w-full">Sign In / Sign Up</Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <FoodRescueProvider>
      <AppContent />
    </FoodRescueProvider>
  );
}
