
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'wordmark';
  color?: string;
  showSlogan?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  variant = 'full', 
  color = "currentColor",
  showSlogan = false 
}) => {
  const Icon = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Circle */}
      <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="2.5" />
      {/* Geometric Pattern Arcs - Recreating the Porto Brasil Symbol */}
      <circle cx="50" cy="50" r="28" stroke={color} strokeWidth="1.5" />
      
      {/* Intersecting Arcs */}
      <path d="M50 5 Q 75 25, 95 50" stroke={color} strokeWidth="1.5" />
      <path d="M50 5 Q 25 25, 5 50" stroke={color} strokeWidth="1.5" />
      <path d="M5 50 Q 25 75, 50 95" stroke={color} strokeWidth="1.5" />
      <path d="M95 50 Q 75 75, 50 95" stroke={color} strokeWidth="1.5" />
      
      {/* Additional Geometric Lines */}
      <path d="M50 22 L 50 5" stroke={color} strokeWidth="1.5" />
      <path d="M50 78 L 50 95" stroke={color} strokeWidth="1.5" />
      <path d="M22 50 L 5 50" stroke={color} strokeWidth="1.5" />
      <path d="M78 50 L 95 50" stroke={color} strokeWidth="1.5" />
      
      <path d="M31 31 L 18 18" stroke={color} strokeWidth="1.5" />
      <path d="M69 31 L 82 18" stroke={color} strokeWidth="1.5" />
      <path d="M31 69 L 18 82" stroke={color} strokeWidth="1.5" />
      <path d="M69 69 L 82 82" stroke={color} strokeWidth="1.5" />
    </svg>
  );

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {(variant === 'full' || variant === 'icon') && (
        <div className={`${variant === 'full' ? 'w-20 h-20 mb-4' : 'w-10 h-10'}`}>
          <Icon />
        </div>
      )}
      
      {(variant === 'full' || variant === 'wordmark') && (
        <div className="text-center">
          <h1 className="font-luxury text-2xl md:text-3xl tracking-[0.15em] uppercase" style={{ color }}>
            Porto Brasil
          </h1>
          {showSlogan && (
            <p className="text-[9px] md:text-[11px] font-medium tracking-[0.4em] uppercase mt-1 opacity-70" style={{ color }}>
              Viva o Momento
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
