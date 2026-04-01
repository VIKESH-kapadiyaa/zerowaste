import React from 'react';
import { Bell, Clock, MapPin, Plus, BarChart3, Leaf } from 'lucide-react';
import Logo from '../components/Logo';
import Button from '../components/Button';

const MobilePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);

  React.useEffect(() => {
    // Listen for the special PWA installation event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault(); // Prevent standard browser prompts
      setDeferredPrompt(e); // Save it so we can trigger it from our button
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
  <div className="min-h-screen bg-[#F5F0E8] py-12 px-6 flex flex-col items-center">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-[#0D2B1F]" style={{ fontFamily: 'Space Grotesk' }}>Mobile PWA Experience</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-6">ZeroWaste is fundamentally designed for speed on mobile. Install the Progressive Web App directly to your device for offline support and native performance.</p>
      
      {deferredPrompt ? (
        <Button 
          onClick={handleInstallClick} 
          className="bg-[#1A9E6E] hover:bg-[#1A9E6E]/90 shadow-xl px-8 py-4 rounded-xl font-bold flex items-center gap-3 mx-auto"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Install ZeroWaste (APK)
        </Button>
      ) : (
        <div className="bg-white px-6 py-4 rounded-xl border border-gray-200 text-sm text-gray-500 flex items-center gap-3 max-w-md mx-auto shadow-sm">
          <Leaf className="text-[#1A9E6E] shrink-0" size={18} />
          <span>If using an iPhone, tap the Share icon and select <b>"Add to Home Screen"</b> to install the app native wrapper!</span>
        </div>
      )}
    </div>

    <div className="flex flex-wrap justify-center gap-12 max-w-5xl">
      {/* Home Screen */}
      <div className="w-[280px] h-[580px] bg-white rounded-[40px] border-[8px] border-[#0D2B1F] shadow-2xl overflow-hidden relative">
        <div className="h-6 w-32 bg-[#0D2B1F] absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-20" />
        <div className="p-6 pt-10 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <Logo />
            <Bell className="text-gray-400" size={20} />
          </div>
          <div className="bg-[#1A9E6E]/10 p-4 rounded-2xl mb-6">
            <p className="text-[10px] font-bold text-[#1A9E6E] uppercase mb-1">Available Near You</p>
            <p className="text-lg font-bold text-[#0D2B1F]">12 Local Rescues</p>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-500"><Clock size={16} /></div>
              <div>
                <p className="text-xs font-bold truncate">Expiring: Salad Bowls</p>
                <p className="text-[10px] text-gray-400">0.2km · 12m left</p>
              </div>
            </div>
          </div>
          <div className="mt-auto">
            <div className="p-4 bg-[#F5F0E8] rounded-2xl mb-4 border border-[#1A9E6E]/20">
              <p className="text-xs font-bold mb-2">PWA Installed</p>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-white rounded-lg border border-[#1A9E6E] flex items-center justify-center shadow-sm">
                  <Leaf className="text-[#1A9E6E]" size={16} />
                </div>
                <p className="text-[10px] text-gray-500">Shortcut added to your home screen.</p>
              </div>
            </div>
          </div>
          <div className="flex justify-around items-center pt-4 border-t border-gray-100">
            <MapPin size={20} className="text-[#1A9E6E]" />
            <Plus size={24} className="text-gray-300" />
            <BarChart3 size={20} className="text-gray-300" />
          </div>
        </div>
      </div>

      {/* Push Notification */}
      <div className="w-[280px] flex flex-col gap-6 justify-center">
        <div className="bg-white/80 backdrop-blur-md border border-white p-4 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#1A9E6E] rounded-md flex items-center justify-center">
                <Leaf className="text-white" size={10} />
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Alert: Urgency</span>
            </div>
            <span className="text-[10px] text-gray-400">Now</span>
          </div>
          <h4 className="font-bold text-sm">🍱 Hot food available 0.4km away</h4>
          <p className="text-xs text-gray-500 mt-1">"Bento Boxes" expiring in 22 mins. Claim now to secure the rescue!</p>
        </div>

        <div className="p-6 bg-[#0D2B1F] rounded-3xl text-white">
          <h4 className="font-bold mb-2">Claim Success</h4>
          <p className="text-xs opacity-60 mb-4">You have 30 minutes to complete the pickup.</p>
          <div className="text-3xl font-black text-[#1A9E6E] mb-6 font-mono">29:59</div>
          <Button className="w-full py-2 text-xs">Get Directions</Button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default MobilePWA;
