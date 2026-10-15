import React from 'react';

interface JarvisCircularHudProps {
  variant: 'clock' | 'timer';
  phase?: 'study' | 'shortBreak' | 'longBreak';
  isRunning?: boolean;
}

export const JarvisCircularHud: React.FC<JarvisCircularHudProps> = ({
  variant,
  phase = 'study',
  isRunning = false,
}) => {
  const isBreak = phase === 'shortBreak' || phase === 'longBreak';
  const primaryColor = isBreak ? '#FFB94D' : '#00E5FF';
  const secondaryColor = isBreak ? '#F59E0B' : '#0077FE';
  const glowId = `jarvis-grad-${variant}-${phase}`;

  return (
    <div
      className="jarvis-circular-hud-container absolute inset-0 pointer-events-none select-none overflow-hidden items-center justify-center z-0"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 340 340"
        className={`w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] max-w-full max-h-full transition-all duration-700 opacity-60 ${
          isRunning ? 'scale-105 opacity-85' : 'scale-100'
        }`}
        style={{ filter: `drop-shadow(0 0 14px ${primaryColor}40)` }}
      >
        <defs>
          <linearGradient id={glowId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.25" />
          </linearGradient>
          <radialGradient id={`jarvis-core-${variant}-${phase}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity={isRunning ? 0.22 : 0.08} />
            <stop offset="70%" stopColor={secondaryColor} stopOpacity="0.02" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Central Core Ambient Reactor Glow */}
        <circle cx="170" cy="170" r="148" fill={`url(#jarvis-core-${variant}-${phase})`} />

        {/* Outer Fine Calibration Ring */}
        <circle
          cx="170"
          cy="170"
          r="158"
          fill="none"
          stroke={primaryColor}
          strokeWidth="0.8"
          strokeOpacity="0.3"
          strokeDasharray="4 4"
        />

        {/* Outer Rotating Segmented HUD Arc */}
        <g className="origin-center animate-[spin_50s_linear_infinite]">
          <circle
            cx="170"
            cy="170"
            r="148"
            fill="none"
            stroke={`url(#${glowId})`}
            strokeWidth="1.5"
            strokeDasharray="35 15 65 15 12 25"
          />
          {/* Cardinal Orbit Markers */}
          <circle cx="170" cy="22" r="2.5" fill={primaryColor} />
          <circle cx="318" cy="170" r="2.5" fill={primaryColor} />
          <circle cx="170" cy="318" r="2.5" fill={primaryColor} />
          <circle cx="22" cy="170" r="2.5" fill={primaryColor} />
        </g>

        {/* Counter-Rotating Mid Tech Reticle */}
        <g className="origin-center animate-[spin_32s_linear_infinite_reverse]">
          <circle
            cx="170"
            cy="170"
            r="132"
            fill="none"
            stroke={primaryColor}
            strokeWidth="1"
            strokeOpacity="0.45"
            strokeDasharray="10 8 3 8"
          />
          {/* Angular Ticks */}
          <line x1="170" y1="30" x2="170" y2="40" stroke={primaryColor} strokeWidth="1.5" strokeOpacity="0.75" />
          <line x1="170" y1="300" x2="170" y2="310" stroke={primaryColor} strokeWidth="1.5" strokeOpacity="0.75" />
          <line x1="30" y1="170" x2="40" y2="170" stroke={primaryColor} strokeWidth="1.5" strokeOpacity="0.75" />
          <line x1="300" y1="170" x2="310" y2="170" stroke={primaryColor} strokeWidth="1.5" strokeOpacity="0.75" />
        </g>

        {/* Inner Reactor Ring */}
        <circle
          cx="170"
          cy="170"
          r="114"
          fill="none"
          stroke={primaryColor}
          strokeWidth="0.75"
          strokeOpacity="0.3"
        />

        {/* Corner HUD Brackets for Command Center feel */}
        <path
          d="M 52 68 L 42 68 L 42 78"
          fill="none"
          stroke={primaryColor}
          strokeWidth="1.2"
          strokeOpacity="0.65"
        />
        <path
          d="M 288 68 L 298 68 L 298 78"
          fill="none"
          stroke={primaryColor}
          strokeWidth="1.2"
          strokeOpacity="0.65"
        />
        <path
          d="M 52 272 L 42 272 L 42 262"
          fill="none"
          stroke={primaryColor}
          strokeWidth="1.2"
          strokeOpacity="0.65"
        />
        <path
          d="M 288 272 L 298 272 L 298 262"
          fill="none"
          stroke={primaryColor}
          strokeWidth="1.2"
          strokeOpacity="0.65"
        />

        {/* Micro Telemetry Text */}
        <text
          x="170"
          y="52"
          textAnchor="middle"
          fill={primaryColor}
          fontSize="6.5"
          fontFamily="monospace"
          fontWeight="bold"
          letterSpacing="2"
          opacity="0.65"
        >
          {variant === 'clock' ? 'STARK CHRONO // HUD.01' : isRunning ? 'ARC REACTOR // ONLINE' : 'HUD CALIBRATED // READY'}
        </text>

        <text
          x="170"
          y="292"
          textAnchor="middle"
          fill={primaryColor}
          fontSize="6"
          fontFamily="monospace"
          fontWeight="bold"
          letterSpacing="1.5"
          opacity="0.55"
        >
          {variant === 'clock' ? 'TIME SYSTEM UTC+6' : phase.toUpperCase()}
        </text>
      </svg>
    </div>
  );
};
