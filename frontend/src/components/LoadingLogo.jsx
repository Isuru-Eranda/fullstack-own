import React from 'react';
import Logo from './Logo';

export default function LoadingLogo({ size = 64, text = "Loading...", className = "" }) {
  return (
    <div className={`flex items-center justify-center space-x-2 ${className.includes('flex-row') ? 'flex-row' : 'flex-col space-y-4'}`}>
      <div className="relative">
        <Logo size={size} />
        {/* Left to right filling animation overlay */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/60 via-secondary-400/40 to-transparent animate-fill-left-to-right opacity-80"></div>
        </div>
      </div>
      {text && (
        <p className="text-text-secondary uppercase tracking-widest font-bold animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}