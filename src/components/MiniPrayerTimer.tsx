import React, { useEffect, useState } from 'react';
import { Compass, Clock, ChevronDown, Moon, Sunrise, Sun, CloudSun, Sunset } from 'lucide-react';
import { LocationSettings, NextPrayerInfo, PrayerTime } from '../types';
import {
  formatRemainingTime,
  formatTime12,
  getNextPrayer,
  getPrayerTimes,
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
  const [prayers, setPrayers] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Responsive breakpoints
  const isCompact = containerWidth ? containerWidth < 360 : false;
  const isWide = containerWidth ? containerWidth >= 520 : false;
  const isShort = containerHeight ? containerHeight < 240 : false;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getPrayerTimes(location)
      .then((data) => {
        if (isMounted) {
          setPrayers(data);
          setNextPrayer(getNextPrayer(data, new Date()));
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [location.city, location.country, location.latitude, location.longitude]);

  // Tick countdown every second
  useEffect(() => {
    if (prayers.length === 0) return;

    const interval = setInterval(() => {
      setNextPrayer(getNextPrayer(prayers, new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, [prayers]);

  const getPrayerIcon = (name: string, className = 'w-4 h-4') => {
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
      className={`w-full h-full flex flex-col justify-between transition-all duration-300 ${
        isShort ? 'p-3' : 'p-4 sm:p-5'
      }`}
      style={{
        color: 'var(--text-primary)',
      }}
    >
      {/* Top Header Badge */}
      <div className="flex items-center justify-between gap-1 mb-1">
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
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full border hardware-engraved-badge"
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
        className={`flex ${isWide ? 'flex-row items-center justify-between gap-4 p-4' : 'flex-col items-center justify-center p-4 sm:p-5 text-center'} my-auto w-full select-none crt-screen-inset`}
      >
        {nextPrayer ? (
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span
                id="mini-prayer-name"
                className={`font-black tracking-tight flex items-center gap-1.5 ${
                  isCompact ? 'text-lg' : 'text-xl sm:text-2xl'
                }`}
                style={{ color: 'var(--accent-text)' }}
              >
                {nextPrayer.name}
              </span>
              <span
                className="font-arabic-calligraphy text-lg opacity-80"
                style={{ color: 'var(--text-secondary)' }}
              >
                {nextPrayer.arabicName}
              </span>
              <span className="text-xs font-semibold opacity-70 ml-1">
                at {nextPrayer.targetTimeFormatted}
              </span>
            </div>

            {/* Countdown Clock */}
            <div
              id="mini-prayer-countdown"
              className={`font-bold font-mono-numbers mt-1 flex items-center gap-2 select-none ${
                isCompact ? 'text-2xl' : 'text-3xl sm:text-4xl'
              }`}
              style={{ color: 'var(--text-primary)' }}
            >
              <Clock className="w-5 h-5 opacity-70 animate-pulse" style={{ color: 'var(--accent)' }} />
              <span>{formatRemainingTime(nextPrayer.remainingSeconds)}</span>
            </div>

            <div className="text-[11px] font-medium mt-0.5 opacity-70">
              Remaining until {nextPrayer.name} prayer
            </div>
          </div>
        ) : (
          <div className="py-2 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            {isLoading ? 'Calculating times...' : 'Checking schedule...'}
          </div>
        )}

        {/* If wide: Show a mini-row of other upcoming prayers */}
        {isWide && prayers.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {prayers.slice(0, 4).map((p) => {
              const isCurrent = nextPrayer?.name === p.name;
              return (
                <div
                  key={p.name}
                  className={`px-2.5 py-1.5 rounded-xl border text-center flex flex-col items-center shrink-0 ${
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

      {/* Quick link to Whole Prayer Timer downwards */}
      <button
        id="btn-view-whole-prayer-schedule"
        type="button"
        onClick={handleScroll}
        className="pt-2 border-t flex items-center justify-between text-[11px] font-bold tracking-wide transition-opacity hover:opacity-100 opacity-80 cursor-pointer mt-auto"
        style={{
          borderColor: 'var(--border-color)',
          color: 'var(--accent-text)',
        }}
      >
        <span>Full Schedule & Fasting Times</span>
        <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
      </button>
    </div>
  );
};
