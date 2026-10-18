import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, Clock as ClockIcon, Sparkles } from 'lucide-react';
import { LocationSettings } from '../types';
import { JarvisCircularHud } from './JarvisCircularHud';

interface ClockProps {
  location: LocationSettings;
  containerWidth?: number;
  containerHeight?: number;
}

export const Clock: React.FC<ClockProps> = ({
  location,
  containerWidth,
  containerHeight,
}) => {
  const [timeData, setTimeData] = useState(() => getCurrentTimeData(location.timezone));
  const [bgView, setBgView] = useState<'aerial' | 'sky'>(() => {
    try {
      const saved = localStorage.getItem('admission_ucl_clock_bg');
      if (saved === 'sky' || saved === 'aerial') return saved;
    } catch {}
    return 'aerial';
  });

  const toggleBgView = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = bgView === 'aerial' ? 'sky' : 'aerial';
    setBgView(next);
    try {
      localStorage.setItem('admission_ucl_clock_bg', next);
    } catch {}
  };

  useEffect(() => {
    setTimeData(getCurrentTimeData(location.timezone));

    const interval = setInterval(() => {
      setTimeData(getCurrentTimeData(location.timezone));
    }, 1000);

    return () => clearInterval(interval);
  }, [location.timezone]);

  // Dynamic responsive sizing based on container width & height
  const w = containerWidth || 480;
  const h = containerHeight || 280;

  const isVeryShort = h < 180;
  const isShort = h < 220;
  const isCompact = w < 380;
  const isTiny = w < 300;

  // Responsive font sizes calculated dynamically so digits never wrap, overflow, or clip
  const digitFontSizePx = Math.min(
    Math.max(18, Math.round(w / 8.5)),
    Math.max(18, Math.round((h - (isShort ? 35 : 75)) * 0.42)),
    72
  );
  const secondsFontSizePx = Math.max(12, Math.round(digitFontSizePx * 0.52));
  const ampmFontSizePx = Math.max(9, Math.round(digitFontSizePx * 0.28));

  return (
    <div
      id="desk-clock-widget"
      className="matchday-clock-container w-full h-full relative overflow-y-auto overflow-x-hidden min-h-0 flex flex-col justify-start gap-2 transition-all duration-200"
      style={{
        color: 'var(--text-primary)',
        padding: isVeryShort ? '6px 10px' : isShort ? '10px 12px' : '16px',
      }}
    >
      {/* Ambient Clock Card Glassmorphic Stadium Glow - Scope to European Nights */}
      <div
        className="ucl-clock-ambient-glow absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20 transition-opacity duration-500"
        aria-hidden="true"
      >
        <div
          className="absolute -inset-10 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url('${bgView === 'sky' ? '/assets/ucl-clock-sky-bg.jpg' : '/assets/ucl-clock-glass-bg.jpg'}')`,
            filter: 'blur(28px) brightness(0.4) saturate(1.3)',
          }}
        />
      </div>

      {/* Subtle Ambient Radial Lighting */}
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-30 transition-colors"
        style={{
          backgroundColor: 'var(--accent)',
        }}
      />

      {/* Top tiny label & UCL View Toggle (hidden if very short) */}
      {!isVeryShort && (
        <div className="relative z-10 flex items-center justify-center gap-2 mb-1 flex-wrap shrink-0">
          <span
            id="desk-clock-label"
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-2xs hardware-engraved-badge"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
              color: 'var(--accent-text)',
            }}
          >
            <ClockIcon className="w-3 h-3 animate-pulse" />
            <span>Desk Clock</span>
          </span>

          {!isShort && (
            <button
              type="button"
              id="clock-bg-view-toggle-btn"
              onClick={toggleBgView}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase transition-all duration-200 border cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
              title={`Current View: ${bgView === 'aerial' ? 'Aerial Starball Stadium' : 'Starry Night Sky'}. Click to toggle.`}
              aria-label="Toggle UCL Clock Background View"
            >
              <Sparkles className="w-2.5 h-2.5" style={{ color: 'var(--accent)' }} />
              <span>{bgView === 'aerial' ? 'Aerial Dome' : 'Starry Sky'}</span>
            </button>
          )}
        </div>
      )}

      {/* Big Digital Display: HH:MM:SS AM/PM with Non-Clipping Height & Responsive Scaling */}
      <div
        id="clock-crt-screen"
        className="clock-display-panel subboard-bg relative z-10 flex-1 min-h-0 w-full flex flex-col items-center justify-center py-2 max-w-xl mx-auto select-none crt-screen-inset rounded-2xl border"
        style={{
          padding: isVeryShort ? '4px 8px' : isShort ? '6px 12px' : '10px 16px',
          overflow: 'visible',
        }}
      >
        {/* UCL Stadium Glassmorphic Blurry Background Layer - Scoped via CSS exclusively to European Nights */}
        <div
          className="ucl-glass-stadium-layer absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] z-0"
          aria-hidden="true"
        >
          {/* Aerial Stadium View Layer */}
          <div
            className={`absolute -inset-4 bg-cover bg-center transition-opacity duration-700 ease-in-out ${
              bgView === 'aerial' ? 'opacity-85' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url('/assets/ucl-clock-glass-bg.jpg')`,
              filter: 'blur(9px) brightness(0.55) saturate(1.4)',
              transform: 'scale(1.08)',
            }}
          />

          {/* Starry Night Sky Stadium View Layer */}
          <div
            className={`absolute -inset-4 bg-cover bg-center transition-opacity duration-700 ease-in-out ${
              bgView === 'sky' ? 'opacity-85' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url('/assets/ucl-clock-sky-bg.jpg')`,
              filter: 'blur(9px) brightness(0.55) saturate(1.4)',
              transform: 'scale(1.08)',
            }}
          />

          {/* Dark Glassmorphic Frosted Black Overlay for High-Contrast Digital Display */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-slate-950/65 to-black/85 backdrop-blur-md" />

          {/* Stadium Cyan & Magenta Starball Lighting Glow */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_bottom,rgba(69,183,255,0.32)_0%,rgba(168,85,247,0.18)_40%,transparent_75%)]" />
        </div>

        {/* Circular HUD element for JARVIS Command Center */}
        <JarvisCircularHud variant="clock" />

        <div className="flex items-baseline justify-center tracking-tight font-mono-numbers whitespace-nowrap relative z-10 overflow-visible">
          <div
            id="clock-time-display"
            className="clock-digits led-numerals font-black font-mono tracking-tight flex items-baseline justify-center whitespace-nowrap"
            style={{
              color: 'var(--text-primary)',
              fontSize: `${digitFontSizePx}px`,
              lineHeight: 1.05,
              display: 'inline-flex',
            }}
          >
            <span>{timeData.hours}:{timeData.minutes}</span>
            <span
              className="font-bold opacity-75 ml-0.5 sm:ml-1"
              style={{
                color: 'var(--accent)',
                fontSize: `${secondsFontSizePx}px`,
                lineHeight: 1.05,
              }}
            >
              :{timeData.seconds}
            </span>
          </div>

          {/* AM / PM Badge */}
          <div className="ml-1 sm:ml-2 flex flex-col justify-center">
            <span
              id="clock-ampm-badge"
              className="font-black px-1.5 py-0.5 rounded-md border font-mono tracking-wider whitespace-nowrap"
              style={{
                backgroundColor: 'var(--accent-soft)',
                borderColor: 'var(--border-color)',
                color: 'var(--accent-text)',
                fontSize: `${ampmFontSizePx}px`,
              }}
            >
              {timeData.ampm}
            </span>
          </div>
        </div>
      </div>

      {/* Date & Location Footer Tag */}
      <div className="shrink-0 w-full flex flex-col items-center justify-center gap-1 text-xs opacity-80 pt-1 relative z-10">
        <div
          id="clock-date-display"
          className="font-bold flex items-center justify-center gap-1.5 truncate"
          style={{
            color: 'var(--text-secondary)',
            fontSize: isTiny ? '10px' : isCompact ? '11px' : '12px',
          }}
        >
          <Calendar className="w-3 h-3 opacity-70 shrink-0" />
          <span className="truncate">{timeData.dateString}</span>
        </div>

        {!isShort && (
          <div
            id="clock-location-display"
            className="flex items-center justify-center gap-1.5 font-semibold tracking-wide text-[10px] truncate"
            style={{ color: 'var(--text-muted)' }}
          >
            <div
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border shadow-2xs max-w-full truncate"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
              }}
            >
              <MapPin className="w-2.5 h-2.5 shrink-0" style={{ color: 'var(--accent)' }} />
              <span className="truncate" style={{ color: 'var(--text-primary)' }}>
                {location.city}, {location.country}
              </span>
              {!isCompact && (
                <>
                  <span className="opacity-50">|</span>
                  <span className="opacity-80 font-mono text-[9px] truncate">
                    {location.timezone.replace('_', ' ')}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function getCurrentTimeData(timeZone: string) {
  const now = new Date();

  let options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };

  try {
    if (timeZone) options.timeZone = timeZone;
    new Intl.DateTimeFormat('en-US', options).format(now);
  } catch {
    delete options.timeZone;
  }

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(now);

  const hours = parts.find((p) => p.type === 'hour')?.value || '12';
  const minutes = parts.find((p) => p.type === 'minute')?.value || '00';
  const seconds = parts.find((p) => p.type === 'second')?.value || '00';
  const ampm = parts.find((p) => p.type === 'dayPeriod')?.value.toUpperCase() || 'AM';

  let dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };
  if (options.timeZone) dateOptions.timeZone = options.timeZone;

  let dateString = '';
  try {
    dateString = new Intl.DateTimeFormat('en-US', dateOptions).format(now);
  } catch {
    dateString = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }

  return {
    hours,
    minutes,
    seconds,
    ampm,
    dateString,
  };
}
