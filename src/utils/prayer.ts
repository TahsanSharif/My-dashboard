import {
  Coordinates,
  CalculationMethod,
  Madhab,
  PrayerTimes,
} from 'adhan';
import { LocationSettings, NextPrayerInfo, PrayerName, PrayerTime } from '../types';

/**
 * Bangladesh 8 Administrative Divisions & Astronomical Coordinates
 */
export interface BDDivision {
  name: string;
  bnName: string;
  lat: number;
  lng: number;
  timezone: string;
}

export const BD_DIVISIONS: BDDivision[] = [
  { name: 'Barishal', bnName: 'বরিশাল', lat: 22.7010, lng: 90.3535, timezone: 'Asia/Dhaka' },
  { name: 'Chattogram', bnName: 'চট্টগ্রাম', lat: 22.3569, lng: 91.7832, timezone: 'Asia/Dhaka' },
  { name: 'Dhaka', bnName: 'ঢাকা', lat: 23.8103, lng: 90.4125, timezone: 'Asia/Dhaka' },
  { name: 'Khulna', bnName: 'খুলনা', lat: 22.8456, lng: 89.5403, timezone: 'Asia/Dhaka' },
  { name: 'Mymensingh', bnName: 'ময়মনসিংহ', lat: 24.7471, lng: 90.4203, timezone: 'Asia/Dhaka' },
  { name: 'Rajshahi', bnName: 'রাজশাহী', lat: 24.3745, lng: 88.6042, timezone: 'Asia/Dhaka' },
  { name: 'Rangpur', bnName: 'রংপুর', lat: 25.7439, lng: 89.2752, timezone: 'Asia/Dhaka' },
  { name: 'Sylhet', bnName: 'সিলেট', lat: 24.8949, lng: 91.8687, timezone: 'Asia/Dhaka' },
];

export const BD_DIVISION_NAMES = [
  'Barishal',
  'Chattogram',
  'Dhaka',
  'Khulna',
  'Mymensingh',
  'Rajshahi',
  'Rangpur',
  'Sylhet',
] as const;

export function findDivisionByName(name: string): BDDivision {
  const clean = (name || '').trim().toLowerCase();
  return (
    BD_DIVISIONS.find((d) => d.name.toLowerCase() === clean) ||
    BD_DIVISIONS.find((d) => d.name.toLowerCase().includes(clean)) ||
    BD_DIVISIONS[2] // Default to Dhaka
  );
}

export function findNearestDivision(lat: number, lng: number): BDDivision {
  let closest = BD_DIVISIONS[0];
  let minDist = Infinity;
  for (const div of BD_DIVISIONS) {
    const dLat = div.lat - lat;
    const dLng = div.lng - lng;
    const distSq = dLat * dLat + dLng * dLng;
    if (distSq < minDist) {
      minDist = distSq;
      closest = div;
    }
  }
  return closest;
}

/**
 * Arabic names and meta for prayers
 */
export const PRAYER_NAMES: Record<
  string,
  { label: string; arabic: string; desc: string; category?: string; badge?: string }
> = {
  Tahajjud: {
    label: 'Tahajjud',
    arabic: 'التهجد',
    desc: 'Night vigil prayer (Qiyam al-Layl)',
    category: 'sunnah',
    badge: 'Voluntary / Sunnah',
  },
  Fajr: { label: 'Fajr', arabic: 'الفجر', desc: 'Dawn prayer', category: 'fard', badge: 'Obligatory / Fard' },
  Sunrise: { label: 'Sunrise', arabic: 'الشروق', desc: 'Shurooq', category: 'sunrise', badge: 'Solar Milestone' },
  Dhuhr: { label: 'Dhuhr', arabic: 'الظهر', desc: 'Midday prayer', category: 'fard', badge: 'Obligatory / Fard' },
  Asr: { label: 'Asr', arabic: 'العصر', desc: 'Afternoon prayer', category: 'fard', badge: 'Obligatory / Fard' },
  Maghrib: { label: 'Maghrib', arabic: 'المغرب', desc: 'Sunset prayer', category: 'fard', badge: 'Obligatory / Fard' },
  Isha: { label: 'Isha', arabic: 'العشاء', desc: 'Night prayer', category: 'fard', badge: 'Obligatory / Fard' },
};

export function formatTime24(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function formatTime12(time24: string): string {
  if (!time24) return '--:--';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return time24;
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

/**
 * Dynamic calculation of Tahajjud (Thuluth al-Layl al-Akhir — last third of the night)
 * Tahajjud Start = Maghrib + (2 * Night Duration / 3)
 */
export function calculateTahajjudTime(maghribTime: string, fajrTime: string): string {
  const [mH, mM] = (maghribTime || '18:00').split(':').map(Number);
  const [fH, fM] = (fajrTime || '05:00').split(':').map(Number);

  const maghribMinutes = mH * 60 + mM;
  let fajrMinutes = fH * 60 + fM;
  if (fajrMinutes < maghribMinutes) {
    fajrMinutes += 24 * 60; // Crosses midnight into next morning
  }

  const nightMinutes = fajrMinutes - maghribMinutes;
  const lastThirdStartMinutes = Math.round(maghribMinutes + (2 * nightMinutes) / 3);
  const normalizedMinutes = (lastThirdStartMinutes + 24 * 60) % (24 * 60);

  const h = Math.floor(normalizedMinutes / 60);
  const m = normalizedMinutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Pure client-side zero-latency astronomical prayer calculation using `adhan`
 * Configured with South Asia standard: CalculationMethod.Karachi() & Madhab.Hanafi
 */
export function calculateLocalPrayerTimes(
  date: Date,
  location: LocationSettings,
  isHanafi?: boolean
): Record<PrayerName, string> {
  const lat = location.latitude ?? 23.8103;
  const lng = location.longitude ?? 90.4125;
  const coords = new Coordinates(lat, lng);

  const params = CalculationMethod.Karachi();
  const useHanafi = isHanafi !== undefined ? isHanafi : location.juristicMethod !== 'shafi';
  params.madhab = useHanafi ? Madhab.Hanafi : Madhab.Shafi;

  const ptToday = new PrayerTimes(coords, date, params);

  // Compute Tahajjud: last third of the night preceding today's Fajr
  // Tahajjud Start = Maghrib + (2 * Night Duration / 3)
  const yesterday = new Date(date.getTime() - 24 * 60 * 60 * 1000);
  const ptYesterday = new PrayerTimes(coords, yesterday, params);

  const nightDurationMs = ptToday.fajr.getTime() - ptYesterday.maghrib.getTime();
  const tahajjudStartMs = ptYesterday.maghrib.getTime() + Math.round((2 * nightDurationMs) / 3);
  const tahajjudDate = new Date(tahajjudStartMs);

  return {
    Tahajjud: formatTime24(tahajjudDate),
    Fajr: formatTime24(ptToday.fajr),
    Sunrise: formatTime24(ptToday.sunrise),
    Dhuhr: formatTime24(ptToday.dhuhr),
    Asr: formatTime24(ptToday.asr),
    Maghrib: formatTime24(ptToday.maghrib),
    Isha: formatTime24(ptToday.isha),
  };
}

/**
 * Synchronous client-side prayer times generator (0ms latency, 100% offline)
 */
export function getPrayerTimesSync(
  location: LocationSettings,
  date: Date = new Date(),
  isHanafi?: boolean
): PrayerTime[] {
  const lat = location.latitude ?? 23.8103;
  const lng = location.longitude ?? 90.4125;
  const coords = new Coordinates(lat, lng);

  const params = CalculationMethod.Karachi();
  const useHanafi = isHanafi !== undefined ? isHanafi : location.juristicMethod !== 'shafi';
  params.madhab = useHanafi ? Madhab.Hanafi : Madhab.Shafi;

  const ptToday = new PrayerTimes(coords, date, params);

  // Tahajjud is observed in the early hours before today's Fajr
  // Tahajjud Start = Maghrib + (2 * Night Duration / 3)
  const yesterday = new Date(date.getTime() - 24 * 60 * 60 * 1000);
  const ptYesterday = new PrayerTimes(coords, yesterday, params);

  const nightDurationMs = ptToday.fajr.getTime() - ptYesterday.maghrib.getTime();
  const tahajjudStartMs = ptYesterday.maghrib.getTime() + Math.round((2 * nightDurationMs) / 3);
  const tahajjudDate = new Date(tahajjudStartMs);

  const entries: {
    name: PrayerName;
    date: Date;
    isVoluntary?: boolean;
    category?: 'fard' | 'sunnah' | 'nafl' | 'sunrise';
    badge?: string;
  }[] = [
    {
      name: 'Tahajjud',
      date: tahajjudDate,
      isVoluntary: true,
      category: 'sunnah',
      badge: 'Voluntary / Sunnah',
    },
    {
      name: 'Fajr',
      date: ptToday.fajr,
      category: 'fard',
      badge: 'Obligatory / Fard',
    },
    {
      name: 'Sunrise',
      date: ptToday.sunrise,
      category: 'sunrise',
      badge: 'Shurooq',
    },
    {
      name: 'Dhuhr',
      date: ptToday.dhuhr,
      category: 'fard',
      badge: 'Obligatory / Fard',
    },
    {
      name: 'Asr',
      date: ptToday.asr,
      category: 'fard',
      badge: 'Obligatory / Fard',
    },
    {
      name: 'Maghrib',
      date: ptToday.maghrib,
      category: 'fard',
      badge: 'Obligatory / Fard',
    },
    {
      name: 'Isha',
      date: ptToday.isha,
      category: 'fard',
      badge: 'Obligatory / Fard',
    },
  ];

  return entries.map((item) => ({
    name: item.name,
    arabicName: PRAYER_NAMES[item.name]?.arabic || '',
    time: formatTime24(item.date),
    timestamp: item.date.getTime(),
    isVoluntary: item.isVoluntary,
    category: item.category,
    badge: item.badge,
  }));
}

/**
 * Returns prayer times as Promise for full backward compatibility, computing immediately
 */
export async function getPrayerTimes(
  location: LocationSettings,
  date: Date = new Date()
): Promise<PrayerTime[]> {
  return Promise.resolve(getPrayerTimesSync(location, date));
}

/**
 * Determines the Next Prayer and countdown in seconds
 */
export function getNextPrayer(prayers: PrayerTime[], now: Date = new Date()): NextPrayerInfo {
  const currentMs = now.getTime();

  // Find the first upcoming prayer today
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

  // If all prayers today have passed, the next prayer is either tonight's Tahajjud or tomorrow's Fajr
  const tahajjud = prayers.find((p) => p.name === 'Tahajjud');
  const fajr = prayers.find((p) => p.name === 'Fajr') || prayers[1];

  if (tahajjud) {
    const tomorrowTahajjudMs = tahajjud.timestamp + 24 * 60 * 60 * 1000;
    if (tomorrowTahajjudMs > currentMs) {
      const diffSec = Math.max(0, Math.floor((tomorrowTahajjudMs - currentMs) / 1000));
      return {
        name: 'Tahajjud (Tonight)',
        arabicName: PRAYER_NAMES.Tahajjud?.arabic || 'التهجد',
        remainingSeconds: diffSec,
        targetTimeFormatted: formatTime12(tahajjud.time),
      };
    }
  }

  const tomorrowFajrMs = (fajr ? fajr.timestamp : currentMs) + 24 * 60 * 60 * 1000;
  const diffSec = Math.max(0, Math.floor((tomorrowFajrMs - currentMs) / 1000));

  return {
    name: 'Fajr (Tomorrow)',
    arabicName: PRAYER_NAMES.Fajr.arabic,
    remainingSeconds: diffSec,
    targetTimeFormatted: fajr ? formatTime12(fajr.time) : '--:--',
  };
}

/**
 * Returns Tahajjud night prayer window metadata and live status
 */
export function getTahajjudWindow(
  tahajjudTime: string,
  fajrTime: string,
  now: Date = new Date()
) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [tH, tM] = (tahajjudTime || '02:00').split(':').map(Number);
  const [fH, fM] = (fajrTime || '05:00').split(':').map(Number);
  const tahajjudMinutes = tH * 60 + tM;
  const fajrMinutes = fH * 60 + fM;

  // Active during the early hours after midnight up to Fajr dawn
  const isActiveNow = currentMinutes >= tahajjudMinutes && currentMinutes < fajrMinutes;

  return {
    isActiveNow,
    startFormatted: formatTime12(tahajjudTime),
    endFormatted: formatTime12(fajrTime),
  };
}

/**
 * Browser Geolocation Service with high-accuracy settings
 */
export function getCurrentGpsPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
}

/**
 * Reverse-geocode coordinates using cached Nominatim query or nearest BD division lookup
 */
const GEOCODE_CACHE_PREFIX = 'admission_geocode_v2_';

export async function reverseGeocodeLocation(lat: number, lng: number): Promise<string> {
  const cacheKey = `${GEOCODE_CACHE_PREFIX}${lat.toFixed(3)}_${lng.toFixed(3)}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
  } catch {}

  const nearest = findNearestDivision(lat, lng);

  // If within Bangladesh latitude/longitude bounds, prefer division identification
  const isWithinBangladesh = lat >= 20.5 && lat <= 26.8 && lng >= 88.0 && lng <= 92.8;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
      { signal: controller.signal, headers: { 'Accept-Language': 'en' } }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const foundCity =
        addr.city ||
        addr.town ||
        addr.state_district ||
        addr.state ||
        addr.county ||
        (isWithinBangladesh ? nearest.name : '');

      if (foundCity) {
        try {
          localStorage.setItem(cacheKey, foundCity);
        } catch {}
        return foundCity;
      }
    }
  } catch {
    // offline or network unavailable, fall back to nearest division
  }

  return nearest.name;
}
