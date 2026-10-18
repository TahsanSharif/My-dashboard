import React from 'react';
import { Target, Flame, Trophy, Plus, Minus } from 'lucide-react';

interface CycleCounterProps {
  cycles: number;
  onUpdateCycles: (newCount: number) => void;
  containerWidth?: number;
}

export const CycleCounter: React.FC<CycleCounterProps> = ({
  cycles,
  onUpdateCycles,
  containerWidth,
}) => {
  // Motivational messages per prompt requirements:
  // 0 -> Start your first cycle.
  // 1–2 -> Good start.
  // 3–5 -> You're building momentum.
  // 6+ -> Excellent work.
  const getMotivationalMessage = (count: number) => {
    if (count === 0) return 'Start your first cycle.';
    if (count <= 2) return 'Good start.';
    if (count <= 5) return "You're building momentum.";
    return 'Excellent work.';
  };

  const getStatusIcon = (count: number) => {
    if (count === 0) return <Target className="w-5 h-5 text-amber-500" />;
    if (count <= 2) return <Flame className="w-5 h-5 text-orange-500" />;
    if (count <= 5) return <Flame className="w-5 h-5 text-rose-500" />;
    return <Trophy className="w-5 h-5 text-yellow-500 animate-bounce" />;
  };

  const handleIncrement = () => {
    onUpdateCycles(cycles + 1);
  };

  const handleDecrement = () => {
    if (cycles > 0) {
      onUpdateCycles(cycles - 1);
    }
  };

  return (
    <div
      id="cycle-counter-card"
      className="w-full h-full relative overflow-y-auto overflow-x-hidden min-h-0 flex flex-col justify-start gap-2 transition-all duration-200"
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: '8px',
        padding: '10px 12px',
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className="p-2 rounded-xl border shadow-2xs"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            {getStatusIcon(cycles)}
          </div>
          <div>
            <h3
              id="cycle-hardware-badge"
              className="text-xs font-bold tracking-wider uppercase hardware-engraved-badge"
              style={{ color: 'var(--text-muted)' }}
            >
              TODAY'S CYCLES
            </h3>
            <span
              className="text-[11px] font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Life Pivot Target: 6+
            </span>
          </div>
        </div>

        {/* Manual +/- adjustment buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleDecrement}
            disabled={cycles === 0}
            className="w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold transition-transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
            title="Decrease count"
            aria-label="Decrease cycle count"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleIncrement}
            className="w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
              color: 'var(--accent)',
            }}
            title="Manually log 1 finished study session"
            aria-label="Increase cycle count"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Big Number */}
      <div
        id="cycle-crt-screen"
        className="my-auto flex-1 flex flex-col items-center justify-center p-3 sm:p-5 w-full max-w-xs mx-auto text-center select-none crt-screen-inset relative overflow-hidden rounded-2xl border min-h-0"
      >
        {/* UCL Stadium Glassmorphic Blurry Background Layer - Scoped exclusively to European Nights */}
        <div
          className="ucl-glass-stadium-layer absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] z-0"
          aria-hidden="true"
        >
          <div
            className="absolute -inset-4 bg-cover bg-center"
            style={{
              backgroundImage: `url('/assets/ucl-clock-glass-bg.jpg')`,
              filter: 'blur(9px) brightness(0.52) saturate(1.4)',
              transform: 'scale(1.08)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-slate-950/65 to-black/85 backdrop-blur-md" />
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_bottom,rgba(69,183,255,0.25)_0%,rgba(168,85,247,0.12)_40%,transparent_75%)]" />
        </div>

        <div className="relative z-10">
          <div
            id="cycle-count-number"
            className="text-6xl sm:text-7xl font-black font-mono tracking-tight font-mono-numbers"
            style={{ color: 'var(--text-primary)' }}
          >
            {cycles}
          </div>
          <p
            className="text-xs sm:text-sm font-semibold mt-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            Study cycles completed
          </p>
        </div>
      </div>

      {/* Motivational message banner */}
      <div
        id="cycle-motivational-message"
        className="px-4 py-2.5 rounded-2xl border text-center text-xs sm:text-sm font-bold shadow-2xs transition-colors"
        style={{
          backgroundColor: 'var(--accent-soft)',
          borderColor: 'var(--border-color)',
          color: 'var(--accent-text)',
        }}
      >
        {getMotivationalMessage(cycles)}
      </div>
    </div>
  );
};
