import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Clock, Leaf } from 'lucide-react';
import Button from '../components/Button';
import Countdown from '../components/Countdown';
import { useFoodRescue } from '../context/FoodRescueContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';
import { calculateDistance } from '../utils/distance';

const createCustomIcon = (urgency) => {
  const isCritical = urgency === 'critical';
  const colorClass = isCritical ? 'bg-[#E8523A]' : 'bg-[#1A9E6E]';
  const html = renderToString(
    <div className={`relative flex items-center justify-center p-2 rounded-full shadow-lg border-2 border-white transition-transform hover:scale-110 ${colorClass}`} style={{ width: '32px', height: '32px' }}>
      <Leaf size={16} className="text-white fill-current relative z-10" />
      {isCritical && <div className="absolute inset-0 bg-[#E8523A] rounded-full animate-ping opacity-30" />}
    </div>
  );

  return L.divIcon({
    className: 'custom-leaflet-pin',
    html,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20]
  });
};

const MapUpdater = ({ center }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

const InteractiveMap = () => {
  const { listings, claimListing, currentUser, openAuth, userLocation } = useFoodRescue();
  const [selectedId, setSelectedId] = useState(null);

  const handleClaimClick = (e, id) => {
    e.stopPropagation();
    if (!currentUser) {
      openAuth();
    } else {
      claimListing(id);
      setSelectedId(null);
    }
  };
  
  const selected = listings.find(l => l.id === selectedId);
  
  const mapCenter = userLocation || [51.505, -0.09]; 

  const localListings = userLocation 
    ? listings.filter(l => calculateDistance(userLocation[0], userLocation[1], l.position[0], l.position[1]) <= 5)
    : listings;

  const userIcon = L.divIcon({
    className: 'custom-leaflet-pin',
    html: renderToString(<div className="w-5 h-5 bg-blue-500 rounded-full border-[3px] border-white shadow-xl animate-pulse" />),
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden bg-[#F5F0E8] relative z-0">
      {/* Sidebar */}
      <div className="w-96 bg-white border-r border-gray-100 flex-col hidden lg:flex relative z-10">
        <div className="p-6 border-b border-gray-100">
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search food or donors..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-none text-sm focus:ring-2 focus:ring-[#1A9E6E]"
              />
            </div>
            <button className="p-2 bg-gray-50 rounded-xl text-gray-500 hover:bg-[#1A9E6E]/10 hover:text-[#1A9E6E]">
              <Filter size={20} />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {['All', 'Vegetarian', '< 1km', 'Expiring'].map(f => (
              <button key={f} className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${f === 'All' ? 'bg-[#1A9E6E] text-white' : 'bg-gray-100 text-gray-600'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Active Listings Nearby</p>
          {localListings.map(l => (
            <div 
              key={l.id} 
              onClick={() => setSelectedId(l.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${selectedId === l.id ? 'border-[#1A9E6E] bg-[#1A9E6E]/5 ring-1 ring-[#1A9E6E]' : 'border-gray-100 hover:border-gray-300 bg-white shadow-sm'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-[#0D2B1F]">{l.name}</h4>
                <div className={`text-[10px] px-2 py-1 rounded-full font-black uppercase ${l.urgency === 'critical' ? 'bg-[#E8523A] text-white' : 'bg-[#1A9E6E]/10 text-[#1A9E6E]'}`}>
                  {l.urgency}
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                <MapPin size={12} /> {l.donor} · {userLocation ? calculateDistance(userLocation[0], userLocation[1], l.position[0], l.position[1]).toFixed(1) + 'km' : l.dist}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  {l.tags.map(t => <span key={t} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-md font-bold">{t}</span>)}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Clock size={12} className="text-[#E8523A]" />
                  <Countdown minutes={l.time} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Canvas */}
      <div className="flex-1 relative bg-[#e5e7eb] z-0">
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          {selected && <MapUpdater center={selected.position} />}
          
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {userLocation && <Marker position={userLocation} icon={userIcon} zIndexOffset={100} />}

          {localListings.map(l => (
            <Marker 
              key={l.id} 
              position={l.position} 
              icon={createCustomIcon(l.urgency)}
              eventHandlers={{ click: () => setSelectedId(l.id) }}
            >
              <Popup className="custom-leaflet-popup" closeButton={false}>
                <div className="w-48 bg-white rounded-xl overflow-hidden p-2">
                  <div className="h-24 bg-gray-200 rounded-lg mb-3 relative overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=100&fit=crop`} className="w-full h-full object-cover" alt="food" />
                  </div>
                  <h5 className="font-bold text-sm text-[#0D2B1F] truncate mb-1" style={{ fontFamily: 'Inter' }}>{l.name}</h5>
                  <p className="text-xs text-gray-500 mb-3" style={{ fontFamily: 'Inter' }}>{l.qty} • <Countdown minutes={l.time} className="inline" /></p>
                  <Button className="w-full py-2 text-xs" onClick={(e) => handleClaimClick(e, l.id)}>Claim Now</Button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Mobile Filter Overlay */}
        <div className="absolute top-4 left-4 right-4 lg:hidden flex gap-2 overflow-x-auto pb-2 z-20">
          {['Near Me', 'Veg Only', 'Expiring Now'].map(f => (
            <button key={f} className="px-4 py-2 bg-white rounded-full shadow-md text-xs font-bold whitespace-nowrap">
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
