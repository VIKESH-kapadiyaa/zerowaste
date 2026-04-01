import React, { useState, useEffect } from 'react';

const Countdown = ({ minutes }) => {
  const [time, setTime] = useState(minutes * 60);
  
  useEffect(() => {
    const timer = setInterval(() => setTime(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [minutes]);

  const m = Math.floor(time / 60);
  const s = time % 60;
  const colorClass = time < 900 ? 'text-[#E8523A]' : time < 1800 ? 'text-orange-500' : 'text-[#1A9E6E]';

  return (
    <span className={`font-mono font-bold ${colorClass}`}>
      {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </span>
  );
};

export default Countdown;
