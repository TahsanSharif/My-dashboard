import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, Clock as ClockIcon } from 'lucide-react';
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

  useEffect(() => {
    setTimeData(getCurrentTimeData(location.timezone));

    const interval = setInterval(() => {
      setTimeData(getCurrentTimeData(location.timezone));
    }, 1000);

    return () => clearInterval(interval);
  }, [location.timezone]);

  // Dynamic responsive sizing based on container width
  const isCompact = containerWidth ? containerWidth < 400 : false;
  const isMedium = containerWidth ? containerWidth >= 400 && containerWidth < 680 : false;
  const isLarge = containerWidth ? containerWidth >= 680 : true;
  const isShort = containerHeight ? containerHeight < 240 : false;

  return (
    <div
      id="central-clock-card"
      className={`w-full h-full flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300 ${
        isShort ? 'p-3' : isCompact ? 'p-4' : 'p-6 sm:p-8'
      }`}
      style={{
        color: 'var(--text-primary)',
      }}
    >
      {/* Subtle Ambient Radial Lighting */}
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-30 transition-colors"
        style={{
          backgroundColor: 'var(--accent)',
        }}
      />

      {/* Top tiny label (hidden if very short) */}
      {!isShort && (
        <div className="relative z-10 flex items-center justify-center gap-1.5 mb-1.5">
          <span
            id="desk-clock-label"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase border shadow-2xs hardware-engraved-badge"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
              color: 'var(--accent-text)',
            }}
          >
            <ClockIcon className="w-3 h-3 animate-pulse" />
            <span>Desk Clock</span>
          </span>
        </div>
      )}

      {/* Big Digital Display: HH:MM:SS AM/PM with circular HUD in JARVIS theme */}
      <div
        id="clock-crt-screen"
        className="relative z-10 my-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-xl mx-auto select-none crt-screen-inset"
      >
        {/* Circular HUD element for JARVIS Command Center */}
        <JarvisCircularHud variant="clock" />

        <div className="flex items-baseline justify-center tracking-tight font-mono-numbers flex-wrap gap-1 sm:gap-2 relative z-10">
          <div
            id="clock-time-display"
            className={`font-black font-mono tracking-tight leading-none ${
              isCompact
                ? 'text-3xl xs:text-4xl'
                : isMedium
                ? 'text-4xl sm:text-5xl md:text-6xl'
                : 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl'
            }`}
            style={{ color: 'var(--text-primary)' }}
          >
            {timeData.hours}:{timeData.minutes}
            <span
              className={`font-bold opacity-70 ml-0.5 sm:ml-1 ${
                isCompact ? 'text-xl xs:text-2xl' : isMedium ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
              }`}
              style={{ color: 'var(--accent)' }}
            >
              :{timeData.seconds}
            </span>
          </div>

          {/* AM / PM Badge */}
          <div className="ml-1 sm:ml-2 flex flex-col justify-center">
            <span
              id="clock-ampm-badge"
              className={`font-black px-1.5 sm:px-2 py-0.5 rounded-md border font-mono tracking-wider ${
                isCompact ? 'text-[11px]' : 'text-xs sm:text-sm'
              }`}
              style={{
                backgroundColor: 'var(--accent-soft)',
                borderColor: 'var(--border-color)',
                color: 'var(--accent-text)',
              }}
            >
              {timeData.ampm}
            </span>
          </div>
        </div>
      </div>

      {/* Date line: Day, Month Date */}
      <div
        id="clock-date-display"
        className={`relative z-10 font-bold flex items-center justify-center gap-1.5 ${
          isCompact ? 'text-xs mt-1' : 'text-sm sm:text-base mt-2'
        }`}
        style={{ color: 'var(--text-secondary)' }}
      >
        <Calendar className="w-3.5 h-3.5 opacity-70 shrink-0" />
        <span className="truncate">{timeData.dateString}</span>
      </div>

      {/* Location line */}
      {!isShort && (
        <div
          id="clock-location-display"
          className={`relative z-10 flex items-center justify-center gap-1.5 font-semibold tracking-wide ${
            isCompact ? 'text-[11px] mt-2' : 'text-xs mt-3'
          }`}
          style={{ color: 'var(--text-muted)' }}
        >
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border shadow-2xs max-w-full truncate"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <MapPin className="w-3 h-3 shrink-0" style={{ color: 'var(--accent)' }} />
            <span className="truncate" style={{ color: 'var(--text-primary)' }}>
              {location.city}, {location.country}
            </span>
            {!isCompact && (
              <>
                <span className="opacity-50">|</span>
                <span className="opacity-80 font-mono text-[10px] truncate">
                  {location.timezone.replace('_', ' ')}
                </span>
              </>
            )}
          </div>
        </div>
      )}
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
