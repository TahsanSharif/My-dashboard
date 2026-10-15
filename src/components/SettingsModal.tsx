import React, { useState } from 'react';
import {
  X,
  Clock,
  MapPin,
  Palette,
  Bell,
  Volume2,
  Play,
  Save,
  Check,
  Sun,
  Moon,
  Pin,
  Instagram,
  Youtube,
  Sparkles,
  RotateCcw,
  Target,
  Download,
  Upload,
} from 'lucide-react';
import { AppearanceMode, LocationSettings, StylePalette, TimerSettings, UserSettings, GoatPreset } from '../types';
import { playTimerCompletionSound } from '../utils/audio';
import { exportBackupData, importBackupData, saveDailyStudyGoal } from '../utils/storage';
import { GOAT_PRESETS } from './JerseyCabinet';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (newSettings: UserSettings) => void;
  onResetOnboarding?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetOnboarding,
}) => {
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission | 'unsupported'>(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'unsupported'
  );
  const [saveToast, setSaveToast] = useState(false);

  if (!isOpen) return null;

  const handleTimerChange = (field: keyof TimerSettings, value: number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      timer: {
        ...prev.timer,
        [field]: value,
      },
    }));
  };

  const handleLocationChange = (field: keyof LocationSettings, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const handleAppearanceSelect = (appearance: AppearanceMode) => {
    setFormData((prev) => ({
      ...prev,
      appearance,
      theme: appearance, // keep legacy in sync
      style: appearance === 'light' && prev.style === 'jarvis' ? 'boi' : prev.style,
    }));
  };

  const handleStyleSelect = (style: StylePalette) => {
    setFormData((prev) => ({
      ...prev,
      style,
      goatPreset: prev.goatPreset || 'mr-champions-league',
      appearance: style === 'jarvis' || style === 'goat' ? 'dark' : prev.appearance,
      theme: style === 'jarvis' || style === 'goat' ? 'dark' : prev.appearance,
    }));
  };

  const handleGoatPresetSelect = (preset: GoatPreset) => {
    setFormData((prev) => ({
      ...prev,
      style: 'goat',
      goatPreset: preset,
    }));
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationStatus(perm);
        if (perm === 'granted') {
          handleTimerChange('notificationsEnabled', true);
          new Notification('ADMISSION 2026 Notifications Active', {
            body: 'You will receive study interval and prayer alerts.',
          });
        } else {
          handleTimerChange('notificationsEnabled', false);
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 400);
  };

  // Popular preset locations for quick setup
  const presets = [
    { city: 'Dhaka', country: 'Bangladesh', timezone: 'Asia/Dhaka', lat: 23.8103, lng: 90.4125 },
    { city: 'Chittagong', country: 'Bangladesh', timezone: 'Asia/Dhaka', lat: 22.3569, lng: 91.7832 },
    { city: 'Sylhet', country: 'Bangladesh', timezone: 'Asia/Dhaka', lat: 24.8949, lng: 91.8687 },
    { city: 'London', country: 'United Kingdom', timezone: 'Europe/London', lat: 51.5074, lng: -0.1278 },
    { city: 'New York', country: 'United States', timezone: 'America/New_York', lat: 40.7128, lng: -74.006 },
    { city: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai', lat: 25.2048, lng: 55.2708 },
  ];

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div
        id="settings-modal-card"
        className="w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transition-all"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-5 sm:p-6 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-2">
            <h2
              id="settings-modal-title"
              className="text-lg font-black tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Dashboard Settings
            </h2>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
              style={{
                backgroundColor: 'var(--accent-soft)',
                color: 'var(--accent-text)',
              }}
            >
              Preferences
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border shadow-2xs hover:scale-105 transition-all cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* 1. TIMER SETTINGS */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <h3 className="text-xs font-black tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
                TIMER DURATIONS (MINUTES)
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Study
                </label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={formData.timer.studyMinutes}
                  onChange={(e) => handleTimerChange('studyMinutes', Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-xl border font-mono font-bold text-center outline-none focus:ring-1"
                  style={{
                    backgroundColor: 'var(--bg-card-subtle)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Short Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={formData.timer.shortBreakMinutes}
                  onChange={(e) => handleTimerChange('shortBreakMinutes', Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-xl border font-mono font-bold text-center outline-none focus:ring-1"
                  style={{
                    backgroundColor: 'var(--bg-card-subtle)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Long Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={formData.timer.longBreakMinutes}
                  onChange={(e) => handleTimerChange('longBreakMinutes', Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-xl border font-mono font-bold text-center outline-none focus:ring-1"
                  style={{
                    backgroundColor: 'var(--bg-card-subtle)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Cycles / Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.timer.cyclesBeforeLongBreak}
                  onChange={(e) => handleTimerChange('cyclesBeforeLongBreak', Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-xl border font-mono font-bold text-center outline-none focus:ring-1"
                  style={{
                    backgroundColor: 'var(--bg-card-subtle)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>

            {/* Daily Study Target (Hours) */}
            <div
              className="mt-3.5 p-3.5 rounded-2xl border"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                    Daily Study Target (Hours)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[6, 8, 10].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, dailyGoalHours: h }))}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                        (formData.dailyGoalHours || 8) === h ? 'ring-2 ring-[var(--accent)] font-black' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: (formData.dailyGoalHours || 8) === h ? 'var(--accent-soft)' : 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: (formData.dailyGoalHours || 8) === h ? 'var(--accent-text)' : 'var(--text-secondary)',
                      }}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <input
                  type="number"
                  min="1"
                  max="24"
                  step="0.5"
                  value={formData.dailyGoalHours || 8}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dailyGoalHours: Math.max(1, Math.min(24, parseFloat(e.target.value) || 1)),
                    }))
                  }
                  className="w-20 px-3 py-1.5 rounded-xl border font-mono font-bold text-center outline-none"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
                <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                  Target hours per calendar day for progress bars & consistency trends
                </span>
              </div>
            </div>
          </div>

          {/* 2. LOCATION & TIMEZONE */}
          <div className="pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <h3 className="text-xs font-black tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
                LOCATION & PRAYER GEOGRAPHY
              </h3>
            </div>

            {/* Quick preset chips */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {presets.map((p) => (
                <button
                  type="button"
                  key={p.city}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      location: {
                        city: p.city,
                        country: p.country,
                        timezone: p.timezone,
                        latitude: p.lat,
                        longitude: p.lng,
                      },
                    }));
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg border font-semibold transition-all hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor:
                      formData.location.city === p.city ? 'var(--accent-soft)' : 'var(--bg-card-subtle)',
                    borderColor:
                      formData.location.city === p.city ? 'var(--accent)' : 'var(--border-color)',
                    color:
                      formData.location.city === p.city ? 'var(--accent-text)' : 'var(--text-secondary)',
                  }}
                >
                  {p.city}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  City
                </label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => handleLocationChange('city', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                  style={{
                    backgroundColor: 'var(--bg-card-subtle)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Country
                </label>
                <input
                  type="text"
                  value={formData.location.country}
                  onChange={(e) => handleLocationChange('country', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                  style={{
                    backgroundColor: 'var(--bg-card-subtle)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Timezone Name (IANA)
                </label>
                <input
                  type="text"
                  value={formData.location.timezone}
                  onChange={(e) => handleLocationChange('timezone', e.target.value)}
                  placeholder="e.g. Asia/Dhaka"
                  className="w-full px-3 py-2 rounded-xl border text-sm font-mono outline-none"
                  style={{
                    backgroundColor: 'var(--bg-card-subtle)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* 3. THEME SYSTEM — TWO INDEPENDENT LAYERS */}
          <div className="pt-2 border-t space-y-4" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Palette className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <h3 className="text-xs font-black tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
                THEME SYSTEM — TWO INDEPENDENT LAYERS
              </h3>
            </div>

            {/* Layer 1: Appearance (Light vs Dark) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                  1. APPEARANCE (Brightness & Contrast)
                </span>
                <span className="text-[11px] font-mono opacity-70" style={{ color: 'var(--text-muted)' }}>
                  Active: {formData.style === 'jarvis' ? '🌙 Dark (Locked for JARVIS HUD)' : formData.appearance === 'light' ? '☀️ Light' : '🌙 Dark'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="settings-appearance-light"
                  onClick={() => handleAppearanceSelect('light')}
                  className={`p-3 rounded-2xl border text-left transition-all hover:scale-102 cursor-pointer flex items-center justify-between ${
                    formData.style !== 'jarvis' && formData.appearance === 'light' ? 'ring-2 ring-[var(--accent)] shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: formData.style !== 'jarvis' && formData.appearance === 'light' ? 'var(--accent-soft)' : 'var(--bg-card-subtle)',
                    borderColor: formData.style !== 'jarvis' && formData.appearance === 'light' ? 'var(--accent)' : 'var(--border-color)',
                  }}
                  title={formData.style === 'jarvis' ? 'JARVIS operates in Dark HUD mode (selecting Light switches style to Boi)' : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                        ☀️ Light Mode
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {formData.style === 'jarvis' ? 'Switches JARVIS to Boi' : 'Clean academic daylight'}
                      </div>
                    </div>
                  </div>
                  {formData.style !== 'jarvis' && formData.appearance === 'light' && (
                    <Check className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  )}
                </button>

                <button
                  type="button"
                  id="settings-appearance-dark"
                  onClick={() => handleAppearanceSelect('dark')}
                  className={`p-3 rounded-2xl border text-left transition-all hover:scale-102 cursor-pointer flex items-center justify-between ${
                    formData.style === 'jarvis' || formData.appearance === 'dark' ? 'ring-2 ring-[var(--accent)] shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: formData.style === 'jarvis' || formData.appearance === 'dark' ? 'var(--accent-soft)' : 'var(--bg-card-subtle)',
                    borderColor: formData.style === 'jarvis' || formData.appearance === 'dark' ? 'var(--accent)' : 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                        🌙 Dark Mode
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {formData.style === 'jarvis' ? 'Locked for JARVIS command center' : 'Low fatigue night focus'}
                      </div>
                    </div>
                  </div>
                  {(formData.style === 'jarvis' || formData.appearance === 'dark') && (
                    <Check className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  )}
                </button>
              </div>
            </div>

            {/* Layer 2: Style (Girly vs Boi vs Cyberdeck) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                  2. STYLE (Gradient & Accent Identity)
                </span>
                <span className="text-[11px] font-mono opacity-70" style={{ color: 'var(--text-muted)' }}>
                  Active: {formData.style === 'girly' ? '🎀 Girly' : formData.style === 'boi' ? '💙 Boi' : formData.style === 'cyberdeck' ? '⚡ Cyberdeck' : formData.style === 'cassette' ? '📼 Cassette Futurism' : formData.style === 'jarvis' ? '🤖 JARVIS / F.R.I.D.A.Y.' : '⚪ Oblivion / Westworld'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  id="settings-style-girly"
                  onClick={() => handleStyleSelect('girly')}
                  className={`p-3 rounded-2xl border text-left transition-all hover:scale-102 cursor-pointer flex items-center justify-between ${
                    formData.style === 'girly' ? 'ring-2 ring-pink-500 shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: formData.style === 'girly' ? 'rgba(236, 72, 153, 0.12)' : 'var(--bg-card-subtle)',
                    borderColor: formData.style === 'girly' ? '#ec4899' : 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-2xs"
                      style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #a855f7 100%)' }}>
                      🎀
                    </div>
                    <div>
                      <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                        Girly Style
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        Pink, rose & magenta gradients
                      </div>
                    </div>
                  </div>
                  {formData.style === 'girly' && (
                    <Check className="w-4 h-4 text-pink-500" />
                  )}
                </button>

                <button
                  type="button"
                  id="settings-style-boi"
                  onClick={() => handleStyleSelect('boi')}
                  className={`p-3 rounded-2xl border text-left transition-all hover:scale-102 cursor-pointer flex items-center justify-between ${
                    formData.style === 'boi' ? 'ring-2 ring-sky-500 shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: formData.style === 'boi' ? 'rgba(2, 132, 199, 0.12)' : 'var(--bg-card-subtle)',
                    borderColor: formData.style === 'boi' ? '#0284c7' : 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-2xs"
                      style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0284c7 50%, #06b6d4 100%)' }}>
                      💙
                    </div>
                    <div>
                      <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                        Boi Style
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        Blue, cyan & cool glowing accents
                      </div>
                    </div>
                  </div>
                  {formData.style === 'boi' && (
                    <Check className="w-4 h-4 text-sky-500" />
                  )}
                </button>

                <button
                  type="button"
                  id="settings-style-cyberdeck"
                  onClick={() => handleStyleSelect('cyberdeck')}
                  className={`p-3 rounded-2xl border text-left transition-all hover:scale-102 cursor-pointer flex items-center justify-between ${
                    formData.style === 'cyberdeck' ? 'ring-2 ring-amber-400 shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: formData.style === 'cyberdeck' ? 'rgba(255, 181, 71, 0.14)' : 'var(--bg-card-subtle)',
                    borderColor: formData.style === 'cyberdeck' ? '#FFB547' : 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-2xs font-bold text-black"
                      style={{ background: 'linear-gradient(135deg, #FFB547 0%, #F59E0B 100%)' }}>
                      ⚡
                    </div>
                    <div>
                      <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                        Cyberdeck / Choom
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        Industrial hardware, amber & phosphor accents
                      </div>
                    </div>
                  </div>
                  {formData.style === 'cyberdeck' && (
                    <Check className="w-4 h-4 text-amber-500" />
                  )}
                </button>

                <button
                  type="button"
                  id="settings-style-cassette"
                  onClick={() => handleStyleSelect('cassette')}
                  className={`p-3 rounded-2xl border text-left transition-all hover:scale-102 cursor-pointer flex items-center justify-between ${
                    formData.style === 'cassette' ? 'ring-2 ring-orange-500 shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: formData.style === 'cassette' ? 'rgba(224, 64, 40, 0.14)' : 'var(--bg-card-subtle)',
                    borderColor: formData.style === 'cassette' ? '#E04028' : 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-2xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #E04028 0%, #FF8C42 50%, #F5A623 100%)' }}>
                      📼
                    </div>
                    <div>
                      <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                        Cassette Futurism
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        Vintage tapes & CRT phosphor
                      </div>
                    </div>
                  </div>
                  {formData.style === 'cassette' && (
                    <Check className="w-4 h-4 text-orange-500" />
                  )}
                </button>

                <button
                  type="button"
                  id="settings-style-jarvis"
                  onClick={() => handleStyleSelect('jarvis')}
                  className={`p-3 rounded-2xl border text-left transition-all hover:scale-102 cursor-pointer flex items-center justify-between ${
                    formData.style === 'jarvis' ? 'ring-2 ring-cyan-400 shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: formData.style === 'jarvis' ? 'rgba(0, 229, 255, 0.14)' : 'var(--bg-card-subtle)',
                    borderColor: formData.style === 'jarvis' ? '#00E5FF' : 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-2xs font-bold text-black"
                      style={{ background: 'linear-gradient(135deg, #00E5FF 0%, #0284C7 50%, #38BDF8 100%)' }}>
                      🤖
                    </div>
                    <div>
                      <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                        JARVIS / F.R.I.D.A.Y.
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        Holographic Stark HUD & arc cyan glow
                      </div>
                    </div>
                  </div>
                  {formData.style === 'jarvis' && (
                    <Check className="w-4 h-4 text-cyan-400" />
                  )}
                </button>

                <button
                  type="button"
                  id="settings-style-oblivion"
                  onClick={() => handleStyleSelect('oblivion')}
                  className={`p-3 rounded-2xl border text-left transition-all hover:scale-102 cursor-pointer flex items-center justify-between ${
                    formData.style === 'oblivion' ? 'ring-2 ring-sky-500 shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: formData.style === 'oblivion' ? 'rgba(62, 145, 201, 0.14)' : 'var(--bg-card-subtle)',
                    borderColor: formData.style === 'oblivion' ? '#3E91C9' : 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-2xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #3E91C9 0%, #79BDEB 100%)' }}>
                      ⚪
                    </div>
                    <div>
                      <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                        Oblivion / Westworld
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        Pristine architectural minimalism & technical blue
                      </div>
                    </div>
                  </div>
                  {formData.style === 'oblivion' && (
                    <Check className="w-4 h-4 text-sky-600" />
                  )}
                </button>

                <button
                  type="button"
                  id="settings-style-cybergothic"
                  onClick={() => handleStyleSelect('cybergothic')}
                  className={`p-3 rounded-2xl border text-left transition-all hover:scale-102 cursor-pointer flex items-center justify-between ${
                    formData.style === 'cybergothic' ? 'ring-2 ring-purple-500 shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: formData.style === 'cybergothic' ? 'rgba(192, 132, 252, 0.16)' : 'var(--bg-card-subtle)',
                    borderColor: formData.style === 'cybergothic' ? '#c084fc' : 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-2xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #ff1a53 100%)' }}>
                      🔮
                    </div>
                    <div>
                      <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                        Theme 04: Anime Cyber-Gothic
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        High-voltage neon violet, crimson & anime cyber HUD
                      </div>
                    </div>
                  </div>
                  {formData.style === 'cybergothic' && (
                    <Check className="w-4 h-4 text-purple-400" />
                  )}
                </button>

                <button
                  type="button"
                  id="settings-style-matrix"
                  onClick={() => handleStyleSelect('matrix')}
                  className={`p-3 rounded-2xl border text-left transition-all hover:scale-102 cursor-pointer flex items-center justify-between ${
                    formData.style === 'matrix' ? 'ring-2 ring-emerald-500 shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: formData.style === 'matrix' ? 'rgba(0, 255, 102, 0.12)' : 'var(--bg-card-subtle)',
                    borderColor: formData.style === 'matrix' ? '#00FF66' : 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs shadow-2xs font-mono font-bold text-black"
                      style={{ background: 'linear-gradient(135deg, #00FF66 0%, #00AA44 100%)' }}>
                      01
                    </div>
                    <div>
                      <div className="font-bold text-xs font-mono" style={{ color: 'var(--text-primary)' }}>
                        Theme 05: Matrix / Digital Rain
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        Falling phosphor green code, scanlines & cyberspace console
                      </div>
                    </div>
                  </div>
                  {formData.style === 'matrix' && (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                </button>

                <button
                  type="button"
                  id="settings-style-watchdogs"
                  onClick={() => handleStyleSelect('watchdogs')}
                  className={`p-3 rounded-2xl border text-left transition-all hover:scale-102 cursor-pointer flex items-center justify-between ${
                    formData.style === 'watchdogs' ? 'ring-2 ring-orange-500 shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: formData.style === 'watchdogs' ? 'rgba(255, 107, 53, 0.15)' : 'var(--bg-card-subtle)',
                    borderColor: formData.style === 'watchdogs' ? '#FF6B35' : 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs shadow-2xs font-mono font-bold text-black"
                      style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8254 50%, #00F0FF 100%)' }}>
                      ⚡
                    </div>
                    <div>
                      <div className="font-bold text-xs font-mono" style={{ color: 'var(--text-primary)' }}>
                        Theme 06: Watch Dogs
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        Dark surveillance (#090B0F), signal-orange (#FF6B35) & electric-cyan
                      </div>
                    </div>
                  </div>
                  {formData.style === 'watchdogs' && (
                    <Check className="w-4 h-4 text-orange-400" />
                  )}
                </button>

                <button
                  type="button"
                  id="settings-style-solarpunk"
                  onClick={() => handleStyleSelect('solarpunk')}
                  className={`p-3 rounded-2xl border text-left transition-all hover:scale-102 cursor-pointer flex items-center justify-between ${
                    formData.style === 'solarpunk' || formData.style === 'aerofuturism'
                      ? 'ring-2 ring-emerald-500 shadow-sm'
                      : ''
                  }`}
                  style={{
                    backgroundColor:
                      formData.style === 'solarpunk' || formData.style === 'aerofuturism'
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'var(--bg-card-subtle)',
                    borderColor:
                      formData.style === 'solarpunk' || formData.style === 'aerofuturism'
                        ? '#10B981'
                        : 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-xs shadow-2xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #F59E0B 100%)' }}
                    >
                      🌱
                    </div>
                    <div>
                      <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                        Theme 07: Aero-Futurism / Solarpunk
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        Solar gold, botanical emerald, aerogel glassmorphism & clean ecology
                      </div>
                    </div>
                  </div>
                  {(formData.style === 'solarpunk' || formData.style === 'aerofuturism') && (
                    <Check className="w-4 h-4 text-emerald-500" />
                  )}
                </button>

                <button
                  type="button"
                  id="settings-style-goat"
                  onClick={() => handleStyleSelect('goat')}
                  className={`p-3 rounded-2xl border text-left transition-all hover:scale-102 cursor-pointer flex items-center justify-between ${
                    formData.style === 'goat'
                      ? 'ring-2 ring-sky-400 shadow-md'
                      : ''
                  }`}
                  style={{
                    backgroundColor:
                      formData.style === 'goat'
                        ? 'rgba(7, 87, 200, 0.22)'
                        : 'var(--bg-card-subtle)',
                    borderColor:
                      formData.style === 'goat'
                        ? '#45B7FF'
                        : 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-xs shadow-2xs font-black text-amber-300 border border-amber-400/40"
                      style={{ background: 'linear-gradient(135deg, #06152E 0%, #0757C8 60%, #D4AF37 100%)' }}
                    >
                      #7
                    </div>
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                        <span>Theme 09: THE GOAT</span>
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          CR7
                        </span>
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        Cristiano Ronaldo Command Center · Stadium lights & 5 Era Presets
                      </div>
                    </div>
                  </div>
                  {formData.style === 'goat' && (
                    <Check className="w-4 h-4 text-sky-400" />
                  )}
                </button>
              </div>

              {/* CR7 Active Jersey Era Preset Selector (Visible when THE GOAT is chosen) */}
              {formData.style === 'goat' && (
                <div
                  id="settings-goat-preset-cabinet"
                  className="mt-3.5 p-3.5 rounded-2xl border transition-all"
                  style={{
                    backgroundColor: 'rgba(6, 21, 46, 0.75)',
                    borderColor: 'rgba(69, 183, 255, 0.3)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black tracking-wide text-sky-300">
                        THE JERSEY CABINET · ACTIVE PERFORMANCE ERA
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                        5 Presets
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-amber-300 font-bold">
                      "Greatness is a choice."
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {GOAT_PRESETS.map((preset) => {
                      const isSelected = (formData.goatPreset || 'mr-champions-league') === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          id={`settings-goat-preset-${preset.id}`}
                          onClick={() => handleGoatPresetSelect(preset.id)}
                          className={`p-2 rounded-xl border text-left flex flex-col justify-between gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'ring-2 ring-sky-400 bg-sky-950/60 shadow-md scale-[1.02]'
                              : 'bg-slate-900/40 hover:bg-slate-900/70 border-white/10 opacity-75 hover:opacity-100'
                          }`}
                          style={{
                            borderColor: isSelected ? preset.accentHex : 'rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[9px] font-black text-amber-300">
                              {preset.tag}
                            </span>
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-white/40 shadow-xs"
                              style={{ backgroundColor: preset.accentHex }}
                            />
                          </div>
                          <div>
                            <div className="text-[11px] font-extrabold text-white leading-tight">
                              {preset.name}
                            </div>
                            <div className="text-[9px] text-sky-300 font-medium line-clamp-1 mt-0.5">
                              {preset.sublabel}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="text-[9px] font-black text-amber-400 mt-0.5 flex items-center gap-1">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                              <span>ACTIVE</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Combination preview badge */}
            <div
              className="px-3.5 py-2 rounded-xl border flex items-center justify-between text-xs"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
              }}
            >
              <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                Resulting Combination:
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full font-bold text-xs border shadow-2xs flex items-center gap-1.5"
                style={{
                  backgroundColor: 'var(--accent-soft)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--accent-text)',
                }}
              >
                <span>{formData.appearance === 'light' ? '☀️ Light' : '🌙 Dark'}</span>
                <span>+</span>
                <span>
                  {formData.style === 'girly'
                    ? '🎀 Girly'
                    : formData.style === 'boi'
                    ? '💙 Boi'
                    : formData.style === 'cyberdeck'
                    ? '⚡ Cyberdeck'
                    : formData.style === 'cassette'
                    ? '📼 Cassette Futurism'
                    : formData.style === 'jarvis'
                    ? '🤖 JARVIS / F.R.I.D.A.Y.'
                    : formData.style === 'cybergothic'
                    ? '🔮 Anime Cyber-Gothic'
                    : formData.style === 'matrix'
                    ? '🟩 Matrix / Digital Rain'
                    : formData.style === 'watchdogs'
                    ? '🌐 Watch Dogs (ctOS)'
                    : formData.style === 'solarpunk' || formData.style === 'aerofuturism'
                    ? '🌱 Aero-Futurism / Solarpunk'
                    : formData.style === 'goat'
                    ? `🏆 THE GOAT (${formData.goatPreset || 'mr-champions-league'})`
                    : '⚪ Oblivion / Westworld'}
                </span>
              </span>
            </div>
          </div>

          {/* 4. SOUND & NOTIFICATIONS */}
          <div className="pt-2 border-t space-y-3" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <h3 className="text-xs font-black tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
                AUDIO & DESKTOP ALERTS
              </h3>
            </div>

            {/* Sound Toggle + Test Chime */}
            <div
              className="p-3.5 rounded-2xl border flex items-center justify-between gap-3"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <div>
                  <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                    Completion Chimes
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    Synthesized calm bell when study & break intervals finish
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => playTimerCompletionSound()}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border hover:scale-105 transition-all cursor-pointer flex items-center gap-1"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-secondary)',
                  }}
                  title="Test Sound"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Test</span>
                </button>

                <input
                  type="checkbox"
                  id="settings-sound-toggle"
                  checked={formData.timer.soundEnabled}
                  onChange={(e) => handleTimerChange('soundEnabled', e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Notifications Toggle */}
            <div
              className="p-3.5 rounded-2xl border flex items-center justify-between gap-3"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <div>
                  <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                    System Notifications
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    Status: {notificationStatus === 'granted' ? 'Allowed' : notificationStatus === 'denied' ? 'Blocked in Browser' : 'Not Requested'}
                  </div>
                </div>
              </div>

              {notificationStatus !== 'granted' ? (
                <button
                  type="button"
                  onClick={requestNotificationPermission}
                  className="px-3 py-1 text-xs font-bold rounded-lg text-white transition-all hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  Enable
                </button>
              ) : (
                <input
                  type="checkbox"
                  id="settings-notifications-toggle"
                  checked={formData.timer.notificationsEnabled}
                  onChange={(e) => handleTimerChange('notificationsEnabled', e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              )}
            </div>

            {/* Data Backup & Restore (JSON) */}
            <div
              className="p-3.5 rounded-2xl border flex items-center justify-between gap-3 flex-wrap shadow-2xs"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <Download className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <div>
                  <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                    Data Backup & Export (JSON)
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    Download or restore study time logs, daily goals, notes & tasks
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const dataStr = exportBackupData();
                    const blob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `admission2026_backup_${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-1 text-xs font-bold rounded-lg border hover:scale-105 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--accent)',
                  }}
                >
                  <Download className="w-3 h-3" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            {/* Quick Tip & Pinning Advice */}
            <div
              className="p-4 rounded-2xl border flex items-start gap-3 shadow-2xs"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="p-1.5 rounded-xl bg-amber-500/15 text-amber-500 shrink-0 text-base">
                ⚠️
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="text-xs font-black uppercase tracking-wider"
                    style={{ color: 'var(--accent)' }}
                  >
                    QUICK TIP
                  </span>
                  <Pin className="w-3.5 h-3.5 text-amber-500 rotate-45 inline" />
                </div>
                <p
                  className="text-xs font-medium leading-relaxed"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Pin this tab 📌 to keep your dashboard easily accessible and reduce the chance of accidentally closing it.
                </p>

                {onResetOnboarding && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onResetOnboarding();
                    }}
                    className="mt-2.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all hover:scale-102 cursor-pointer shadow-2xs"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--accent)',
                    }}
                  >
                    <RotateCcw className="w-3 h-3 text-amber-500" />
                    <span>Reset & Replay Intro + Warning Sequence</span>
                  </button>
                )}

                <div
                  className="mt-3 pt-2.5 border-t flex items-center justify-between flex-wrap gap-2 text-[11px]"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <span className="font-medium" style={{ color: 'var(--text-muted)' }}>
                    Developed by Tahsan Sharif + AI
                  </span>
                  <div className="flex items-center gap-2.5">
                    <a
                      href="https://www.instagram.com/___t_a_h_s_a_n__/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-pink-500 font-mono font-bold hover:underline"
                      title="Instagram @___t_a_h_s_a_n__"
                    >
                      <Instagram className="w-3 h-3 text-pink-500" />
                      <span>@___t_a_h_s_a_n__</span>
                    </a>
                    <span className="opacity-40">•</span>
                    <a
                      href="https://www.youtube.com/@tahsansharif17"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-red-500 font-mono font-bold hover:underline"
                      title="YouTube @tahsansharif17"
                    >
                      <Youtube className="w-3 h-3 text-red-500" />
                      <span>@tahsansharif17</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Save / Cancel */}
          <div
            className="pt-4 border-t flex items-center justify-end gap-3 sticky bottom-0"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-card)',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border hover:opacity-80 transition-opacity cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2 text-xs font-bold rounded-xl text-white shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {saveToast ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saveToast ? 'Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
