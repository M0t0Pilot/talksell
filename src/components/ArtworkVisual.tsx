import React, { useState } from 'react';

interface ArtworkVisualProps {
  src?: string;
  alt: string;
  category?: string;
  className?: string;
  aspectRatio?: '4:3' | '16:9' | '1:1' | '3:4';
  title?: string;
}

export const ArtworkVisual: React.FC<ArtworkVisualProps> = ({
  src,
  alt,
  category = 'Artisanal',
  className = '',
  aspectRatio = '4:3',
  title = '',
}) => {
  const [hasError, setHasError] = useState(false);

  const getAspectClass = () => {
    switch (aspectRatio) {
      case '16:9':
        return 'aspect-video';
      case '1:1':
        return 'aspect-square';
      case '3:4':
        return 'aspect-[3/4]';
      case '4:3':
      default:
        return 'aspect-[4/3]';
    }
  };

  // If image loads successfully, render it with fallback error handler
  if (src && !hasError) {
    return (
      <div className={`relative overflow-hidden bg-[#F4F4F0] ${getAspectClass()} ${className}`}>
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>
    );
  }

  // Pure CSS / SVG crafted fallback artwork
  const getCategoryPattern = () => {
    const cat = category.toLowerCase();
    if (cat.includes('coffee') || cat.includes('tea')) {
      return (
        <svg className="w-24 h-24 text-amber-800/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M30 40 C30 25, 70 25, 70 40 L65 75 C65 85, 35 85, 35 75 Z" />
          <path d="M25 35 L75 35" strokeWidth="2" />
          <path d="M70 45 C80 45, 85 55, 75 65 L65 65" />
          <path d="M45 20 Q50 15, 45 10" strokeDasharray="2 2" />
          <path d="M55 20 Q60 15, 55 10" strokeDasharray="2 2" />
        </svg>
      );
    }
    if (cat.includes('stationery') || cat.includes('journal') || cat.includes('essay')) {
      return (
        <svg className="w-24 h-24 text-stone-700/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="25" y="20" width="50" height="65" rx="3" />
          <line x1="35" y1="35" x2="65" y2="35" />
          <line x1="35" y1="45" x2="65" y2="45" />
          <line x1="35" y1="55" x2="55" y2="55" />
          <circle cx="68" cy="72" r="8" fill="#D97706" fillOpacity="0.2" stroke="#B45309" />
        </svg>
      );
    }
    if (cat.includes('linen') || cat.includes('textile') || cat.includes('home')) {
      return (
        <svg className="w-24 h-24 text-emerald-800/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M35 25 L65 25 L75 80 L25 80 Z" />
          <path d="M35 25 Q50 35, 65 25" />
          <line x1="40" y1="50" x2="60" y2="50" strokeDasharray="2 2" />
          <line x1="40" y1="65" x2="60" y2="65" strokeDasharray="2 2" />
        </svg>
      );
    }
    if (cat.includes('candle') || cat.includes('aroma')) {
      return (
        <svg className="w-24 h-24 text-amber-700/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="35" y="45" width="30" height="40" rx="2" />
          <path d="M50 45 L50 35" strokeWidth="2" />
          <path d="M50 35 C46 30, 46 22, 50 18 C54 22, 54 30, 50 35 Z" fill="#F59E0B" fillOpacity="0.5" />
        </svg>
      );
    }
    return (
      <svg className="w-24 h-24 text-stone-600/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="50" cy="50" r="30" />
        <path d="M35 50 Q50 30, 65 50 T95 50" />
        <line x1="50" y1="20" x2="50" y2="80" strokeDasharray="3 3" />
      </svg>
    );
  };

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-[#F5F3EF] via-[#ECEAE5] to-[#DFDCD4] flex flex-col items-center justify-center p-6 text-center select-none ${getAspectClass()} ${className}`}
    >
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#78716C_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="relative z-10 flex flex-col items-center gap-2">
        {getCategoryPattern()}
        <span className="text-xs uppercase tracking-widest font-medium text-stone-500">
          {category}
        </span>
        {title && (
          <span className="text-sm font-serif italic text-stone-800 line-clamp-1 max-w-[200px]">
            {title}
          </span>
        )}
      </div>
    </div>
  );
};
