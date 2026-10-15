import { LocationSettings, NextPrayerInfo, PrayerTime } from '../types';

/**
 * Astronomical Solar Calculation for Muslim Prayer Times
 * Used as an instant, zero-latency, 100% offline-resilient computation engine.
 */

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180.0;
}

function radToDeg(rad: number): number {
  return (rad * 180.0) / Math.PI;
}

function fixHour(hour: number): number {
  let a = hour - 24.0 * Math.floor(hour / 24.0);
  return a < 0 ? a + 24.0 : a;
}

function fixAngle(angle: number): number {
  let a = angle - 360.0 * Math.floor(angle / 360.0);
  return a < 0 ? a + 360.0 : a;
}

// Calculate astronomical position for Julian day
function getSunPosition(julianDate: number) {
  const D = julianDate - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * Math.sin(degToRad(g)) + 0.02 * Math.sin(degToRad(2 * g)));
  const e = 23.439 - 0.00000036 * D;
  const d = radToDeg(Math.asin(Math.sin(degToRad(e)) * Math.sin(degToRad(L))));
  let RA = radToDeg(Math.atan2(Math.cos(degToRad(e)) * Math.sin(degToRad(L)), Math.cos(degToRad(L)))) / 15.0;
  RA = fixHour(RA);
  const EqT = q / 15.0 - RA;
  return { declination: d, equationOfTime: EqT };
}

function getJulianDate(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Time when sun reaches a given angle below/above horizon
function computeTime(
  angle: number,
  declination: number,
  latitude: number,
  direction: 'ccw' | 'cw'
): number {
  const dRad = degToRad(declination);
  const latRad = degToRad(latitude);
  const cosH =
    (-Math.sin(degToRad(angle)) - Math.sin(latRad) * Math.sin(dRad)) /
    (Math.cos(latRad) * Math.cos(dRad));

  if (cosH < -1 || cosH > 1) {
    return 0; // Extreme latitude fallback
  }

  const H = radToDeg(Math.acos(cosH)) / 15.0;
  return direction === 'ccw' ? -H : H;
}

// Asr calculation (Shafi/Hanafi factor)
function computeAsrTime(factor: number, declination: number, latitude: number): number {
  const dRad = degToRad(declination);
  const latRad = degToRad(latitude);
  const angle = -radToDeg(
    Math.atan(1 / (factor + Math.tan(Math.abs(latRad - dRad))))
  );
  return computeTime(angle, declination, latitude, 'cw');
}

export function calculateLocalPrayerTimes(
  date: Date,
  location: LocationSettings,
  isHanafi: boolean = true
): Record<'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha', string> {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jd = getJulianDate(year, month, day);
  const { declination, equationOfTime } = getSunPosition(jd);

  // Timezone offset in hours
  const timezoneOffset = -date.getTimezoneOffset() / 60; // local browser or custom
  const noon = fixHour(12 + timezoneOffset - location.longitude / 15.0 - equationOfTime);

  // University of Islamic Sciences, Karachi method (standard in Bangladesh & subcontinent):
  // Fajr: 18.0°, Isha: 18.0°
  const fajrDiff = computeTime(18.0, declination, location.latitude, 'ccw');
  const sunriseDiff = computeTime(0.833, declination, location.latitude, 'ccw');
  const asrDiff = computeAsrTime(isHanafi ? 2 : 1, declination, location.latitude);
  const maghribDiff = computeTime(0.833, declination, location.latitude, 'cw');
  const ishaDiff = computeTime(18.0, declination, location.latitude, 'cw');

  const formatTime = (hoursFloat: number): string => {
    const fixed = fixHour(hoursFloat);
    const h = Math.floor(fixed);
    const m = Math.floor((fixed - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return {
    Fajr: formatTime(noon + fajrDiff),
    Sunrise: formatTime(noon + sunriseDiff),
    Dhuhr: formatTime(noon),
    Asr: formatTime(noon + asrDiff),
    Maghrib: formatTime(noon + maghribDiff),
    Isha: formatTime(noon + ishaDiff),
  };
}

/**
 * Arabic names and meta for prayers
 */
export const PRAYER_NAMES: Record<
  string,
  { label: string; arabic: string; desc: string }
> = {
  Fajr: { label: 'Fajr', arabic: 'الفجر', desc: 'Dawn prayer' },
  Sunrise: { label: 'Sunrise', arabic: 'الشروق', desc: 'Shurooq' },
  Dhuhr: { label: 'Dhuhr', arabic: 'الظهر', desc: 'Midday prayer' },
  Asr: { label: 'Asr', arabic: 'العصر', desc: 'Afternoon prayer' },
  Maghrib: { label: 'Maghrib', arabic: 'المغرب', desc: 'Sunset prayer' },
  Isha: { label: 'Isha', arabic: 'العشاء', desc: 'Night prayer' },
};

/**
 * Tries fetching from Aladhan API with caching, falling back to local calculation
 */
export async function getPrayerTimes(
  location: LocationSettings,
  date: Date = new Date()
): Promise<PrayerTime[]> {
  const dateStr = date.toISOString().split('T')[0];
  const cacheKey = `prayer_times_${location.city}_${dateStr}`;

  // Check cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return convertToPrayerTimeObjects(parsed, date);
    }
  } catch {
    // ignore
  }

  // Attempt API fetch
  let times: Record<string, string> | null = null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
      location.city
    )}&country=${encodeURIComponent(location.country)}&method=1`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (data && data.data && data.data.timings) {
        const t = data.data.timings;
        times = {
          Fajr: cleanApiTime(t.Fajr),
          Sunrise: cleanApiTime(t.Sunrise),
          Dhuhr: cleanApiTime(t.Dhuhr),
          Asr: cleanApiTime(t.Asr),
          Maghrib: cleanApiTime(t.Maghrib),
          Isha: cleanApiTime(t.Isha),
        };
        try {
          localStorage.setItem(cacheKey, JSON.stringify(times));
        } catch {
          // ignore storage error
        }
      }
    }
  } catch {
    // API failed, fallback to local astronomical formula
  }

  if (!times) {
    times = calculateLocalPrayerTimes(date, location);
  }

  return convertToPrayerTimeObjects(times, date);
}

function cleanApiTime(val: string): string {
  if (!val) return '00:00';
  // e.g. "04:35 (BST)" -> "04:35"
  return val.split(' ')[0].slice(0, 5);
}

function convertToPrayerTimeObjects(
  times: Record<string, string>,
  baseDate: Date
): PrayerTime[] {
  const list: ('Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha')[] = [
    'Fajr',
    'Sunrise',
    'Dhuhr',
    'Asr',
    'Maghrib',
    'Isha',
  ];

  return list.map((name) => {
    const timeStr = times[name] || '12:00';
    const [h, m] = timeStr.split(':').map(Number);
    const prayerDate = new Date(baseDate);
    prayerDate.setHours(h, m, 0, 0);

    return {
      name,
      arabicName: PRAYER_NAMES[name]?.arabic || '',
      time: timeStr,
      timestamp: prayerDate.getTime(),
    };
  });
}

/**
 * Determines the Next Prayer and countdown in seconds
 */
export function getNextPrayer(prayers: PrayerTime[], now: Date = new Date()): NextPrayerInfo {
  const currentMs = now.getTime();

  // Find the first prayer today whose timestamp is greater than now
  for (const prayer of prayers) {
    if (prayer.timestamp > currentMs) {
      const diffSec = Math.floor((prayer.timestamp - currentMs) / 1000);
      return {
        name: prayer.name,
        arabicName: prayer.arabicName,
        remainingSeconds: diffSec,
        targetTimeFormatted: formatTime12(prayer.time),
      };
    }
  }

  // If all prayers today have passed, the next prayer is Fajr tomorrow
  const fajr = prayers[0];
  const tomorrowFajrMs = (fajr ? fajr.timestamp : currentMs) + 24 * 60 * 60 * 1000;
  const diffSec = Math.max(0, Math.floor((tomorrowFajrMs - currentMs) / 1000));

  return {
    name: 'Fajr (Tomorrow)',
    arabicName: PRAYER_NAMES.Fajr.arabic,
    remainingSeconds: diffSec,
    targetTimeFormatted: fajr ? formatTime12(fajr.time) : '--:--',
  };
}

export function formatTime12(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export function formatRemainingTime(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
