import React from 'react';
import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const Logo = ({ light = false }) => (
  <div className="flex items-center gap-2 group cursor-pointer">
    <div className={`relative w-10 h-10 flex items-center justify-center rounded-full border-2 ${light ? 'border-white' : 'border-[#1A9E6E]'}`}>
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-t-2 border-transparent rounded-full"
      />
      <Leaf className={`${light ? 'text-white' : 'text-[#1A9E6E]'} fill-current`} size={20} />
    </div>
    <span className={`text-xl font-bold tracking-tight ${light ? 'text-white' : 'text-[#0D2B1F]'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
      ZERO<span className="text-[#1A9E6E]">WASTE</span>
    </span>
  </div>
);

export default Logo;
