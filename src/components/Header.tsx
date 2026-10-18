import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  GraduationCap,
  Instagram,
  Youtube,
  Sparkles,
  Trophy,
  Sun,
  Moon,
} from 'lucide-react';
import { AppearanceMode, LocationSettings, StylePalette, GoatPreset } from '../types';
import { LocationIndicator } from './LocationIndicator';
import { GOAT_PRESETS } from './JerseyCabinet';
import { UclTrophyVector } from './UclTrophyVector';

export interface ThemeHeaderConfig {
  boxLine1: string;
  boxLine2: string;
  subtitle: string;
  quote: string;
  extraBadge?: string;
}

export const themeHeaderConfigs: Record<string, ThemeHeaderConfig> = {
  'european-nights': {
    boxLine1: 'CR7',
    boxLine2: 'Mr.',
    subtitle: 'The European Nights',
    quote: '“Perhaps they need to change the name of the Champions League to the CR7 Champions League.” — CR7 2018'
  },
  'galactico-gold': {
    boxLine1: 'CR7',
    boxLine2: 'Galáctico',
    subtitle: 'Galáctico Gold',
    quote: '“Perhaps for you, Messi is the best; in my head, I am the best.” — CR7 2015'
  },
  'selecao-passion': {
    boxLine1: 'CR7',
    boxLine2: 'EURO 2016',
    subtitle: 'Seleção',
    quote: '“Dreaming is free, so let\'s keep dreaming.” — CR7 2016'
  },
  'the-red-devil': {
    boxLine1: 'CR7',
    boxLine2: 'THE RED DEVIL',
    subtitle: 'The Red Devil',
    quote: '“Maybe someone don\'t like me because I\'m maybe too good.” — CR7 2007'
  },
  'el-bicho': {
    boxLine1: 'CR7',
    boxLine2: 'EL BICHO',
    subtitle: 'El Bicho',
    quote: '“I\'m used to being criticised, I consider it normal.” — CR7 2016',
    extraBadge: '3 PEAT' // Displayed vertically beside or inside the box
  },
  'le-zebre': {
    boxLine1: 'CR7',
    boxLine2: 'LE ZEBRE',
    subtitle: 'Le Zebre',
    quote: '“I did not come here for a holiday.” — CR7 2018'
  }
};

// Map legacy preset aliases for full compatibility
themeHeaderConfigs['mr-champions-league'] = themeHeaderConfigs['european-nights'];
themeHeaderConfigs['red-devil'] = themeHeaderConfigs['the-red-devil'];

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
  const [isThemesOpen, setIsThemesOpen] = useState(false);

  const toggleThemesMenu = () => {
    setIsThemesOpen((prev) => !prev);
  };

  useEffect(() => {
    (window as unknown as { toggleThemesMenu: () => void }).toggleThemesMenu = () => {
      setIsThemesOpen((prev) => !prev);
    };

    const handleWindowClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && !target.closest('.themes-dropdown-wrapper')) {
        setIsThemesOpen(false);
      }
    };

    window.addEventListener('click', handleWindowClick);
    return () => {
      window.removeEventListener('click', handleWindowClick);
      delete (window as unknown as { toggleThemesMenu?: () => void }).toggleThemesMenu;
    };
  }, []);

  const handleSelectTheme = (themeKey: StylePalette) => {
    onStyleChange(themeKey);
    setIsThemesOpen(false);
  };

  const handleSelectPreset = (presetKey: GoatPreset) => {
    onGoatPresetChange?.(presetKey);
    if (style !== 'goat') {
      onStyleChange('goat');
    }
    setIsThemesOpen(false);
  };

  const effectivePresetKey =
    goatPreset === 'mr-champions-league' || !goatPreset
      ? 'european-nights'
      : goatPreset === 'red-devil'
      ? 'the-red-devil'
      : goatPreset;
  const currentHeaderConfig = themeHeaderConfigs[effectivePresetKey] || themeHeaderConfigs['european-nights'];

  return (
    <header
      id="main-header"
      className="w-full max-w-7xl mx-auto pt-5 pb-3 px-3 sm:px-6 flex flex-col gap-3.5 border-b transition-colors relative z-20"
      style={{
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Top Header Row: Branding on left, Quick utility toggles on right */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
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
                <div className="header-main-row flex items-center gap-3">
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

                  <div className="flex items-center gap-1.5">
                    <div
                      className="header-info-box"
                      data-extra-badge={currentHeaderConfig.extraBadge}
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
                        {currentHeaderConfig.boxLine1}
                      </span>
                      <div
                        className="box-line-2 flex items-center gap-1.5"
                        style={{
                          fontSize:
                            currentHeaderConfig.boxLine2.length > 10
                              ? '1.05rem'
                              : currentHeaderConfig.boxLine2.length > 7
                              ? '1.2rem'
                              : '1.4rem',
                          color:
                            goatPreset === 'galactico-gold'
                              ? '#173A67'
                              : goatPreset === 'selecao-passion'
                              ? '#FFFFFF'
                              : goatPreset === 'red-devil' || goatPreset === 'the-red-devil'
                              ? '#FFFFFF'
                              : goatPreset === 'el-bicho'
                              ? '#00E5FF'
                              : goatPreset === 'le-zebre'
                              ? '#FFFFFF'
                              : '#FFFFFF',
                        }}
                      >
                        <span className="box-line-2-text whitespace-nowrap">
                          {currentHeaderConfig.boxLine2.replace('🏆', '').trim()}
                        </span>
                        {(effectivePresetKey === 'european-nights' || currentHeaderConfig.boxLine2.includes('🏆')) && (
                          <img
                            src="/assets/ucl-trophy.svg"
                            className="ucl-trophy-icon-lg select-none inline-block ml-0.5"
                            alt="UCL Trophy"
                          />
                        )}
                      </div>
                    </div>

                    {currentHeaderConfig.extraBadge && (
                      <div
                        className="header-extra-badge extra-badge self-stretch px-1.5 py-1 rounded-lg border flex items-center justify-center font-mono font-black text-[9px] tracking-widest uppercase select-none transition-all shadow-xs"
                        style={{
                          writingMode: 'vertical-rl',
                          transform: 'rotate(180deg)',
                          backgroundColor:
                            goatPreset === 'el-bicho'
                              ? 'rgba(0, 184, 176, 0.2)'
                              : 'rgba(255, 255, 255, 0.1)',
                          borderColor:
                            goatPreset === 'el-bicho'
                              ? '#00B8B0'
                              : 'var(--border-color)',
                          color:
                            goatPreset === 'el-bicho'
                              ? '#00E5FF'
                              : '#FFFFFF',
                          textShadow:
                            goatPreset === 'el-bicho'
                              ? '0 0 8px rgba(0, 229, 255, 0.5)'
                              : 'none',
                        }}
                        title={currentHeaderConfig.extraBadge}
                      >
                        {currentHeaderConfig.extraBadge}
                      </div>
                    )}
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
                    {currentHeaderConfig.subtitle}
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
                    {currentHeaderConfig.quote}
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
                  <span>LIFE</span>
                  <span
                    className="px-2 py-0.5 text-xs font-black rounded-md tracking-wider text-white shadow-2xs"
                    style={{
                      background: 'var(--accent-gradient)',
                    }}
                  >
                    PIVOT
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

        {/* ── TOP-RIGHT UTILITY CONTROLS: Themes Dropdown, Light/Dark, Sound, Settings ── */}
        <div className="top-utility-controls flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* 1. Themes Dropdown (Moved Beside Light/Dark) */}
          <div
            className={`themes-dropdown-wrapper ${isThemesOpen ? 'open' : ''}`}
            data-open={isThemesOpen ? 'true' : 'false'}
          >
            <button
              type="button"
              className="themes-menu-btn"
              onClick={toggleThemesMenu}
              aria-expanded={isThemesOpen}
              aria-haspopup="true"
            >
              Themes <span className="arrow-icon">▾</span>
            </button>

            <div
              id="themesDropdownMenu"
              className="dropdown-popover-menu"
              style={{ display: isThemesOpen ? 'block' : 'none' }}
            >
              <a
                href="#theme-girly"
                role="button"
                className={`dropdown-item ${style === 'girly' ? 'active font-bold' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectTheme('girly');
                }}
              >
                <span>🎀</span>
                <span>Girly</span>
              </a>
              <a
                href="#theme-boi"
                role="button"
                className={`dropdown-item ${style === 'boi' ? 'active font-bold' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectTheme('boi');
                }}
              >
                <span>💙</span>
                <span>Boi</span>
              </a>
              <a
                href="#theme-cyberdeck"
                role="button"
                className={`dropdown-item ${style === 'cyberdeck' ? 'active font-bold' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectTheme('cyberdeck');
                }}
              >
                <span>🖥️</span>
                <span>Cyberdeck</span>
              </a>
              <a
                href="#theme-cassette"
                role="button"
                className={`dropdown-item ${style === 'cassette' ? 'active font-bold' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectTheme('cassette');
                }}
              >
                <span>📼</span>
                <span>Cassette</span>
              </a>
              <a
                href="#theme-jarvis"
                role="button"
                className={`dropdown-item ${style === 'jarvis' ? 'active font-bold' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectTheme('jarvis');
                }}
              >
                <span>🤖</span>
                <span>JARVIS</span>
              </a>
              <a
                href="#theme-oblivion"
                role="button"
                className={`dropdown-item ${style === 'oblivion' ? 'active font-bold' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectTheme('oblivion');
                }}
              >
                <span>⚔️</span>
                <span>Oblivion</span>
              </a>
              <a
                href="#theme-cybergothic"
                role="button"
                className={`dropdown-item ${style === 'cybergothic' ? 'active font-bold' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectTheme('cybergothic');
                }}
              >
                <span>🕸️</span>
                <span>Cyber-Gothic</span>
              </a>
              
              {/* 01 Matrix with text prefix */}
              <a
                href="#theme-matrix"
                role="button"
                className={`dropdown-item ${style === 'matrix' ? 'active font-bold' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectTheme('matrix');
                }}
              >
                <span className="matrix-prefix">01</span>
                <span>Matrix</span>
              </a>

              <a
                href="#theme-watchdogs"
                role="button"
                className={`dropdown-item ${style === 'watchdogs' ? 'active font-bold' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectTheme('watchdogs');
                }}
              >
                <span>⚡</span>
                <span>Watch Dogs</span>
              </a>
              <a
                href="#theme-solarpunk"
                role="button"
                className={`dropdown-item ${style === 'solarpunk' || style === 'aerofuturism' ? 'active font-bold' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectTheme('solarpunk');
                }}
              >
                <span>🌱</span>
                <span>Solarpunk</span>
              </a>

              {/* #7 THE GOAT Item with Right Flyout Sub-menu */}
              <div
                className={`dropdown-item active-goat has-flyout ${style === 'goat' ? 'active font-black' : ''}`}
                onClick={() => handleSelectTheme('goat')}
              >
                <div className="goat-item-content">
                  <span>7 THE GOAT</span>
                  <span className="flyout-arrow">▸</span>
                </div>

                {/* Nested Presets Box (Opens to the Right on Hover) */}
                <div className="cr7-presets-flyout-menu" onClick={(e) => e.stopPropagation()}>
                  <div className="flyout-header">CR7 ERA PRESETS</div>
                  <button
                    type="button"
                    className={`preset-pill ${effectivePresetKey === 'european-nights' ? 'active' : ''}`}
                    data-theme="european-nights"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPreset('mr-champions-league');
                    }}
                  >
                    ● European Nights
                  </button>
                  <button
                    type="button"
                    className={`preset-pill ${effectivePresetKey === 'galactico-gold' ? 'active' : ''}`}
                    data-theme="galactico-gold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPreset('galactico-gold');
                    }}
                  >
                    ● Galáctico Gold
                  </button>
                  <button
                    type="button"
                    className={`preset-pill ${effectivePresetKey === 'selecao-passion' ? 'active' : ''}`}
                    data-theme="selecao-passion"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPreset('selecao-passion');
                    }}
                  >
                    ● Seleção Passion
                  </button>
                  <button
                    type="button"
                    className={`preset-pill ${effectivePresetKey === 'the-red-devil' ? 'active' : ''}`}
                    data-theme="the-red-devil"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPreset('the-red-devil');
                    }}
                  >
                    ● The Red Devil
                  </button>
                  <button
                    type="button"
                    className={`preset-pill ${effectivePresetKey === 'el-bicho' ? 'active' : ''}`}
                    data-theme="el-bicho"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPreset('el-bicho');
                    }}
                  >
                    ● El Bicho
                  </button>
                  <button
                    type="button"
                    className={`preset-pill ${effectivePresetKey === 'le-zebre' ? 'active' : ''}`}
                    data-theme="le-zebre"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPreset('le-zebre');
                    }}
                  >
                    ● Le Zebre
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Existing Light/Dark Mode Switch (Locked strictly to dark mode under JARVIS) */}
          <div
            id="appearance-mode-group"
            className="theme-toggle-switch inline-flex items-center p-0.5 rounded-xl border"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
            }}
            role="group"
            aria-label="Appearance Mode"
          >
            {style !== 'jarvis' && (
              <button
                type="button"
                id="appearance-btn-light"
                onClick={() => onAppearanceChange('light')}
                className={`mode-btn flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                  appearance === 'light'
                    ? 'active shadow-xs font-bold scale-[1.02] bg-[var(--bg-card)] text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)] hover:opacity-75'
                }`}
                title="☀️ Light Appearance"
                aria-pressed={appearance === 'light'}
              >
                <Sun className={`w-3.5 h-3.5 ${appearance === 'light' ? 'text-amber-500' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">Light</span>
              </button>
            )}

            <button
              type="button"
              id="appearance-btn-dark"
              onClick={() => onAppearanceChange('dark')}
              className={`mode-btn flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                appearance === 'dark' || style === 'jarvis'
                  ? 'active shadow-xs font-bold scale-[1.02] bg-[var(--bg-card)] text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:opacity-75'
              }`}
              title={style === 'jarvis' ? '🌙 Dark Appearance (Locked in JARVIS)' : '🌙 Dark Appearance'}
              aria-pressed={true}
            >
              <Moon className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Dark</span>
            </button>
          </div>

          {/* Intro Replay Button */}
          {onReplayIntro && (
            <button
              type="button"
              onClick={onReplayIntro}
              className="icon-btn p-2 rounded-full border shadow-2xs transition-all hover:scale-105 cursor-pointer opacity-80 hover:opacity-100"
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
            className="icon-btn p-2 rounded-full border shadow-2xs transition-all hover:scale-105 cursor-pointer"
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
            className="settings-btn flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border shadow-2xs transition-all hover:scale-105 cursor-pointer"
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
      </div>
    </header>
  );
};
