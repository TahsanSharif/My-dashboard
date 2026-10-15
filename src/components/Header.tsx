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
import { UclTrophyVector } from './UclTrophyVector';

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
      {/* ── 1. TOP-LEFT BRANDING + INSTAGRAM + YOUTUBE + LOCATION ── */}
      <div className="flex items-start sm:items-center gap-3.5 text-left w-full md:w-auto">
        {style !== 'goat' && (
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs border shrink-0 transition-transform hover:scale-105"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
              color: 'var(--accent)',
            }}
          >
            <GraduationCap className="w-6 h-6" />
          </div>
        )}

        <div className="flex flex-col min-w-0 w-full md:w-auto">
          {style === 'goat' ? (
            <>
              {/* Top-Left Header Structure */}
              <div className="header-brand-block">
                {/* Top Row: Title + Adjacent Badge Box */}
                <div className="header-main-row">
                  <h1
                    id="brand-title"
                    className="goat-stacked-title goat-heading dashboard-title"
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
                          : goatPreset === 'le-zebre'
                          ? '#FFFFFF'
                          : 'var(--primary-accent, #45B7FF)',
                    }}
                  >
                    <span>THE</span>
                    <span>GOAT</span>
                  </h1>

                  <div
                    className="header-info-box"
                    style={{
                      backgroundColor:
                        goatPreset === 'galactico-gold'
                          ? '#F8FAFC'
                          : goatPreset === 'selecao-passion'
                          ? '#08090B'
                          : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                          ? '#050505'
                          : goatPreset === 'el-bicho'
                          ? '#0A0B0E'
                          : goatPreset === 'le-zebre'
                          ? '#040405'
                          : 'var(--panel-elevated, #112A52)',
                      borderColor:
                        goatPreset === 'galactico-gold'
                          ? '#D5B46A66'
                          : goatPreset === 'selecao-passion'
                          ? '#C8102E4D'
                          : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                          ? '#C701014D'
                          : goatPreset === 'el-bicho'
                          ? '#00B8B04D'
                          : goatPreset === 'le-zebre'
                          ? 'rgba(255, 255, 255, 0.2)'
                          : 'var(--panel-border, rgba(69, 183, 255, 0.25))',
                    }}
                  >
                    <span
                      className="box-line-1"
                      style={{
                        color:
                          goatPreset === 'galactico-gold'
                            ? '#173A67'
                            : goatPreset === 'selecao-passion'
                            ? '#D4AF37'
                            : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                            ? '#FFFFFF'
                            : goatPreset === 'el-bicho'
                            ? '#00E5FF'
                            : goatPreset === 'le-zebre'
                            ? '#D4AF37'
                            : '#FDE047',
                      }}
                    >
                      CR7
                    </span>
                    <div className="box-line-2">
                      {goatPreset === 'galactico-gold' ? (
                        <>
                          <span style={{ color: '#173A67' }}>450</span>
                          <Trophy className="w-5 h-5 text-amber-500 drop-shadow select-none" />
                        </>
                      ) : goatPreset === 'selecao-passion' ? (
                        <>
                          <span style={{ color: '#FFFFFF' }}>EURO</span>
                          <Trophy className="w-5 h-5 text-emerald-500 drop-shadow select-none" />
                        </>
                      ) : goatPreset === 'red-devil' || goatPreset === 'the-red-devil' ? (
                        <>
                          <span style={{ color: '#FFFFFF' }}>MUFC</span>
                          <Trophy className="w-5 h-5 text-red-500 drop-shadow select-none" />
                        </>
                      ) : goatPreset === 'el-bicho' ? (
                        <>
                          <span style={{ color: '#00E5FF', fontSize: '1.05rem', letterSpacing: '0.04em' }}>3-PEAT</span>
                          <img
                            src="/assets/ucl-trophy.svg"
                            className="ucl-trophy-icon-lg select-none"
                            alt="UCL Trophy"
                          />
                        </>
                      ) : goatPreset === 'le-zebre' ? (
                        <>
                          <span style={{ color: '#FFFFFF' }}>101</span>
                          <Trophy className="w-5 h-5 text-amber-400 drop-shadow select-none" />
                        </>
                      ) : (
                        <>
                          <span>Mr.</span>
                          <img
                            src="/assets/ucl-trophy.svg"
                            className="ucl-trophy-icon-lg select-none"
                            alt="UCL Trophy"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Second Row: Social Pills */}
                <div className="header-social-pills">
                  <a
                    href="https://www.instagram.com/___t_a_h_s_a_n__/"
                    target="_blank"
                    rel="noopener noreferrer"
                    id="header-instagram-link"
                    className="social-pill instagram"
                    title="Visit @___t_a_h_s_a_n__ on Instagram (opens in new tab)"
                    aria-label="Instagram profile @___t_a_h_s_a_n__"
                  >
                    <Instagram className="w-3.5 h-3.5 text-pink-500" />
                    <span>@__t_a_h_s_a_n__</span>
                  </a>

                  <a
                    href="https://www.youtube.com/@tahsansharif17"
                    target="_blank"
                    rel="noopener noreferrer"
                    id="header-youtube-link"
                    className="social-pill youtube"
                    title="Visit @tahsansharif17 on YouTube (opens in new tab)"
                    aria-label="YouTube channel @tahsansharif17"
                  >
                    <Youtube className="w-3.5 h-3.5 text-red-500" />
                    <span>@tahsansharif17</span>
                  </a>
                </div>
              </div>

              {/* Subtitle Section */}
              <div className="header-subtitle-section flex items-start gap-2.5 mt-3 flex-wrap sm:flex-nowrap">
                <span
                  className="number-badge-single header-number-badge w-7 h-7 rounded-lg flex items-center justify-center font-mono font-black text-sm border shrink-0 shadow-xs"
                  style={{
                    backgroundColor:
                      goatPreset === 'galactico-gold'
                        ? 'rgba(213, 180, 106, 0.2)'
                        : goatPreset === 'selecao-passion'
                        ? 'rgba(200, 16, 46, 0.35)'
                        : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                        ? 'rgba(199, 1, 1, 0.35)'
                        : goatPreset === 'el-bicho'
                        ? 'rgba(0, 184, 176, 0.25)'
                        : goatPreset === 'le-zebre'
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'rgba(7, 87, 200, 0.35)',
                    borderColor:
                      goatPreset === 'galactico-gold'
                        ? '#D5B46A'
                        : goatPreset === 'selecao-passion'
                        ? '#006633'
                        : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                        ? '#DA291C'
                        : goatPreset === 'el-bicho'
                        ? '#6B3FA0'
                        : goatPreset === 'le-zebre'
                        ? '#D4AF37'
                        : '#D4AF37',
                    color:
                      goatPreset === 'galactico-gold'
                        ? '#173A67'
                        : goatPreset === 'selecao-passion'
                        ? '#D4AF37'
                        : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                        ? '#FFFFFF'
                        : goatPreset === 'el-bicho'
                        ? '#00E5FF'
                        : goatPreset === 'le-zebre'
                        ? '#FFFFFF'
                        : '#FDE047',
                  }}
                >
                  7
                </span>
                <div className="header-text-block flex flex-col min-w-0">
                  <h3
                    className="theme-subtitle text-xs sm:text-sm font-bold tracking-wide uppercase font-mono"
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
                          : goatPreset === 'le-zebre'
                          ? '#FFFFFF'
                          : 'var(--primary-accent, #45B7FF)',
                    }}
                  >
                    {goatPreset === 'galactico-gold'
                      ? 'Galáctico Gold · Real Madrid Era'
                      : goatPreset === 'selecao-passion'
                      ? 'Seleção Passion · Portugal Euro 2016'
                      : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                      ? 'The Red Devil · Manchester United'
                      : goatPreset === 'el-bicho'
                      ? 'El Bicho · Historic 3-Peat Dynasty'
                      : goatPreset === 'le-zebre'
                      ? 'Le Zebre · Juventus Era (2018–2021)'
                      : 'The European Nights'}
                  </h3>
                  <p
                    className="cr7-quote text-[10px] sm:text-[11px] font-semibold italic"
                    style={{
                      color:
                        goatPreset === 'galactico-gold'
                          ? '#CA8A04'
                          : goatPreset === 'selecao-passion'
                          ? '#E61E38'
                          : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                          ? '#FF4D4D'
                          : goatPreset === 'el-bicho'
                          ? '#00E5FF'
                          : goatPreset === 'le-zebre'
                          ? '#F2CC63'
                          : '#FDE047',
                    }}
                  >
                    {goatPreset === 'galactico-gold'
                      ? '“Your love makes me strong, your hate makes me unstoppable.” — Real Madrid (450 Goals · 4 UCL · 4 Ballon d’Or)'
                      : goatPreset === 'selecao-passion'
                      ? '“In my mind, I’m always the best.” — European Champions 2016 (All-Time International Goalscorer)'
                      : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                      ? '“I have won everything in Manchester, but the hunger remains.” — Moscow 2008 UCL & Ballon d’Or'
                      : goatPreset === 'el-bicho'
                      ? '“Siiiiiiuuu! History made. Three UEFA Champions League titles in a row.” — Real Madrid 2016–2018'
                      : goatPreset === 'le-zebre'
                      ? '“Fino Alla Fine. 101 Goals in Bianconero.” — Back-to-Back Serie A Scudetto Supremacy'
                      : '“Perhaps they need to change the name of the Champions League to the CR7 Champions League.” — CR7 2018'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Default Brand Heading + Social Pills */}
              <div className="flex items-center gap-2 flex-wrap">
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
                <p
                  id="brand-subtitle"
                  className="text-[11px] sm:text-xs font-black tracking-wider uppercase"
                  style={{ color: 'var(--text-muted)' }}
                >
                  FOCUS • STUDY • PRAY • REPEAT
                </p>

                <span className="text-[10px] opacity-35 hidden sm:inline">•</span>

                {/* 2. CURRENT LOCATION INDICATOR */}
                <LocationIndicator
                  location={location}
                  onLocationUpdate={onLocationUpdate}
                />
              </div>
            </>
          )}
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
                  <span className="hidden xl:inline">{p.id === 'mr-champions-league' ? 'European' : p.name.split(' ')[0]}</span>
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
