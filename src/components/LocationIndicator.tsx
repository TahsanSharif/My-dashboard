import React, { useEffect, useState, useCallback } from 'react';
import { MapPin, RefreshCw } from 'lucide-react';
import { LocationSettings } from '../types';
import { getCurrentGpsPosition, reverseGeocodeLocation } from '../utils/prayer';

interface LocationIndicatorProps {
  location: LocationSettings;
  onLocationUpdate?: (newLocation: Partial<LocationSettings>) => void;
}

export const LocationIndicator: React.FC<LocationIndicatorProps> = ({
  location,
  onLocationUpdate,
}) => {
  const [displayText, setDisplayText] = useState<string>(() => {
    const saved = localStorage.getItem('admission_location_display');
    if (saved) return saved;
    if (location.city && location.country) {
      return `${location.city}, ${location.country}`;
    }
    return 'Dhaka, Bangladesh';
  });

  const [status, setStatus] = useState<'idle' | 'detecting' | 'success' | 'unavailable'>('idle');

  // Perform single geolocation query without continuous tracking using browser GPS
  const detectLocation = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setDisplayText('Location unavailable');
      setStatus('unavailable');
      return;
    }

    setStatus('detecting');

    try {
      const position = await getCurrentGpsPosition();
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const cityName = await reverseGeocodeLocation(lat, lon);
      const formatted = `${cityName}, Bangladesh`;

      setDisplayText(formatted);
      setStatus('success');
      localStorage.setItem('admission_location_display', formatted);

      onLocationUpdate?.({
        city: cityName,
        country: 'Bangladesh',
        latitude: lat,
        longitude: lon,
      });
    } catch (err: unknown) {
      console.warn('Geolocation detection error:', err);
      const cached = localStorage.getItem('admission_location_display');
      if (cached) {
        setDisplayText(cached);
        setStatus('idle');
      } else if (location.city) {
        setDisplayText(`${location.city}, Bangladesh`);
        setStatus('idle');
      } else {
        setDisplayText('Location unavailable');
        setStatus('unavailable');
      }
    }
  }, [location.city, onLocationUpdate]);

  // Run detection on initial load if not already detected
  useEffect(() => {
    const hasAttempted = sessionStorage.getItem('admission_geo_attempted_v1');
    if (!hasAttempted) {
      sessionStorage.setItem('admission_geo_attempted_v1', 'true');
      detectLocation();
    }
  }, [detectLocation]);

  return (
    <button
      type="button"
      id="current-location-indicator"
      onClick={detectLocation}
      title={
        status === 'detecting'
          ? 'Detecting location...'
          : 'Current location (Click to refresh via browser GPS)'
      }
      aria-label={`Current location: ${displayText}. Click to refresh.`}
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-md shadow-2xs transition-all duration-200 hover:scale-105 active:scale-95 group/loc cursor-pointer max-w-[200px] truncate select-none"
      style={{
        backgroundColor: 'var(--bg-card-subtle)',
        borderColor: 'var(--border-color)',
        color: status === 'unavailable' ? 'var(--text-muted)' : 'var(--text-secondary)',
      }}
    >
      <span className="text-xs shrink-0 select-none">📍</span>
      <span className="truncate group-hover/loc:text-blue-500 transition-colors">
        {status === 'detecting' ? 'Locating...' : displayText}
      </span>
      {status === 'detecting' && (
        <RefreshCw className="w-2.5 h-2.5 animate-spin text-blue-500 shrink-0" />
      )}
    </button>
  );
};
