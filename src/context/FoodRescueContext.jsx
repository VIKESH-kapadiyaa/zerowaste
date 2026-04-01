import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { LISTINGS as initialListings } from '../data/mockData';

const FoodRescueContext = createContext();

export const useFoodRescue = () => useContext(FoodRescueContext);

export const FoodRescueProvider = ({ children }) => {
  // --- Auth State ---
  const [currentUser, setCurrentUser] = useState(null); // null means logged out
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [initialRole, setInitialRole] = useState('donor');
  const [isLoading, setIsLoading] = useState(true); // Prevents blank flash
  const currentUserRef = useRef(null); // Avoids stale closure in listeners

  const login = async (businessName, role, address) => {
    // 1. Get the authenticated Supabase user (from Google or Email)
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // 2. UPSERT the Business details directly into the profiles table!
      const profileData = {
        id: session.user.id,
        business_name: businessName,
        role: role,
        address: address || '',
        entity_type: 'Default'
      };

      const { error } = await supabase.from('profiles').upsert(profileData);
      
      if (!error) {
        // 3. Update the Frontend App State
        const user = { id: session.user.id, name: businessName, role };
        setCurrentUser(user);
        currentUserRef.current = user;
        setAuthModalOpen(false);
      } else {
        console.error("Database UPSERT Error:", error);
      }
    } else {
      // Fallback for mocked local memory if Google Auth wasn't fired
      setCurrentUser({ id: Date.now().toString(), name: businessName, role });
      setAuthModalOpen(false);
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    await supabase.auth.signOut();
  };

  const switchRole = async (newRole) => {
    if (currentUser && currentUser.id.length > 15) { // Assuming Supabase UUIDs are long
      await supabase.from('profiles').upsert({ id: currentUser.id, role: newRole });
      setCurrentUser({ ...currentUser, role: newRole });
    } else if (currentUser) {
      setCurrentUser({ ...currentUser, role: newRole });
    }
  };

  const openAuth = (role = 'donor') => {
    setInitialRole(role);
    setAuthModalOpen(true);
  };
  const closeAuth = () => setAuthModalOpen(false);

  // --- App Core Data State ---
  const [listings, setListings] = useState([]);
  const [history, setHistory] = useState([]);
  const [impactStats, setImpactStats] = useState({ kgRescued: 0, totalDonated: 0, impactScore: 0 });
  const [userLocation, setUserLocation] = useState(null);

  // 1. Fetch Location & Track Session
  useEffect(() => {
    // Fetch Location immediately
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation([position.coords.latitude, position.coords.longitude]),
        () => setUserLocation([51.505, -0.09])
      );
    } else {
      setUserLocation([51.505, -0.09]);
    }

    // 1b. Restore Persistent User Session from LocalStorage
    const restoreSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
          if (profile) {
            const user = { id: profile.id, name: profile.business_name, role: profile.role };
            setCurrentUser(user);
            currentUserRef.current = user;
          } else {
            setAuthModalOpen(true); // User hasn't finished Step 2 yet
          }
        }
      } catch (err) {
        console.warn('Session restore failed:', err);
      } finally {
        setIsLoading(false); // Always stop loading, even on error
      }
    };
    restoreSession();

    // Intercept Google Redirects and auto-resume session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile) {
          const user = { id: profile.id, name: profile.business_name, role: profile.role };
          setCurrentUser(user);
          currentUserRef.current = user;
        } else if (event === 'SIGNED_IN' && !currentUserRef.current) {
          setAuthModalOpen(true); // Pop open the Business Details phase!
        }
      }
      setIsLoading(false);
    });

    fetchLiveListings();

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch Live Database Food Listings
  const fetchLiveListings = async () => {
    const { data: liveListings, error } = await supabase.from('listings').select('*, profiles(business_name)').eq('status', 'active');
    
    if (error) {
      console.error(error);
      return;
    }

    // If database is completely empty, fallback to mock data to keep the Demo looking rich
    if (!liveListings || liveListings.length === 0) {
      setListings(initialListings.map(l => ({ ...l, position: [51.505 + (Math.random()-0.5)*0.08, -0.09 + (Math.random()-0.5)*0.08] })));
    } else {
      // Structure the live DB records to match our frontend format
      const mapped = liveListings.map(l => ({
        id: l.id,
        name: l.name,
        qty: l.qty,
        urgency: l.urgency,
        donor: l.profiles?.business_name || 'Anonymous',
        position: [l.lat, l.lng],
        time: 120, // Mock exp time
        tags: l.tags || [],
        dist: "0km" // Handled by distance calc
      }));
      setListings(mapped);
    }
  };

  // 3. Add Activity (Donor Posts Food)
  const addListing = async (newListing) => {
    if (!currentUser) return;
    
    const lat = userLocation ? userLocation[0] : 51.505;
    const lng = userLocation ? userLocation[1] : -0.09;

    if (currentUser.id.length > 15) { // If true Supabase User
      const { error } = await supabase.from('listings').insert({
        donor_id: currentUser.id,
        name: newListing.name,
        qty: newListing.qty,
        urgency: newListing.urgency,
        lat: lat,
        lng: lng,
        status: 'active'
      });
      if (!error) fetchLiveListings(); // Refetch Data immediately
    } else {
      // Mock Fallback
      const listing = {
        ...newListing, id: Date.now(), donor: currentUser.name, position: [lat, lng],
        dist: "0km", tags: [], time: 120
      };
      setListings(prev => [listing, ...prev]);
    }
    
    setHistory(prev => [{ name: newListing.name, date: "Just now", qty: newListing.qty, status: "Active", impact: "Pending", donor: currentUser.name }, ...prev]);
    setImpactStats(prev => ({ ...prev, totalDonated: prev.totalDonated + 1 }));
  };

  // 4. Claim Activity (Collector takes Food)
  const claimListing = async (id) => {
    if (!currentUser) return;
    const listingToClaim = listings.find(l => l.id === id);
    if (!listingToClaim) return;

    // Supabase Execution
    if (currentUser.id.length > 15 && typeof id === 'string') {
      await supabase.from('listings').update({ status: 'claimed' }).eq('id', id);
      await supabase.from('claims').insert({ listing_id: id, collector_id: currentUser.id });
      fetchLiveListings();
    } else {
       // Mock Fallback
       setListings(prev => prev.filter(l => l.id !== id));
    }
    
    setHistory(prev => prev.map(item => 
      item.name === listingToClaim.name && item.status === "Active" ? { ...item, status: "Claimed", impact: "Claimed" } : item
    ));
  };

  // Show a loading spinner until auth state is resolved
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#1A9E6E] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-bold">Loading ZeroWaste...</p>
        </div>
      </div>
    );
  }

  return (
    <FoodRescueContext.Provider value={{ 
      currentUser, login, logout, switchRole, authModalOpen, openAuth, closeAuth, initialRole, userLocation,
      listings, history, impactStats, addListing, claimListing 
    }}>
      {children}
    </FoodRescueContext.Provider>
  );
};
