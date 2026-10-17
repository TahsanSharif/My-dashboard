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
  Star,
} from 'lucide-react';
import { LocationSettings, NextPrayerInfo, PrayerTime } from '../types';
import {
  formatRemainingTime,
  formatTime12,
  getNextPrayer,
  getPrayerTimesSync,
  getTahajjudWindow,
} from '../utils/prayer';

interface PrayerWidgetProps {
  location: LocationSettings;
  onScrollToTop?: () => void;
}

export const PrayerWidget: React.FC<PrayerWidgetProps> = ({
  location,
  onScrollToTop,
}) => {
  const [prayers, setPrayers] = useState<PrayerTime[]>(() =>
    getPrayerTimesSync(location, new Date())
  );
  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo | null>(() =>
    getNextPrayer(getPrayerTimesSync(location, new Date()), new Date())
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  // Instant zero-latency adhan update upon coordinate, division, or juristic method shift
  useEffect(() => {
    const now = new Date();
    const data = getPrayerTimesSync(location, now);
    setPrayers(data);
    setNextPrayer(getNextPrayer(data, now));
    setIsLoading(false);
  }, [location.city, location.country, location.latitude, location.longitude, location.juristicMethod]);

  // Tick countdown and time every second, with automatic midnight date rollover
  useEffect(() => {
    let lastDay = new Date().getDate();
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

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

  const getPrayerIcon = (name: string) => {
    switch (name) {
      case 'Tahajjud':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
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

  const nowMs = currentTime.getTime();
  const tahajjudPrayer = prayers.find((p) => p.name === 'Tahajjud');
  const fajrPrayer = prayers.find((p) => p.name === 'Fajr');
  const maghribPrayer = prayers.find((p) => p.name === 'Maghrib');

  const tahajjudWindow = tahajjudPrayer && fajrPrayer
    ? getTahajjudWindow(tahajjudPrayer.time, fajrPrayer.time, currentTime)
    : { isActiveNow: false, startFormatted: '--:--', endFormatted: '--:--' };

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
              className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2"
              style={{ color: 'var(--text-primary)' }}
            >
              <span>Complete Daily Prayer Times & Schedule</span>
              <span className="hidden sm:inline-flex text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border bg-purple-500/10 border-purple-500/30 text-purple-300">
                + TAHAJJUD INCLUDED
              </span>
            </h3>
            <p
              className="text-xs font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              {location.city}, {location.country} • Karachi Method ({location.juristicMethod === 'shafi' ? "Shafi'i Asr" : 'Hanafi Asr'}) • Sunnah Night Vigil
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
            <div className="flex items-baseline justify-center md:justify-start gap-3 mt-1 flex-wrap">
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

      {/* Dedicated Tahajjud Night Vigil Banner / Row */}
      {tahajjudPrayer && (
        <div
          id="tahajjud-dedicated-card"
          className="mb-5 p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.16) 0%, rgba(30, 27, 75, 0.32) 50%, rgba(15, 23, 42, 0.45) 100%)',
            borderColor: 'rgba(168, 85, 247, 0.35)',
          }}
        >
          <div className="flex items-start sm:items-center gap-3.5 w-full md:w-auto">
            <div className="p-3 rounded-2xl border bg-purple-950/50 border-purple-500/40 text-purple-300 shrink-0 shadow-inner">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full border bg-purple-500/20 border-purple-500/40 text-purple-300 font-mono">
                  VOLUNTARY / SUNNAH
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border bg-indigo-950/60 border-indigo-500/30 text-indigo-300">
                  NIGHT PRAYER · LAST THIRD
                </span>
                {tahajjudWindow.isActiveNow && (
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full border bg-emerald-500/20 border-emerald-500/50 text-emerald-300 animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    ACTIVE WINDOW NOW
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <h4 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Tahajjud & Qiyam al-Layl</span>
                  <span className="font-arabic-calligraphy text-base text-purple-300 opacity-90">التهجد</span>
                </h4>
                <p className="text-xs text-slate-300 font-medium">
                  {tahajjudWindow.isActiveNow
                    ? 'Current peak hours for spiritual clarity, sincere Dua & study barakah'
                    : 'The most virtuous voluntary prayer, observed in the final third of the night prior to Fajr'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-purple-500/20 shrink-0">
            <div className="text-left md:text-right">
              <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-purple-300/80">
                PRAYER WINDOW
              </div>
              <div className="text-lg sm:text-xl font-black font-mono-numbers text-white flex items-center gap-1.5">
                <span>{formatTime12(tahajjudPrayer.time)}</span>
                <span className="text-xs text-purple-300/70 font-normal">until</span>
                <span className="text-sm font-bold text-amber-300">
                  {fajrPrayer ? formatTime12(fajrPrayer.time) : '--:--'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of all 7 prayer times (Tahajjud, Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 pt-1">
        {prayers.map((p) => {
          const isCurrentNext = nextPrayer?.name === p.name;
          const hasPassed = p.timestamp < nowMs;
          const isTahajjud = p.name === 'Tahajjud';

          return (
            <div
              key={p.name}
              className={`p-3.5 rounded-2xl border flex flex-col items-center justify-between text-center transition-all ${
                isCurrentNext ? 'ring-2 scale-[1.02] shadow-sm' : ''
              } ${isTahajjud ? 'bg-purple-950/20 border-purple-500/35 hover:border-purple-400' : ''} ${
                hasPassed ? 'opacity-70' : 'opacity-100'
              }`}
              style={{
                backgroundColor: isCurrentNext
                  ? 'var(--accent-soft)'
                  : isTahajjud
                  ? 'rgba(88, 28, 135, 0.12)'
                  : 'var(--bg-card-subtle)',
                borderColor: isCurrentNext
                  ? 'var(--accent)'
                  : isTahajjud
                  ? 'rgba(168, 85, 247, 0.35)'
                  : 'var(--border-color)',
              }}
            >
              <div className="w-full flex items-center justify-between mb-2">
                {getPrayerIcon(p.name)}
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md border"
                  style={{
                    backgroundColor: isTahajjud
                      ? 'rgba(168, 85, 247, 0.2)'
                      : isCurrentNext
                      ? 'var(--accent)'
                      : 'var(--bg-card)',
                    borderColor: isTahajjud
                      ? 'rgba(168, 85, 247, 0.45)'
                      : 'var(--border-color)',
                    color: isTahajjud
                      ? '#d8b4fe'
                      : isCurrentNext
                      ? '#ffffff'
                      : 'var(--text-muted)',
                  }}
                  title={isTahajjud ? 'Voluntary Night Prayer (Sunnah)' : undefined}
                >
                  {isTahajjud ? 'Sunnah' : isCurrentNext ? 'Next' : hasPassed ? 'Passed' : 'Fard'}
                </span>
              </div>

              <div className="my-1">
                <div
                  className="text-xs font-black tracking-wider uppercase flex items-center justify-center gap-1"
                  style={{
                    color: isTahajjud
                      ? '#c084fc'
                      : isCurrentNext
                      ? 'var(--accent-text)'
                      : 'var(--text-secondary)',
                  }}
                >
                  <span>{p.name}</span>
                </div>
                <div
                  className="font-arabic-calligraphy text-base opacity-75 leading-tight my-0.5"
                  style={{ color: isTahajjud ? '#d8b4fe' : 'var(--text-muted)' }}
                >
                  {p.arabicName}
                </div>
              </div>

              <div
                className="text-base sm:text-lg font-black font-mono-numbers mt-1"
                style={{ color: isTahajjud ? '#f3e8ff' : 'var(--text-primary)' }}
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
            <strong>Fasting & Prayer Milestones:</strong> Tahajjud starts at {tahajjudPrayer ? formatTime12(tahajjudPrayer.time) : '--'} • Suhoor/Imsak ends at Fajr ({fajrPrayer ? formatTime12(fajrPrayer.time) : '--'}) • Iftar begins at Maghrib ({maghribPrayer ? formatTime12(maghribPrayer.time) : '--'})
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
          <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
          <span>Tahajjud & prayer bring peace, discipline, and barakah in study.</span>
        </div>
      </div>
    </div>
  );
};
