import React, { useEffect, useState, useCallback } from 'react';
import { MapPin, RefreshCw } from 'lucide-react';
import { LocationSettings } from '../types';

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

  // Perform single geolocation query without continuous tracking
  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setDisplayText('Location unavailable');
      setStatus('unavailable');
      return;
    }

    setStatus('detecting');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // Free, high-speed reverse geocoding without API keys
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
            { signal: AbortSignal.timeout(6000) }
          );

          if (!response.ok) throw new Error('Geocoding service error');

          const data = await response.json();
          const city = data.city || data.locality || data.principalSubdivision || '';
          const country = data.countryName || '';

          if (city && country) {
            const formatted = `${city}, ${country}`;
            setDisplayText(formatted);
            setStatus('success');
            localStorage.setItem('admission_location_display', formatted);

            onLocationUpdate?.({
              city,
              country,
              latitude: lat,
              longitude: lon,
            });
          } else if (country) {
            setDisplayText(country);
            setStatus('success');
            localStorage.setItem('admission_location_display', country);
            onLocationUpdate?.({ country, latitude: lat, longitude: lon });
          } else {
            setDisplayText('Location unavailable');
            setStatus('unavailable');
          }
        } catch {
          // If network reverse-geocoding failed, check if we have previous display text or fallback
          const cached = localStorage.getItem('admission_location_display');
          if (cached) {
            setDisplayText(cached);
            setStatus('success');
          } else {
            setDisplayText('Location unavailable');
            setStatus('unavailable');
          }
        }
      },
      (error) => {
        // Handle permission errors gracefully
        console.warn('Geolocation access not available or denied:', error.message);
        const cached = localStorage.getItem('admission_location_display');
        if (cached) {
          setDisplayText(cached);
          setStatus('idle');
        } else {
          setDisplayText('Location unavailable');
          setStatus('unavailable');
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 3600000, // 1 hour cached coords to avoid unnecessary querying
      }
    );
  }, [onLocationUpdate]);

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
