import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { AppearanceMode, StylePalette, GoatPreset } from '../types';

interface ThemeSwitcherProps {
  appearance: AppearanceMode;
  style: StylePalette;
  onAppearanceChange: (appearance: AppearanceMode) => void;
  onStyleChange: (style: StylePalette) => void;
  goatPreset?: GoatPreset;
  onGoatPresetChange?: (preset: GoatPreset) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  appearance,
  style,
  onAppearanceChange,
  onStyleChange,
  goatPreset = 'mr-champions-league',
  onGoatPresetChange,
}) => {
  return (
    <div
      id="theme-switcher-container"
      className="inline-flex items-center gap-1.5 p-1 rounded-2xl border shadow-xs"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
      }}
      role="region"
      aria-label="Theme System: Appearance and Style Controls"
    >
      {/* 1. Appearance Layer: Light ☀️ ↔ Dark 🌙 */}
      {(() => {
        const isJarvis = style === 'jarvis';
        const isLightActive = !isJarvis && appearance === 'light';
        const isDarkActive = isJarvis || appearance === 'dark';

        return (
          <div
            id="appearance-mode-group"
            className="inline-flex items-center p-0.5 rounded-xl border"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
            }}
            role="group"
            aria-label="Appearance Mode"
          >
            <button
              type="button"
              id="appearance-btn-light"
              onClick={() => onAppearanceChange('light')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                isLightActive
                  ? 'shadow-xs font-bold scale-[1.02]'
                  : isJarvis
                  ? 'opacity-60 hover:opacity-100'
                  : 'hover:opacity-75'
              }`}
              style={{
                backgroundColor: isLightActive ? 'var(--bg-card)' : 'transparent',
                color: isLightActive ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
              title={
                isJarvis
                  ? 'JARVIS operates exclusively in Dark HUD mode (clicking switches to Boi in Light mode)'
                  : '☀️ Light Appearance'
              }
              aria-pressed={isLightActive}
            >
              <Sun className={`w-3.5 h-3.5 ${isLightActive ? 'text-amber-500' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Light</span>
            </button>

            <button
              type="button"
              id="appearance-btn-dark"
              onClick={() => onAppearanceChange('dark')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                isDarkActive
                  ? 'shadow-xs font-bold scale-[1.02]'
                  : 'hover:opacity-75'
              }`}
              style={{
                backgroundColor: isDarkActive ? 'var(--bg-card)' : 'transparent',
                color: isDarkActive ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
              title={
                isJarvis
                  ? '🌙 Dark HUD Mode (JARVIS command center locked to Dark mode)'
                  : '🌙 Dark Appearance'
              }
              aria-pressed={isDarkActive}
            >
              <Moon className={`w-3.5 h-3.5 ${isDarkActive ? 'text-sky-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Dark</span>
            </button>
          </div>
        );
      })()}

      {/* Subtle Separator */}
      <div
        className="w-[1px] h-4 mx-0.5"
        style={{ backgroundColor: 'var(--border-color)' }}
        aria-hidden="true"
      />

      {/* 2. Style Layer: Girly 🎀 ↔ Boi 💙 */}
      <div
        id="style-palette-group"
        className="inline-flex items-center p-0.5 rounded-xl border"
        style={{
          backgroundColor: 'var(--bg-card-subtle)',
          borderColor: 'var(--border-color)',
        }}
        role="group"
        aria-label="Style Palette Identity"
      >
        <button
          type="button"
          id="style-btn-girly"
          onClick={() => onStyleChange('girly')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
            style === 'girly'
              ? 'shadow-xs font-bold scale-[1.02]'
              : 'hover:opacity-75'
          }`}
          style={{
            background: style === 'girly'
              ? 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #a855f7 100%)'
              : 'transparent',
            color: style === 'girly' ? '#ffffff' : 'var(--text-muted)',
          }}
          title="🎀 Girly Style (Pinkish gradient aesthetic)"
          aria-pressed={style === 'girly'}
        >
          <span className="text-xs">🎀</span>
          <span className="hidden sm:inline font-bold">Girly</span>
        </button>

        <button
          type="button"
          id="style-btn-boi"
          onClick={() => onStyleChange('boi')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
            style === 'boi'
              ? 'shadow-xs font-bold scale-[1.02]'
              : 'hover:opacity-75'
          }`}
          style={{
            background: style === 'boi'
              ? 'linear-gradient(135deg, #2563eb 0%, #0284c7 50%, #06b6d4 100%)'
              : 'transparent',
            color: style === 'boi' ? '#ffffff' : 'var(--text-muted)',
          }}
          title="💙 Boi Style (Bluish gradient aesthetic)"
          aria-pressed={style === 'boi'}
        >
          <span className="text-xs">💙</span>
          <span className="hidden sm:inline font-bold">Boi</span>
        </button>

        <button
          type="button"
          id="style-btn-cyberdeck"
          onClick={() => onStyleChange('cyberdeck')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
            style === 'cyberdeck'
              ? 'shadow-xs font-bold scale-[1.02]'
              : 'hover:opacity-75'
          }`}
          style={{
            background: style === 'cyberdeck'
              ? 'linear-gradient(135deg, #FFB547 0%, #F59E0B 100%)'
              : 'transparent',
            color: style === 'cyberdeck' ? '#101214' : 'var(--text-muted)',
          }}
          title="⚡ Cyberdeck / Choom Style (Industrial workstation aesthetic)"
          aria-pressed={style === 'cyberdeck'}
        >
          <span className="text-xs">⚡</span>
          <span className="hidden sm:inline font-bold">Cyberdeck</span>
        </button>

        <button
          type="button"
          id="style-btn-cassette"
          onClick={() => onStyleChange('cassette')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
            style === 'cassette'
              ? 'shadow-xs font-bold scale-[1.02]'
              : 'hover:opacity-75'
          }`}
          style={{
            background: style === 'cassette'
              ? 'linear-gradient(135deg, #E04028 0%, #F5A623 100%)'
              : 'transparent',
            color: style === 'cassette' ? '#ffffff' : 'var(--text-muted)',
          }}
          title="📼 Cassette Futurism Style (Vintage analog computer, CRT & magnetic tape aesthetic)"
          aria-pressed={style === 'cassette'}
        >
          <span className="text-xs">📼</span>
          <span className="hidden sm:inline font-bold">Cassette</span>
        </button>

        <button
          type="button"
          id="style-btn-jarvis"
          onClick={() => onStyleChange('jarvis')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
            style === 'jarvis'
              ? 'shadow-xs font-bold scale-[1.02]'
              : 'hover:opacity-75'
          }`}
          style={{
            background: style === 'jarvis'
              ? 'linear-gradient(135deg, #00E5FF 0%, #0284C7 50%, #38BDF8 100%)'
              : 'transparent',
            color: style === 'jarvis' ? '#030712' : 'var(--text-muted)',
          }}
          title="🤖 JARVIS / F.R.I.D.A.Y. Style (Holographic Stark HUD & arc cyan glow)"
          aria-pressed={style === 'jarvis'}
        >
          <span className="text-xs">🤖</span>
          <span className="hidden sm:inline font-bold">JARVIS</span>
        </button>

        <button
          type="button"
          id="style-btn-oblivion"
          onClick={() => onStyleChange('oblivion')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
            style === 'oblivion'
              ? 'shadow-xs font-bold scale-[1.02]'
              : 'hover:opacity-75'
          }`}
          style={{
            background: style === 'oblivion'
              ? 'linear-gradient(135deg, #3E91C9 0%, #79BDEB 100%)'
              : 'transparent',
            color: style === 'oblivion' ? '#FFFFFF' : 'var(--text-muted)',
          }}
          title="⚪ Oblivion / Westworld Style (The quiet perfection of an advanced civilization)"
          aria-pressed={style === 'oblivion'}
        >
          <span className="text-xs">⚪</span>
          <span className="hidden sm:inline font-bold">Oblivion</span>
        </button>

        <button
          type="button"
          id="style-btn-cybergothic"
          onClick={() => onStyleChange('cybergothic')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
            style === 'cybergothic'
              ? 'shadow-xs font-bold scale-[1.02]'
              : 'hover:opacity-75'
          }`}
          style={{
            background: style === 'cybergothic'
              ? 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #ff1a53 100%)'
              : 'transparent',
            color: style === 'cybergothic' ? '#FFFFFF' : 'var(--text-muted)',
          }}
          title="🔮 Theme 04 — Anime Cyber-Gothic (High-voltage neon violet, crimson & anime cyber HUD)"
          aria-pressed={style === 'cybergothic'}
        >
          <span className="text-xs">🔮</span>
          <span className="hidden sm:inline font-bold">Cyber-Gothic</span>
        </button>

        <button
          type="button"
          id="style-btn-matrix"
          onClick={() => onStyleChange('matrix')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
            style === 'matrix'
              ? 'shadow-xs font-bold scale-[1.02]'
              : 'hover:opacity-75'
          }`}
          style={{
            background: style === 'matrix'
              ? 'linear-gradient(135deg, #00FF66 0%, #00AA44 100%)'
              : 'transparent',
            color: style === 'matrix' ? '#041106' : 'var(--text-muted)',
          }}
          title="🟩 Theme 05 — Matrix / Digital Rain (Falling phosphor green code, terminal scanlines & cyberspace console)"
          aria-pressed={style === 'matrix'}
        >
          <span className="text-xs font-mono font-bold text-green-400">01</span>
          <span className="hidden sm:inline font-bold font-mono">Matrix</span>
        </button>

        <button
          type="button"
          id="style-btn-watchdogs"
          onClick={() => onStyleChange('watchdogs')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
            style === 'watchdogs'
              ? 'shadow-xs font-bold scale-[1.02]'
              : 'hover:opacity-75'
          }`}
          style={{
            background: style === 'watchdogs'
              ? 'linear-gradient(135deg, #FF6B35 0%, #D84A1B 100%)'
              : 'transparent',
            color: style === 'watchdogs' ? '#090B0F' : 'var(--text-muted)',
          }}
          title="🌐 Theme 06 — Watch Dogs (Dark surveillance #090B0F, signal-orange #FF6B35 & electric cyan #00F0FF)"
          aria-pressed={style === 'watchdogs'}
        >
          <span className="text-xs font-mono font-bold text-orange-400">⚡</span>
          <span className="hidden sm:inline font-bold font-mono">Watch Dogs</span>
        </button>

        <button
          type="button"
          id="style-btn-solarpunk"
          onClick={() => onStyleChange('solarpunk')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
            style === 'solarpunk' || style === 'aerofuturism'
              ? 'shadow-xs font-bold scale-[1.02]'
              : 'hover:opacity-75'
          }`}
          style={{
            background:
              style === 'solarpunk' || style === 'aerofuturism'
                ? 'linear-gradient(135deg, #10B981 0%, #059669 50%, #F59E0B 100%)'
                : 'transparent',
            color: style === 'solarpunk' || style === 'aerofuturism' ? '#FFFFFF' : 'var(--text-muted)',
          }}
          title="🌱 Theme 07 — Aero-Futurism / Solarpunk (Solar gold #F59E0B, botanical emerald #10B981 & aerogel glassmorphism)"
          aria-pressed={style === 'solarpunk' || style === 'aerofuturism'}
        >
          <span className="text-xs">🌱</span>
          <span className="hidden sm:inline font-bold">Solarpunk</span>
        </button>

        <button
          type="button"
          id="style-btn-goat"
          onClick={() => onStyleChange('goat')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
            style === 'goat'
              ? 'shadow-xs font-bold scale-[1.02]'
              : 'hover:opacity-75'
          }`}
          style={{
            background:
              style === 'goat'
                ? 'linear-gradient(135deg, #0757C8 0%, #1A73E8 50%, #D4AF37 100%)'
                : 'transparent',
            color: style === 'goat' ? '#FFFFFF' : 'var(--text-muted)',
          }}
          title="🏆 Theme 09 — THE GOAT (Cristiano Ronaldo: UEFA Champions League, stadium floodlights & CR7 mindset)"
          aria-pressed={style === 'goat'}
        >
          <span className="text-xs font-bold text-amber-300">#7</span>
          <span className="hidden sm:inline font-bold">THE GOAT</span>
        </button>
      </div>
    </div>
  );
};

