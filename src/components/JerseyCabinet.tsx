import React from 'react';
import { Trophy, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { GoatPreset } from '../types';

export interface JerseyPresetConfig {
  id: GoatPreset;
  name: string;
  sublabel: string;
  clubYear: string;
  tag: string;
  bgHex: string;
  accentHex: string;
  goldHex: string;
  badgeHex: string;
  jerseyPattern: string;
  description: string;
}

export const GOAT_PRESETS: JerseyPresetConfig[] = [
  {
    id: 'mr-champions-league',
    name: 'Mr. Champions League',
    sublabel: 'UEFA European Nights',
    clubYear: 'Knockout Stage · All-Time UCL Top Scorer',
    tag: 'PRESET 1',
    bgHex: '#06152E',
    accentHex: '#0757C8',
    goldHex: '#D4AF37',
    badgeHex: '#45B7FF',
    jerseyPattern: 'linear-gradient(135deg, #06152E 0%, #0757C8 60%, #45B7FF 100%)',
    description: 'Midnight stadium blue, starlight silver, starball cyan & legacy gold floodlights.',
  },
  {
    id: 'galactico-gold',
    name: 'Galáctico Gold',
    sublabel: 'Real Madrid Era',
    clubYear: '450 Goals · 4 UCL · 4 Ballon d’Or',
    tag: 'PRESET 2',
    bgHex: '#0E131F',
    accentHex: '#D5B46A',
    goldHex: '#F2CC63',
    badgeHex: '#173A67',
    jerseyPattern: 'linear-gradient(135deg, #173A67 0%, #0E131F 50%, #D5B46A 100%)',
    description: 'Royal dark navy, Champagne gold, Ballon d’Or glow & Galáctico dominance.',
  },
  {
    id: 'selecao-passion',
    name: 'Seleção Passion',
    sublabel: 'Portugal Euro 2016',
    clubYear: 'European Champions · All-Time International Goalscorer',
    tag: 'PRESET 3',
    bgHex: '#0B0D0F',
    accentHex: '#C8102E',
    goldHex: '#D4AF37',
    badgeHex: '#006633',
    jerseyPattern: 'linear-gradient(135deg, #C8102E 0%, #8A0018 50%, #006633 100%)',
    description: 'High-energy Portuguese crimson red, pitch emerald green & victory gold.',
  },
  {
    id: 'red-devil',
    name: 'The Red Devil',
    sublabel: 'Manchester United (03–09 & 21–22)',
    clubYear: 'Moscow 2008 UCL · 42 Goals Ballon d’Or · 3 Premier League',
    tag: 'PRESET 4',
    bgHex: '#0B0C0E',
    accentHex: '#C70101',
    goldHex: '#D4AF37',
    badgeHex: '#FFFFFF',
    jerseyPattern: 'linear-gradient(135deg, #C70101 0%, #8A0000 60%, #14161B 100%)',
    description: 'High-contrast Old Trafford pitch, vibrant United Red, pure white & Ballon d’Or gold.',
  },
  {
    id: 'el-bicho',
    name: 'El Bicho',
    sublabel: 'Real Madrid 2.0 (2016–2018)',
    clubYear: 'Historic 3-Peat UCL Dynasty · All-Time Prime',
    tag: 'PRESET 5',
    bgHex: '#101114',
    accentHex: '#00B8B0',
    goldHex: '#D4AF37',
    badgeHex: '#6B3FA0',
    jerseyPattern: 'linear-gradient(135deg, #00B8B0 0%, #087E83 50%, #6B3FA0 100%)',
    description: 'Peak 3-Peat UEFA Champions League prime: 17/18 pitch black, electric Aero Reef turquoise, Champions purple & victory gold.',
  },
  {
    id: 'le-zebre',
    name: 'Le Zebre',
    sublabel: 'Juventus Era (2018–2021)',
    clubYear: '101 Goals · Back-to-Back Scudetto Supremacy',
    tag: 'PRESET 6',
    bgHex: '#08080A',
    accentHex: '#FFFFFF',
    goldHex: '#D4AF37',
    badgeHex: '#D4AF37',
    jerseyPattern: 'linear-gradient(135deg, #08080A 0%, #121216 45%, #FFFFFF 50%, #121216 55%, #D4AF37 100%)',
    description: 'High-fashion monochrome split panels, stark pitch black, crisp stark white & Scudetto gold supremacy.',
  },
];

interface JerseyCabinetProps {
  currentPreset: GoatPreset;
  onSelectPreset: (preset: GoatPreset) => void;
  compact?: boolean;
}

export const JerseyCabinet: React.FC<JerseyCabinetProps> = ({
  currentPreset,
  onSelectPreset,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <section
      id="jersey-cabinet"
      className="w-full rounded-2xl border backdrop-blur-xl transition-all duration-300 relative overflow-hidden my-3 shadow-lg"
      style={{
        backgroundColor: 'var(--panel-card, var(--bg-card))',
        borderColor: 'var(--panel-border, var(--border-color))',
      }}
      aria-label="The Jersey Cabinet: CR7 Era Presets"
    >
      {/* Top Banner & Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between gap-3"
        style={{ borderColor: 'var(--panel-border, var(--border-color))' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-xs border shrink-0"
            style={{
              background: 'linear-gradient(135deg, #0757C8 0%, #D4AF37 100%)',
              borderColor: 'rgba(212, 175, 55, 0.4)',
            }}
          >
            #7
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xs sm:text-sm font-black tracking-wider uppercase flex items-center gap-1.5"
                style={{ color: 'var(--text-main, var(--text-primary))' }}
              >
                <span>JERSEY CABINET</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.15)',
                    color: '#D4AF37',
                    borderColor: 'rgba(212, 175, 55, 0.3)',
                  }}
                >
                  CR7 PERFORMANCE OS
                </span>
              </h2>
            </div>
            <p className="text-[10px] sm:text-[11px] font-medium"
              style={{ color: 'var(--text-muted, var(--text-secondary))' }}
            >
              6 Curated Performance Eras · Instant Swapping · Zero Data Loss
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all hover:scale-105 cursor-pointer shrink-0"
          style={{
            backgroundColor: 'var(--panel-elevated, var(--bg-card-subtle))',
            borderColor: 'var(--panel-border, var(--border-color))',
            color: 'var(--glow-accent, var(--accent))',
          }}
          aria-expanded={isExpanded}
          title={isExpanded ? 'Collapse Jersey Cabinet' : 'Expand Jersey Cabinet'}
        >
          <span className="hidden sm:inline text-[11px]">
            {isExpanded ? 'Hide Cabinets' : 'View Kits'}
          </span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Swatches Grid */}
      {isExpanded && (
        <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-3">
          {GOAT_PRESETS.map((preset) => {
            const isActive = currentPreset === preset.id;

            return (
              <button
                key={preset.id}
                type="button"
                id={`jersey-btn-${preset.id}`}
                onClick={() => onSelectPreset(preset.id)}
                className={`group relative text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 overflow-hidden ${
                  isActive
                    ? 'ring-2 ring-sky-400 shadow-xl scale-[1.02]'
                    : 'hover:scale-[1.01] hover:border-sky-400/50 opacity-90 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isActive
                    ? 'var(--panel-elevated, #112A52)'
                    : 'var(--subboard-bg, rgba(6, 21, 46, 0.65))',
                  borderColor: isActive ? 'var(--glow-accent, #45B7FF)' : 'var(--panel-border, rgba(69, 183, 255, 0.2))',
                }}
                aria-pressed={isActive}
              >
                {/* Top: Preset Tag & Jersey Silhouette Mini Icon */}
                <div className="flex items-center justify-between gap-1.5 w-full">
                  <span
                    className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md border"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      color: isActive ? '#D4AF37' : '#D7E3F4',
                    }}
                  >
                    {preset.tag}
                  </span>

                  {/* Active Illuminated #7 Indicator */}
                  {isActive ? (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider animate-pulse border shadow-xs"
                      style={{
                        backgroundColor: '#D4AF37',
                        color: '#030A17',
                        borderColor: '#FFFFFF',
                      }}
                    >
                      <span>#7</span>
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold font-mono opacity-40 group-hover:opacity-80 transition-opacity">
                      #7
                    </span>
                  )}
                </div>

                {/* Middle: Preset Name and Sub-Label */}
                <div>
                  <h3
                    className="text-xs sm:text-sm font-black tracking-tight leading-snug group-hover:text-sky-300 transition-colors"
                    style={{ color: 'var(--text-main, #FFFFFF)' }}
                  >
                    {preset.name}
                  </h3>
                  <p
                    className="text-[11px] font-semibold mt-0.5"
                    style={{ color: 'var(--glow-accent, #45B7FF)' }}
                  >
                    {preset.sublabel}
                  </p>
                  <p
                    className="text-[10px] mt-0.5 line-clamp-1 opacity-75 font-mono"
                    style={{ color: 'var(--text-muted, #D7E3F4)' }}
                  >
                    {preset.clubYear}
                  </p>
                </div>

                {/* Bottom: Mini Color Swatch Pills (Primary Background, Accent, Trophy Gold) */}
                <div className="flex items-center justify-between pt-1 border-t border-white/10 mt-auto">
                  <div className="flex items-center gap-1.5" title="Palette Swatches: Base · Accent · Trophy Gold">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-2xs"
                      style={{ backgroundColor: preset.bgHex }}
                      title={`Primary Background: ${preset.bgHex}`}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-2xs"
                      style={{ backgroundColor: preset.accentHex }}
                      title={`Main Accent: ${preset.accentHex}`}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-2xs"
                      style={{ backgroundColor: preset.goldHex }}
                      title={`Trophy Gold: ${preset.goldHex}`}
                    />
                  </div>

                  <span
                    className="text-[9px] font-bold uppercase tracking-wider transition-colors"
                    style={{ color: isActive ? '#D4AF37' : '#D7E3F4' }}
                  >
                    {isActive ? 'ACTIVE' : 'APPLY'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};
