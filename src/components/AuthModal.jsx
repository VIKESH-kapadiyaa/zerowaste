import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Leaf, Truck, ArrowRight, Building2, MapPin, Briefcase } from 'lucide-react';
import Button from './Button';
import { useFoodRescue } from '../context/FoodRescueContext';
import { supabase } from '../lib/supabaseClient';

const AuthModal = () => {
  const { authModalOpen, closeAuth, login, initialRole, currentUser } = useFoodRescue();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(initialRole || 'donor');
  
  // Step 1 Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Step 2 Form (Business Details)
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Restaurant');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (authModalOpen) {
      setRole(initialRole || 'donor');
      setStep(1);
    }
  }, [authModalOpen, initialRole]);

  // Listen for Supabase session after Google OAuth redirect
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !currentUser) {
        // The user just redirected back from Google! They need to finish Step 2.
        setStep(2);
      }
    };
    if (authModalOpen) {
      checkSession();
    }
  }, [authModalOpen, currentUser]);

  if (!authModalOpen) return null;

  const handleGoogleAuth = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    // 1. Try to sign in first (existing user)
    let { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    // 2. If credentials are wrong, try creating a new account
    if (error) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
      
      if (signUpError) {
        // If signup also fails (e.g. "User already registered" with wrong password)
        alert("Could not sign in. Please check your email and password.");
        return;
      }
      
      // After signup, try signing in immediately
      const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({ email, password });
      if (retryError) {
        // Email confirmation might be required
        alert("Account created! Please check your email to confirm, then sign in.");
        return;
      }
      data = retryData;
    }

    // 3. Check if this user already has a profile (returning user)
    if (data?.session) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.session.user.id).single();
      if (profile) {
        // Returning user! Skip step 2 and log them in directly
        login(profile.business_name, profile.role, profile.address);
        return;
      }
    }

    // 4. New user — collect their Business Name in step 2
    setStep(2);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (businessName.trim()) {
      await login(businessName, role, address);
      setStep(1);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-[#0D2B1F]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
        >
          <button onClick={closeAuth} className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 z-10">
            <X size={24} />
          </button>
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#0D2B1F] mb-2" style={{ fontFamily: 'Space Grotesk' }}>Join ZeroWaste</h2>
                  <p className="text-gray-500">Log in or create a new account.</p>
                </div>

                <button 
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-bold text-gray-700 shadow-sm mb-6"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
                  Continue with Google
                </button>

                <div className="relative flex items-center mb-6">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">or</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <form onSubmit={handleNext} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                    <input 
                      required 
                      type="email" 
                      placeholder="name@company.com" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A9E6E] focus:outline-none" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                    <input 
                      required 
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A9E6E] focus:outline-none" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                    />
                  </div>
                  <Button type="submit" className="w-full py-4 text-lg mt-4 flex items-center justify-center gap-2">
                    Next Step <ArrowRight size={18} />
                  </Button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
              >
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-[#1A9E6E]/10 flex items-center justify-center rounded-2xl mx-auto mb-3 text-[#1A9E6E]">
                    <Building2 size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-[#0D2B1F] mb-1" style={{ fontFamily: 'Space Grotesk' }}>Business Profile</h2>
                  <p className="text-gray-500 text-sm">Let's set up your {role} organization details.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div 
                    onClick={() => setRole('donor')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center ${role === 'donor' ? 'border-[#1A9E6E] bg-[#1A9E6E]/5' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <Leaf size={20} className={role === 'donor' ? 'text-[#1A9E6E]' : 'text-gray-400'} />
                    <span className="font-bold text-xs mt-2">I'm a Donor</span>
                  </div>
                  <div 
                    onClick={() => setRole('collector')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center ${role === 'collector' ? 'border-[#1A9E6E] bg-[#1A9E6E]/5' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <Truck size={20} className={role === 'collector' ? 'text-[#1A9E6E]' : 'text-gray-400'} />
                    <span className="font-bold text-xs mt-2">I'm a Collector</span>
                  </div>
                </div>

                <form onSubmit={handleFinalSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {role === 'donor' ? 'Business / Location Name' : 'Organization Name'}
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3.5 text-gray-400" size={16} />
                      <input 
                        required 
                        type="text" 
                        placeholder={role === 'donor' ? "e.g. Bakers Delight" : "e.g. City Food Bank"} 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A9E6E] focus:outline-none" 
                        value={businessName} 
                        onChange={e => setBusinessName(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Entity Type</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A9E6E] focus:outline-none appearance-none"
                      value={businessType}
                      onChange={e => setBusinessType(e.target.value)}
                    >
                      {role === 'donor' ? (
                        <>
                          <option>Restaurant / Cafe</option>
                          <option>Grocery / Supermarket</option>
                          <option>Farm / Producer</option>
                          <option>Private Household</option>
                        </>
                      ) : (
                        <>
                          <option>Verified NGO / Charity</option>
                          <option>Community Fridge / Shelter</option>
                          <option>Independent Volunteer</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {role === 'collector' ? 'Verification / Tax ID' : 'Pickup Address'}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 text-gray-400" size={16} />
                      <input 
                        required 
                        type="text" 
                        placeholder={role === 'collector' ? "Enter registration ID" : "123 Main St, London"} 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A9E6E] focus:outline-none" 
                        value={address} 
                        onChange={e => setAddress(e.target.value)} 
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full py-4 text-lg mt-6 shadow-xl relative overflow-hidden group">
                    <span className="relative z-10">Complete Profile Setup</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
