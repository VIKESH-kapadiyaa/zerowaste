import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: `bg-[#1A9E6E] text-white hover:bg-[#148058]`,
    secondary: `bg-[#0D2B1F] text-white hover:bg-[#1a3a2d]`,
    outline: `border-2 border-[#1A9E6E] text-[#1A9E6E] hover:bg-[#1A9E6E] hover:text-white`,
    ghost: `text-[#1A9E6E] hover:bg-[#1A9E6E]/10`,
    danger: `bg-[#E8523A] text-white hover:bg-[#cf4530]`
  };
  return (
    <button 
      className={`px-6 py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
