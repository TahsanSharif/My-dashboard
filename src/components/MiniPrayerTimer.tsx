import React, { useEffect, useState } from 'react';
import { Compass, Clock, ChevronDown, Moon, Sunrise, Sun, CloudSun, Sunset, Sparkles } from 'lucide-react';
import { LocationSettings, NextPrayerInfo, PrayerTime } from '../types';
import {
  formatRemainingTime,
  formatTime12,
  getNextPrayer,
  getPrayerTimesSync,
} from '../utils/prayer';

interface MiniPrayerTimerProps {
  location: LocationSettings;
  containerWidth?: number;
  containerHeight?: number;
  onScrollToFull?: () => void;
}

export const MiniPrayerTimer: React.FC<MiniPrayerTimerProps> = ({
  location,
  containerWidth,
  containerHeight,
  onScrollToFull,
}) => {
  const [prayers, setPrayers] = useState<PrayerTime[]>(() =>
    getPrayerTimesSync(location, new Date())
  );
  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo | null>(() =>
    getNextPrayer(getPrayerTimesSync(location, new Date()), new Date())
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Responsive sizing based on container dimensions
  const w = containerWidth || 360;
  const h = containerHeight || 260;

  const isVeryShort = h < 180;
  const isShort = h < 220;
  const isCompact = w < 360;
  const isWide = w >= 520 && h >= 220;

  // Responsive font sizes calculated dynamically
  const countdownFontSizePx = Math.min(
    Math.max(16, Math.round(w / 11)),
    Math.max(16, Math.round((h - (isShort ? 35 : 65)) * 0.28)),
    36
  );
  const nameFontSizePx = Math.min(
    Math.max(13, Math.round(w / 16)),
    Math.max(13, Math.round((h - (isShort ? 35 : 65)) * 0.18)),
    24
  );

  // Zero-latency update upon coordinate, division, or juristic method change
  useEffect(() => {
    const now = new Date();
    const data = getPrayerTimesSync(location, now);
    setPrayers(data);
    setNextPrayer(getNextPrayer(data, now));
    setIsLoading(false);
  }, [location.city, location.country, location.latitude, location.longitude, location.juristicMethod]);

  // Tick countdown every second with automatic midnight rollover
  useEffect(() => {
    let lastDay = new Date().getDate();
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getDate() !== lastDay) {
        lastDay = now.getDate();
        const fresh = getPrayerTimesSync(location, now);
        setPrayers(fresh);
        setNextPrayer(getNextPrayer(fresh, now));
      } else if (prayers.length > 0) {
        setNextPrayer(getNextPrayer(prayers, now));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [location, prayers]);

  const getPrayerIcon = (name: string, className = 'w-4 h-4') => {
    if (name.includes('Tahajjud')) return <Sparkles className={`${className} text-purple-400`} />;
    if (name.includes('Fajr')) return <Moon className={`${className} text-indigo-400`} />;
    if (name.includes('Sunrise')) return <Sunrise className={`${className} text-amber-500`} />;
    if (name.includes('Dhuhr')) return <Sun className={`${className} text-yellow-500`} />;
    if (name.includes('Asr')) return <CloudSun className={`${className} text-orange-400`} />;
    if (name.includes('Maghrib')) return <Sunset className={`${className} text-rose-500`} />;
    if (name.includes('Isha')) return <Moon className={`${className} text-blue-400`} />;
    return <Compass className={`${className} text-emerald-400`} />;
  };

  const handleScroll = () => {
    if (onScrollToFull) {
      onScrollToFull();
    } else {
      const el = document.getElementById('whole-prayer-schedule');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      id="corner-prayer-widget"
      className="w-full h-full relative overflow-y-auto overflow-x-hidden min-h-0 transition-all duration-200 flex flex-col justify-start gap-2"
      style={{
        color: 'var(--text-primary)',
        padding: isVeryShort ? '8px 10px' : isShort ? '10px 12px' : '14px 16px',
      }}
    >
      {/* Top Header Badge */}
      <div className="flex items-center justify-between gap-1 shrink-0">
        <div className="flex items-center gap-1.5">
          <div
            className="p-1 rounded-lg border shadow-2xs"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            {nextPrayer ? getPrayerIcon(nextPrayer.name, 'w-3.5 h-3.5') : <Compass className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />}
          </div>
          <span
            id="mini-prayer-hardware-badge"
            className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded border hardware-engraved-badge"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-muted)',
            }}
          >
            UPCOMING PRAYER
          </span>
        </div>

        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full border hardware-engraved-badge truncate max-w-[130px]"
          style={{
            backgroundColor: 'var(--bg-card-subtle)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
        >
          {location.city}
        </span>
      </div>

      {/* Main Prayer & Countdown Section */}
      <div
        id="mini-prayer-crt-screen"
        className={`flex-1 min-h-0 w-full flex ${isWide ? 'flex-row items-center justify-between gap-3 p-2' : 'flex-col items-center justify-center py-2 px-3 text-center'} select-none crt-screen-inset relative overflow-hidden rounded-2xl border`}
      >
        {/* UCL Stadium Glassmorphic Blurry Background Layer - Scoped exclusively to European Nights */}
        <div
          className="ucl-glass-stadium-layer absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] z-0"
          aria-hidden="true"
        >
          <div
            className="absolute -inset-4 bg-cover bg-center"
            style={{
              backgroundImage: `url('/assets/ucl-clock-glass-bg.jpg')`,
              filter: 'blur(9px) brightness(0.52) saturate(1.4)',
              transform: 'scale(1.08)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-slate-950/65 to-black/85 backdrop-blur-md" />
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_bottom,rgba(69,183,255,0.25)_0%,rgba(168,85,247,0.12)_40%,transparent_75%)]" />
        </div>

        {nextPrayer ? (
          <div className="flex flex-col items-center justify-center relative z-10 w-full min-w-0">
            <div className="flex items-baseline justify-center gap-1.5 flex-wrap">
              <span
                id="mini-prayer-name"
                className="font-black tracking-tight whitespace-nowrap"
                style={{
                  color: 'var(--accent-text)',
                  fontSize: `${nameFontSizePx}px`,
                }}
              >
                {nextPrayer.name}
              </span>
              <span
                className="font-arabic-calligraphy opacity-80 whitespace-nowrap"
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: `${Math.max(13, Math.round(nameFontSizePx * 0.9))}px`,
                }}
              >
                {nextPrayer.arabicName}
              </span>
              <span
                className="font-semibold opacity-70 whitespace-nowrap"
                style={{
                  fontSize: `${Math.max(10, Math.round(nameFontSizePx * 0.55))}px`,
                }}
              >
                at {nextPrayer.targetTimeFormatted}
              </span>
            </div>

            {/* Countdown Clock */}
            <div
              id="mini-prayer-countdown"
              className="font-bold font-mono-numbers mt-1 flex items-center justify-center gap-1.5 select-none whitespace-nowrap"
              style={{
                color: 'var(--text-primary)',
                fontSize: `${countdownFontSizePx}px`,
              }}
            >
              <Clock
                className="opacity-70 animate-pulse shrink-0"
                style={{
                  color: 'var(--accent)',
                  width: `${Math.max(14, Math.round(countdownFontSizePx * 0.6))}px`,
                  height: `${Math.max(14, Math.round(countdownFontSizePx * 0.6))}px`,
                }}
              />
              <span>{formatRemainingTime(nextPrayer.remainingSeconds)}</span>
            </div>

            {!isVeryShort && (
              <div
                className="font-medium mt-0.5 opacity-70 truncate max-w-full"
                style={{
                  fontSize: `${Math.max(9, Math.round(nameFontSizePx * 0.5))}px`,
                }}
              >
                Remaining until {nextPrayer.name}
              </div>
            )}
          </div>
        ) : (
          <div className="py-2 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            {isLoading ? 'Calculating times...' : 'Checking schedule...'}
          </div>
        )}

        {/* If wide: Show a mini-row of other upcoming prayers */}
        {isWide && prayers.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 relative z-10 shrink-0">
            {prayers.slice(0, 4).map((p) => {
              const isCurrent = nextPrayer?.name === p.name;
              return (
                <div
                  key={p.name}
                  className={`px-2 py-1 rounded-xl border text-center flex flex-col items-center shrink-0 ${
                    isCurrent ? 'ring-1' : 'opacity-80'
                  }`}
                  style={{
                    backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-card-subtle)',
                    borderColor: isCurrent ? 'var(--accent)' : 'var(--border-color)',
                  }}
                >
                  <span className="text-[9px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>
                    {p.name}
                  </span>
                  <span className="text-xs font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
                    {formatTime12(p.time)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Schedule Button (Natural flow with border, no artificial mt-auto force) */}
      <button
        id="btn-view-whole-prayer-schedule"
        type="button"
        onClick={handleScroll}
        className="shrink-0 w-full pt-1.5 border-t flex items-center justify-between font-bold tracking-wide transition-opacity hover:opacity-100 opacity-80 cursor-pointer mt-1"
        style={{
          borderColor: 'var(--border-color)',
          color: 'var(--accent-text)',
          fontSize: isCompact ? '10px' : '11px',
        }}
      >
        <span>Full Schedule & Fasting Times</span>
        <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
      </button>
    </div>
  );
};
