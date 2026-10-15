import React from 'react';
import {
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  GraduationCap,
  Instagram,
  Youtube,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { AppearanceMode, LocationSettings, StylePalette, GoatPreset } from '../types';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LocationIndicator } from './LocationIndicator';
import { GOAT_PRESETS } from './JerseyCabinet';

interface HeaderProps {
  appearance: AppearanceMode;
  style: StylePalette;
  onAppearanceChange: (appearance: AppearanceMode) => void;
  onStyleChange: (style: StylePalette) => void;
  goatPreset?: GoatPreset;
  onGoatPresetChange?: (preset: GoatPreset) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  location: LocationSettings;
  onLocationUpdate?: (newLocation: Partial<LocationSettings>) => void;
  onReplayIntro?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  appearance,
  style,
  onAppearanceChange,
  onStyleChange,
  goatPreset = 'mr-champions-league',
  onGoatPresetChange,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  location,
  onLocationUpdate,
  onReplayIntro,
}) => {
  return (
    <header
      id="main-header"
      className="w-full max-w-7xl mx-auto pt-5 pb-3 px-3 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b transition-colors relative z-20"
      style={{
        borderColor: 'var(--border-color)',
      }}
    >
      {/* ── 1. TOP-LEFT BRANDING + INSTAGRAM + YOUTUBE + LOCATION ── */}
      <div className="flex items-start sm:items-center gap-3.5 text-left w-full md:w-auto">
        {/* Brand Icon */}
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs border shrink-0 transition-transform hover:scale-105"
          style={{
            backgroundColor:
              style === 'goat'
                ? goatPreset === 'galactico-gold'
                  ? 'rgba(213, 180, 106, 0.15)'
                  : goatPreset === 'selecao-passion'
                  ? 'rgba(200, 16, 46, 0.25)'
                  : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                  ? 'rgba(199, 1, 1, 0.25)'
                  : goatPreset === 'el-bicho'
                  ? 'rgba(0, 184, 176, 0.25)'
                  : goatPreset === 'le-zebre'
                  ? 'rgba(255, 255, 255, 0.12)'
                  : 'rgba(7, 87, 200, 0.3)'
                : 'var(--bg-card-subtle)',
            borderColor:
              style === 'goat'
                ? goatPreset === 'galactico-gold'
                  ? '#D5B46A'
                  : goatPreset === 'selecao-passion'
                  ? '#C8102E'
                  : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                  ? '#C70101'
                  : goatPreset === 'el-bicho'
                  ? '#00B8B0'
                  : goatPreset === 'le-zebre'
                  ? '#D4AF37'
                  : '#D4AF37'
                : 'var(--border-color)',
            color:
              style === 'goat'
                ? goatPreset === 'galactico-gold'
                  ? '#D5B46A'
                  : goatPreset === 'selecao-passion'
                  ? '#D4AF37'
                  : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                  ? '#D4AF37'
                  : goatPreset === 'el-bicho'
                  ? '#00E5FF'
                  : goatPreset === 'le-zebre'
                  ? '#FFFFFF'
                  : '#D4AF37'
                : 'var(--accent)',
          }}
        >
          {style === 'goat' ? (
            <span className="badge-number-7 font-black text-sm font-mono tracking-tight text-amber-400">#7</span>
          ) : (
            <GraduationCap className="w-6 h-6" />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          {/* Brand Heading + Social Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {style === 'goat' ? (
              <h1
                id="brand-title"
                className="goat-heading dashboard-title text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2"
                style={{
                  color:
                    goatPreset === 'galactico-gold'
                      ? '#D5B46A'
                      : goatPreset === 'selecao-passion'
                      ? '#C8102E'
                      : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                      ? '#C70101'
                      : goatPreset === 'el-bicho'
                      ? '#00B8B0'
                      : '#FFFFFF',
                  textShadow:
                    goatPreset === 'galactico-gold'
                      ? '0 2px 4px rgba(15, 23, 42, 0.08)'
                      : goatPreset === 'selecao-passion'
                      ? '0 0 12px rgba(200, 16, 46, 0.4)'
                      : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                      ? '0 0 12px rgba(199, 1, 1, 0.5)'
                      : goatPreset === 'el-bicho'
                      ? '0 0 12px rgba(0, 184, 176, 0.5)'
                      : goatPreset === 'le-zebre'
                      ? '0 0 12px rgba(255, 255, 255, 0.4)'
                      : undefined,
                }}
              >
                <span className="tracking-wide goat-heading">THE GOAT</span>
                <span
                  className="badge-number-7 px-2 py-0.5 text-xs font-black rounded-md tracking-wider shadow-2xs font-mono"
                  style={{
                    background:
                      goatPreset === 'galactico-gold'
                        ? '#D5B46A'
                        : goatPreset === 'selecao-passion'
                        ? 'linear-gradient(135deg, #C8102E 0%, #8A0018 50%, #006633 100%)'
                        : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                        ? 'linear-gradient(135deg, #C70101 0%, #8A0000 60%, #14161B 100%)'
                        : goatPreset === 'el-bicho'
                        ? 'linear-gradient(135deg, #00B8B0 0%, #087E83 50%, #6B3FA0 100%)'
                        : goatPreset === 'le-zebre'
                        ? 'linear-gradient(135deg, #121216 0%, #08080A 35%, #FFFFFF 50%, #D4AF37 100%)'
                        : 'linear-gradient(135deg, #D4AF37 0%, #FFDF00 100%)',
                    color:
                      goatPreset === 'galactico-gold'
                        ? '#0F172A'
                        : '#FFFFFF',
                    border:
                      goatPreset === 'el-bicho'
                        ? '1px solid rgba(0, 229, 255, 0.4)'
                        : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                        ? '1px solid rgba(255, 255, 255, 0.3)'
                        : goatPreset === 'le-zebre'
                        ? '1px solid #D4AF37'
                        : undefined,
                  }}
                >
                  {goatPreset === 'selecao-passion'
                    ? 'CR7 · #7 · EURO 2016'
                    : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                    ? 'CR7 · #7 · RED DEVIL'
                    : goatPreset === 'el-bicho'
                    ? 'CR7 · #7 · 3-PEAT'
                    : goatPreset === 'le-zebre'
                    ? 'CR7 · #7 · LE ZEBRE'
                    : 'CR7 · #7'}
                </span>
              </h1>
            ) : (
              <h1
                id="brand-title"
                className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2"
                style={{ color: 'var(--text-primary)' }}
              >
                <span>ADMISSION</span>
                <span
                  className="px-2 py-0.5 text-xs font-black rounded-md tracking-wider text-white shadow-2xs"
                  style={{
                    background: 'var(--accent-gradient)',
                  }}
                >
                  2026
                </span>
              </h1>
            )}

            {/* Instagram Profile Link */}
            <a
              href="https://www.instagram.com/___t_a_h_s_a_n__/"
              target="_blank"
              rel="noopener noreferrer"
              id="header-instagram-link"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-2xs transition-all duration-200 hover:scale-105 hover:shadow-xs active:scale-95 group/insta cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
              title="Visit @___t_a_h_s_a_n__ on Instagram (opens in new tab)"
              aria-label="Instagram profile @___t_a_h_s_a_n__"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-500 group-hover/insta:scale-115 group-hover/insta:rotate-6 transition-transform" />
              <span className="font-mono text-[11px] font-bold tracking-tight group-hover/insta:text-pink-500 transition-colors">
                @___t_a_h_s_a_n__
              </span>
            </a>

            {/* YouTube Profile Link */}
            <a
              href="https://www.youtube.com/@tahsansharif17"
              target="_blank"
              rel="noopener noreferrer"
              id="header-youtube-link"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-2xs transition-all duration-200 hover:scale-105 hover:shadow-xs active:scale-95 group/yt cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
              title="Visit @tahsansharif17 on YouTube (opens in new tab)"
              aria-label="YouTube channel @tahsansharif17"
            >
              <Youtube className="w-3.5 h-3.5 text-red-500 group-hover/yt:scale-115 group-hover/yt:rotate-6 transition-transform" />
              <span className="font-mono text-[11px] font-bold tracking-tight group-hover/yt:text-red-500 transition-colors">
                @tahsansharif17
              </span>
            </a>
          </div>

          {/* Slogan + Location Indicator */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap mt-0.5">
            {style === 'goat' ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <p
                  id="brand-subtitle"
                  className="text-[10px] sm:text-[11px] font-black tracking-wider uppercase"
                  style={{
                    color:
                      goatPreset === 'selecao-passion'
                        ? '#008B45'
                        : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                        ? '#FF1E1E'
                        : goatPreset === 'el-bicho'
                        ? '#00E5FF'
                        : goatPreset === 'le-zebre'
                        ? '#F2CC63'
                        : 'var(--glow-accent, #45B7FF)',
                  }}
                >
                  {goatPreset === 'selecao-passion'
                    ? 'CR7 · SELEÇÃO CANTEIROS · PORTUGAL EURO 2016 · NUMBER 7'
                    : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                    ? 'CR7 · THE RED DEVIL · OLD TRAFFORD · NUMBER 7'
                    : goatPreset === 'el-bicho'
                    ? 'CR7 · EL BICHO · REAL MADRID 2.0 (2016-2018) · NUMBER 7'
                    : goatPreset === 'le-zebre'
                    ? 'CR7 · LE ZEBRE · JUVENTUS ERA · NUMBER 7'
                    : 'CR7 · THE MINDSET · THE LEGACY · NUMBER 7'}
                </p>
                <span className="text-[10px] hidden sm:inline text-amber-400 font-semibold italic">
                  {goatPreset === 'selecao-passion'
                    ? '— "Eu estou aqui!"'
                    : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                    ? '— "Viva Ronaldo! Theatre of Dreams."'
                    : goatPreset === 'el-bicho'
                    ? '— "Calma, calma! 3-Peat Prime."'
                    : goatPreset === 'le-zebre'
                    ? '— "Fino Alla Fine · Scudetto Supremacy."'
                    : '— "Greatness is a choice."'}
                </span>
              </div>
            ) : (
              <p
                id="brand-subtitle"
                className="text-[11px] sm:text-xs font-black tracking-wider uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                FOCUS • STUDY • PRAY • REPEAT
              </p>
            )}

            <span className="text-[10px] opacity-35 hidden sm:inline">•</span>

            {/* 2. CURRENT LOCATION INDICATOR */}
            <LocationIndicator
              location={location}
              onLocationUpdate={onLocationUpdate}
            />
          </div>
        </div>
      </div>

      {/* ── RIGHT CONTROLS: Theme Switcher (Appearance + Style), Quick Sound, Settings ── */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full md:w-auto justify-between md:justify-end">
        {/* Compact Kit Selector for GOAT Presets */}
        {style === 'goat' && onGoatPresetChange && (
          <div
            id="header-goat-presets"
            className="inline-flex items-center p-0.5 rounded-xl border gap-0.5 backdrop-blur-md"
            style={{
              backgroundColor: 'var(--panel-elevated, rgba(17, 42, 82, 0.75))',
              borderColor: 'var(--border-color)',
            }}
            title="Switch CR7 Active Era Preset"
          >
            {GOAT_PRESETS.map((p) => {
              const active = goatPreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  id={`header-preset-btn-${p.id}`}
                  onClick={() => onGoatPresetChange(p.id)}
                  className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    active ? 'scale-105 shadow-xs font-black' : 'opacity-65 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: active ? p.accentHex : 'transparent',
                    color: active ? '#FFFFFF' : 'var(--text-secondary)',
                    border: active ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                  }}
                  title={`${p.name} (${p.sublabel})`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: p.goldHex }}
                  />
                  <span className="hidden xl:inline">{p.name.split(' ')[0]}</span>
                  <span className="xl:hidden">{p.tag.replace('PRESET ', 'P')}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Theme Switcher (Appearance: Light/Dark, Style: Girly/Boi) */}
        <ThemeSwitcher
          appearance={appearance}
          style={style}
          goatPreset={goatPreset}
          onGoatPresetChange={onGoatPresetChange}
          onAppearanceChange={onAppearanceChange}
          onStyleChange={onStyleChange}
        />

        {/* Intro Replay Button */}
        {onReplayIntro && (
          <button
            type="button"
            onClick={onReplayIntro}
            className="p-2 rounded-full border shadow-2xs transition-all hover:scale-105 cursor-pointer opacity-80 hover:opacity-100"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
            title="Replay startup intro & quick tips"
            aria-label="Replay intro"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
          </button>
        )}

        {/* Quick Sound Toggle */}
        <button
          id="sound-toggle-btn"
          onClick={onToggleSound}
          className="p-2 rounded-full border shadow-2xs transition-all hover:scale-105 cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
            color: soundEnabled ? 'var(--accent)' : 'var(--text-muted)',
          }}
          title={soundEnabled ? 'Mute notification sounds' : 'Enable notification sounds'}
          aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Settings Button */}
        <button
          id="open-settings-btn"
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border shadow-2xs transition-all hover:scale-105 cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
          aria-label="Open settings"
        >
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </div>
    </header>
  );
};
