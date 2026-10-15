import React, { useEffect, useState } from 'react';
import {
  Compass,
  Moon,
  Sun,
  Sunset,
  Sunrise as SunriseIcon,
  CloudSun,
  Clock,
  Sparkles,
  ArrowUp,
  Info,
} from 'lucide-react';
import { LocationSettings, NextPrayerInfo, PrayerTime } from '../types';
import {
  formatRemainingTime,
  formatTime12,
  getNextPrayer,
  getPrayerTimes,
} from '../utils/prayer';

interface PrayerWidgetProps {
  location: LocationSettings;
  onScrollToTop?: () => void;
}

export const PrayerWidget: React.FC<PrayerWidgetProps> = ({
  location,
  onScrollToTop,
}) => {
  const [prayers, setPrayers] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load prayer times
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    getPrayerTimes(location)
      .then((data) => {
        if (mounted) {
          setPrayers(data);
          setNextPrayer(getNextPrayer(data, new Date()));
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
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

  const getPrayerIcon = (name: string) => {
    switch (name) {
      case 'Fajr':
        return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'Sunrise':
        return <SunriseIcon className="w-5 h-5 text-amber-500" />;
      case 'Dhuhr':
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'Asr':
        return <CloudSun className="w-5 h-5 text-orange-400" />;
      case 'Maghrib':
        return <Sunset className="w-5 h-5 text-rose-500" />;
      case 'Isha':
        return <Moon className="w-5 h-5 text-blue-400" />;
      default:
        return <Compass className="w-5 h-5 text-emerald-400" />;
    }
  };

  const scrollToTop = () => {
    if (onScrollToTop) {
      onScrollToTop();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nowMs = Date.now();

  return (
    <div
      id="prayer-widget-card"
      className="w-full p-6 sm:p-8 rounded-3xl border shadow-lg relative overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-2xl border shadow-2xs"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <Compass className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h3
              className="text-base sm:text-lg font-black tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Complete Daily Prayer Times & Schedule
            </h3>
            <p
              className="text-xs font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              {location.city}, {location.country} • Karachi Method (Hanafi Asr)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold tracking-wide transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
            title="Scroll back up to study desk"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Top of Desk</span>
          </button>
        </div>
      </div>

      {/* Hero Next Prayer Countdown Card */}
      <div
        id="next-prayer-banner"
        className="my-5 p-5 sm:p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 crt-screen-inset"
        style={{
          backgroundColor: 'var(--bg-card-subtle)',
          borderColor: 'var(--border-highlight)',
        }}
      >
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span
              id="prayer-schedule-upcoming-badge"
              className="text-xs font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded-full border hardware-engraved-badge"
              style={{
                backgroundColor: 'var(--accent-soft)',
                borderColor: 'var(--border-color)',
                color: 'var(--accent-text)',
              }}
            >
              UPCOMING PRAYER
            </span>
          </div>

          {nextPrayer ? (
            <div className="flex items-baseline justify-center md:justify-start gap-3 mt-1">
              <span
                id="next-prayer-name"
                className="text-3xl sm:text-4xl font-black tracking-tight"
                style={{ color: 'var(--accent-text)' }}
              >
                {nextPrayer.name}
              </span>
              <span
                className="font-arabic-calligraphy text-2xl opacity-80"
                style={{ color: 'var(--text-secondary)' }}
              >
                {nextPrayer.arabicName}
              </span>
              <span
                className="text-sm font-semibold ml-1"
                style={{ color: 'var(--text-muted)' }}
              >
                at {nextPrayer.targetTimeFormatted}
              </span>
            </div>
          ) : (
            <div className="py-2 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              {isLoading ? 'Calculating astronomical prayer times...' : 'Verifying times...'}
            </div>
          )}
        </div>

        {/* Live Countdown Display */}
        {nextPrayer && (
          <div
            id="next-prayer-countdown"
            className="flex flex-col items-center md:items-end font-mono-numbers"
          >
            <span className="text-xs font-bold tracking-wider uppercase opacity-75 mb-0.5" style={{ color: 'var(--text-muted)' }}>
              TIME REMAINING
            </span>
            <div
              className="text-3xl sm:text-4xl font-black flex items-center gap-2 select-none"
              style={{ color: 'var(--text-primary)' }}
            >
              <Clock className="w-6 h-6 animate-pulse" style={{ color: 'var(--accent)' }} />
              <span>{formatRemainingTime(nextPrayer.remainingSeconds)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Grid of all 6 prayer times */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
        {prayers.map((p) => {
          const isCurrentNext = nextPrayer?.name === p.name;
          const hasPassed = p.timestamp < nowMs;

          return (
            <div
              key={p.name}
              className={`p-3.5 rounded-2xl border flex flex-col items-center justify-between text-center transition-all ${
                isCurrentNext ? 'ring-2 scale-[1.02] shadow-sm' : ''
              } ${hasPassed ? 'opacity-70' : 'opacity-100'}`}
              style={{
                backgroundColor: isCurrentNext ? 'var(--accent-soft)' : 'var(--bg-card-subtle)',
                borderColor: isCurrentNext ? 'var(--accent)' : 'var(--border-color)',
              }}
            >
              <div className="w-full flex items-center justify-between mb-2">
                {getPrayerIcon(p.name)}
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border"
                  style={{
                    backgroundColor: isCurrentNext ? 'var(--accent)' : 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    color: isCurrentNext ? '#ffffff' : 'var(--text-muted)',
                  }}
                >
                  {isCurrentNext ? 'Next' : hasPassed ? 'Passed' : 'Upcoming'}
                </span>
              </div>

              <div className="my-1">
                <div
                  className="text-xs font-black tracking-wider uppercase"
                  style={{ color: isCurrentNext ? 'var(--accent-text)' : 'var(--text-secondary)' }}
                >
                  {p.name}
                </div>
                <div
                  className="font-arabic-calligraphy text-base opacity-75 leading-tight my-0.5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {p.arabicName}
                </div>
              </div>

              <div
                className="text-base sm:text-lg font-black font-mono-numbers mt-1"
                style={{ color: 'var(--text-primary)' }}
              >
                {formatTime12(p.time)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Spiritual & Study Milestones */}
      <div
        className="mt-6 p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
        style={{
          backgroundColor: 'var(--bg-card-subtle)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-secondary)',
        }}
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-accent" />
          <span>
            <strong>Student Fasting Times:</strong> Suhoor/Imsak ends at Fajr ({prayers[0] ? formatTime12(prayers[0].time) : '--'}) • Iftar begins at Maghrib ({prayers[4] ? formatTime12(prayers[4].time) : '--'})
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
          <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
          <span>Prayer gives clarity, discipline, and barakah in study.</span>
        </div>
      </div>
    </div>
  );
};
