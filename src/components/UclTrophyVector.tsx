import React from 'react';

interface UclTrophyVectorProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export const UclTrophyVector: React.FC<UclTrophyVectorProps> = ({
  className = 'w-6 h-7',
  size,
  animated = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ucl-trophy-container ${className}`}
      style={size ? { width: size, height: size * 1.16 } : undefined}
      title="UEFA Champions League Trophy (La Coupe aux Grandes Oreilles)"
      aria-label="UEFA Champions League Trophy"
    >
      <svg
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full select-none ${animated ? 'ucl-trophy-animated' : ''}`}
      >
        <defs>
          {/* Silver Chrome Metallic Cup Body Gradient */}
          <linearGradient id="ucl-silver-body" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8A9AA8" />
            <stop offset="18%" stopColor="#C9D6E2" />
            <stop offset="38%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#9FB3C8" />
            <stop offset="82%" stopColor="#E2EAF2" />
            <stop offset="100%" stopColor="#6C7F93" />
          </linearGradient>

          {/* Cup Handles Gradient */}
          <linearGradient id="ucl-silver-handle-left" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C0D0DE" />
            <stop offset="30%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#7E93A8" />
            <stop offset="100%" stopColor="#4A5C6E" />
          </linearGradient>
          <linearGradient id="ucl-silver-handle-right" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C0D0DE" />
            <stop offset="30%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#7E93A8" />
            <stop offset="100%" stopColor="#4A5C6E" />
          </linearGradient>

          {/* Stepped Pedestal Base Gradient */}
          <linearGradient id="ucl-base-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C9D6E2" />
            <stop offset="40%" stopColor="#8A9CAE" />
            <stop offset="80%" stopColor="#415467" />
            <stop offset="100%" stopColor="#253545" />
          </linearGradient>

          {/* Animated Shimmer Sweep Clip */}
          <linearGradient id="ucl-shimmer-sweep" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* Subtle Trophy Glow */}
          <filter id="ucl-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── LEFT ICONIC HANDLE (Large Ear) ── */}
        <path
          d="M 36 29 C 24 24, 11 32, 11 50 C 11 74, 27 82, 38 82 C 34 80, 24 74, 24 55 C 24 40, 31 34, 38 34 Z"
          fill="url(#ucl-silver-handle-left)"
          stroke="#415467"
          strokeWidth="0.8"
        />

        {/* ── RIGHT ICONIC HANDLE (Large Ear) ── */}
        <path
          d="M 64 29 C 76 24, 89 32, 89 50 C 89 74, 73 82, 62 82 C 66 80, 76 74, 76 55 C 76 40, 69 34, 62 34 Z"
          fill="url(#ucl-silver-handle-right)"
          stroke="#415467"
          strokeWidth="0.8"
        />

        {/* ── MAIN CUP BODY ── */}
        <path
          d="M 32 26 L 68 26 C 72 26, 73 35, 71 52 C 69 68, 64 88, 56 94 L 44 94 C 36 88, 31 68, 29 52 C 27 35, 28 26, 32 26 Z"
          fill="url(#ucl-silver-body)"
          stroke="#334657"
          strokeWidth="0.75"
        />

        {/* Cup Rim Lip */}
        <ellipse cx="50" cy="26" rx="19" ry="3" fill="#D6E2ED" stroke="#485D72" strokeWidth="0.75" />
        <ellipse cx="50" cy="26" rx="16.5" ry="1.8" fill="#1C2B3A" />

        {/* Horizontal Rib / Ridge detailing */}
        <path d="M 31 36 Q 50 40 69 36" stroke="#475C71" strokeWidth="0.8" fill="none" opacity="0.7" />
        <path d="M 30 38 Q 50 42 70 38" stroke="#FFFFFF" strokeWidth="0.5" fill="none" opacity="0.6" />

        {/* Center Starball UEFA Crest Badge */}
        <g transform="translate(50, 48) scale(0.65)">
          <circle cx="0" cy="0" r="10" fill="#0E1E34" stroke="#D6E2ED" strokeWidth="0.8" />
          {/* 5-pointed star cluster representing the UCL Starball */}
          <polygon
            points="0,-6 1.8,-1.8 6,-1.8 2.6,0.8 3.8,5.2 0,2.6 -3.8,5.2 -2.6,0.8 -6,-1.8 -1.8,-1.8"
            fill="#FFFFFF"
          />
          <polygon
            points="4.5,-2.5 5.2,0 7,0.5 5.5,1.5 5.8,3.2 4.5,2.2"
            fill="#45B7FF"
            opacity="0.8"
          />
          <polygon
            points="-4.5,-2.5 -5.2,0 -7,0.5 -5.5,1.5 -5.8,3.2 -4.5,2.2"
            fill="#45B7FF"
            opacity="0.8"
          />
        </g>

        {/* Inscription simulation lines: "COUPE DES CLUBS CHAMPIONS EUROPÉENS" */}
        <path d="M 38 61 Q 50 63 62 61" stroke="#374B5F" strokeWidth="0.6" strokeDasharray="1.2 0.8" />
        <path d="M 40 64 Q 50 66 60 64" stroke="#374B5F" strokeWidth="0.6" strokeDasharray="1.2 0.8" />

        {/* Stem Transition */}
        <path
          d="M 44 94 L 56 94 L 54 102 L 46 102 Z"
          fill="url(#ucl-base-grad)"
          stroke="#334657"
          strokeWidth="0.6"
        />

        {/* Stepped Pedestal Base */}
        <ellipse cx="50" cy="103" rx="12" ry="2" fill="#8FA4B8" stroke="#334657" strokeWidth="0.6" />
        <path
          d="M 38 103 L 62 103 L 67 111 C 67 113, 33 113, 33 111 Z"
          fill="url(#ucl-base-grad)"
          stroke="#2A3C4D"
          strokeWidth="0.75"
        />
        <ellipse cx="50" cy="111" rx="17" ry="3" fill="#0C1724" stroke="#D6E2ED" strokeWidth="0.6" />

        {/* Vertical Specular Center Sheen */}
        <path
          d="M 48 29 L 52 29 L 50.5 93 L 49.5 93 Z"
          fill="#FFFFFF"
          opacity="0.55"
          filter="url(#ucl-glow)"
        />

        {/* Animated Star Sparkle on Left Handle */}
        <g className="ucl-sparkle-left" transform="translate(18, 35)">
          <path
            d="M 0 -4 Q 0 0 4 0 Q 0 0 0 4 Q 0 0 -4 0 Q 0 0 0 -4 Z"
            fill="#45B7FF"
          />
          <circle cx="0" cy="0" r="1.2" fill="#FFFFFF" />
        </g>

        {/* Animated Star Sparkle on Right Rim */}
        <g className="ucl-sparkle-right" transform="translate(68, 26)">
          <path
            d="M 0 -3.5 Q 0 0 3.5 0 Q 0 0 0 3.5 Q 0 0 -3.5 0 Q 0 0 0 -3.5 Z"
            fill="#FFDF00"
          />
          <circle cx="0" cy="0" r="1" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};
