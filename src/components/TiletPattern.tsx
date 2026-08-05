import React from 'react';

interface TiletPatternProps {
  className?: string;
  height?: number;
  opacity?: number;
  variant?: 'gold-warm' | 'colorful' | 'minimal' | 'brown-gold';
}

export function TiletPattern({
  className = '',
  height = 12,
  opacity = 0.85,
  variant = 'gold-warm'
}: TiletPatternProps) {
  // Traditional colors:
  // Gold: #C79A2B, Orange: #E89B52, Walnut: #6F4E37, Charcoal: #2B2B2B
  
  const getColors = () => {
    switch (variant) {
      case 'colorful':
        return {
          bg: '#2B2B2B',
          c1: '#C79A2B', // Gold
          c2: '#E89B52', // Orange
          c3: '#9E2A2B', // Dark Red
          c4: '#3F5E3D'  // Forest Green
        };
      case 'minimal':
        return {
          bg: 'transparent',
          c1: '#E7DED1', // Light warm gray
          c2: '#C79A2B', // Gold
          c3: '#E7DED1',
          c4: 'transparent'
        };
      case 'brown-gold':
        return {
          bg: '#6F4E37', // Walnut
          c1: '#C79A2B', // Gold
          c2: '#E89B52', // Orange
          c3: '#FAF6EF', // Soft cream
          c4: '#2B2B2B'
        };
      case 'gold-warm':
      default:
        return {
          bg: '#2B2B2B', // Charcoal base
          c1: '#C79A2B', // Gold
          c2: '#E89B52', // Orange
          c3: '#6F4E37', // Walnut Brown
          c4: '#FAF6EF'  // Soft Cream
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`relative w-full overflow-hidden select-none ${className}`}
      style={{ height: `${height}px`, opacity }}
    >
      <svg
        width="100%"
        height="100%"
        className="absolute top-0 left-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`tilet-pattern-${variant}`}
            width="64"
            height={height}
            patternUnits="userSpaceOnUse"
          >
            {/* Background */}
            <rect width="64" height={height} fill={colors.bg} />

            {/* Interlocking geometric diamonds and borders */}
            <path
              d={`M0,${height/2} L8,0 L16,${height/2} L8,${height} Z`}
              fill={colors.c1}
            />
            <path
              d={`M16,${height/2} L24,0 L32,${height/2} L24,${height} Z`}
              fill={colors.c2}
            />
            <path
              d={`M32,${height/2} L40,0 L48,${height/2} L40,${height} Z`}
              fill={colors.c3}
            />
            <path
              d={`M48,${height/2} L56,0 L64,${height/2} L56,${height} Z`}
              fill={colors.c1}
            />

            {/* Inlaid inner diamond points */}
            <circle cx="8" cy={height/2} r={height/6} fill={colors.c4} />
            <circle cx="24" cy={height/2} r={height/6} fill={colors.bg} />
            <circle cx="40" cy={height/2} r={height/6} fill={colors.c4} />
            <circle cx="56" cy={height/2} r={height/6} fill={colors.c2} />

            {/* Top and Bottom mini golden tracks */}
            <rect x="0" y="0" width="64" height="1.5" fill={colors.c1} opacity="0.6" />
            <rect x="0" y={height - 1.5} width="64" height="1.5" fill={colors.c1} opacity="0.6" />

            {/* Intersecting cross dots */}
            <rect x="15.5" y={height/2 - 1.5} width="1" height="3" fill={colors.c4} />
            <rect x="47.5" y={height/2 - 1.5} width="1" height="3" fill={colors.c4} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#tilet-pattern-${variant})`} />
      </svg>
    </div>
  );
}

