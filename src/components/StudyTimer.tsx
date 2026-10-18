import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward, BookOpen, Coffee, Sparkles } from 'lucide-react';
import { TimerPhase, TimerSettings, TimerState } from '../types';
import { playTimerCompletionSound, playRefereeWhistleSound } from '../utils/audio';
import { loadTimerState, saveTimerState, recordStudyTimeSession } from '../utils/storage';
import { JarvisCircularHud } from './JarvisCircularHud';

interface StudyTimerProps {
  settings: TimerSettings;
  onStudyCycleCompleted: () => void;
  onOpenSettings: () => void;
  containerWidth?: number;
  containerHeight?: number;
  todayStudySeconds?: number;
  dailyGoalHours?: number;
  onStudyTimeTick?: () => void;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({
  settings,
  onStudyCycleCompleted,
  onOpenSettings,
  containerWidth,
  containerHeight,
  todayStudySeconds,
  dailyGoalHours,
  onStudyTimeTick,
}) => {
  const [timerState, setTimerState] = useState<TimerState>(() =>
    loadTimerState(settings.studyMinutes)
  );

  const timerRef = useRef<number | null>(null);

  // Helper to get total duration in ms for a phase
  const getPhaseDurationMs = useCallback(
    (phase: TimerPhase) => {
      switch (phase) {
        case 'study':
          return settings.studyMinutes * 60 * 1000;
        case 'shortBreak':
          return settings.shortBreakMinutes * 60 * 1000;
        case 'longBreak':
          return settings.longBreakMinutes * 60 * 1000;
      }
    },
    [settings.studyMinutes, settings.shortBreakMinutes, settings.longBreakMinutes]
  );

  // Send desktop notification if enabled
  const triggerNotification = useCallback(
    (title: string, body: string) => {
      if (
        settings.notificationsEnabled &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        try {
          new Notification(title, {
            body,
            icon: '/favicon.ico',
          });
        } catch {
          // ignore
        }
      }
    },
    [settings.notificationsEnabled]
  );

  // Transition to next phase
  const advanceToNextPhase = useCallback(
    (currentPhase: TimerPhase, currentCycleIndex: number, wasNaturalCompletion: boolean) => {
      if (settings.soundEnabled && wasNaturalCompletion) {
        const isGoatTheme = document.documentElement.getAttribute('data-style') === 'goat';
        if (isGoatTheme) {
          playRefereeWhistleSound(false);
        } else {
          playTimerCompletionSound();
        }
      }

      // If completing study phase, flush any remaining study seconds up to targetEndTime
      if (currentPhase === 'study') {
        const now = Date.now();
        if (timerState.lastStudyTick) {
          const studySessionEnd = timerState.targetEndTime ? Math.min(now, timerState.targetEndTime) : now;
          const elapsedMs = Math.max(0, studySessionEnd - timerState.lastStudyTick);
          const elapsedSec = Math.floor(elapsedMs / 1000);
          if (elapsedSec > 0) {
            recordStudyTimeSession(elapsedSec, timerState.lastStudyTick, timerState.lastStudyTick + elapsedSec * 1000);
            onStudyTimeTick?.();
          }
        }
      }

      let nextPhase: TimerPhase = 'study';
      let nextCycleIndex = currentCycleIndex;

      if (currentPhase === 'study') {
        if (wasNaturalCompletion) {
          onStudyCycleCompleted();
        }

        if (currentCycleIndex >= settings.cyclesBeforeLongBreak) {
          nextPhase = 'longBreak';
          triggerNotification(
            '🌟 Long Break Time!',
            `Great job! You finished ${settings.cyclesBeforeLongBreak} study cycles. Rest for ${settings.longBreakMinutes} minutes.`
          );
        } else {
          nextPhase = 'shortBreak';
          triggerNotification(
            '☕ Short Break Time!',
            `Study session complete. Take a refreshing ${settings.shortBreakMinutes}-minute break.`
          );
        }
      } else if (currentPhase === 'shortBreak') {
        nextPhase = 'study';
        nextCycleIndex = currentCycleIndex + 1;
        triggerNotification(
          '📚 Back to Study!',
          `Break is over. Starting cycle #${nextCycleIndex}. Focus and conquer!`
        );
      } else if (currentPhase === 'longBreak') {
        nextPhase = 'study';
        nextCycleIndex = 1; // Restart cycle count
        triggerNotification(
          '🔥 New Study Sequence!',
          `Long break finished. Starting a fresh cycle sequence!`
        );
      }

      const nextDuration = getPhaseDurationMs(nextPhase);
      const newState: TimerState = {
        phase: nextPhase,
        isRunning: false, // We pause at transition so user can stretch
        targetEndTime: null,
        remainingMs: nextDuration,
        cycleIndex: nextCycleIndex,
        lastUpdated: Date.now(),
        lastStudyTick: null,
      };

      setTimerState(newState);
      saveTimerState(newState);
    },
    [
      settings.cyclesBeforeLongBreak,
      settings.longBreakMinutes,
      settings.shortBreakMinutes,
      settings.soundEnabled,
      getPhaseDurationMs,
      onStudyCycleCompleted,
      triggerNotification,
      timerState.lastStudyTick,
      timerState.targetEndTime,
      onStudyTimeTick,
    ]
  );

  // Heartbeat loop using interval for high accuracy + wall-clock timestamp calculations
  useEffect(() => {
    if (!timerState.isRunning || !timerState.targetEndTime) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const checkTime = () => {
      const now = Date.now();
      const remaining = Math.max(0, (timerState.targetEndTime || now) - now);

      if (remaining <= 0) {
        // Natural completion
        advanceToNextPhase(timerState.phase, timerState.cycleIndex, true);
      } else {
        let updatedLastStudyTick = timerState.lastStudyTick;

        // If in STUDY phase, accurately accumulate study seconds via wall-clock timestamps
        if (timerState.phase === 'study') {
          const lastTick = timerState.lastStudyTick || now;
          const studySessionBoundary = Math.min(now, timerState.targetEndTime || now);
          const elapsedMs = Math.max(0, studySessionBoundary - lastTick);
          const elapsedSec = Math.floor(elapsedMs / 1000);

          if (elapsedSec > 0) {
            recordStudyTimeSession(elapsedSec, lastTick, lastTick + elapsedSec * 1000);
            updatedLastStudyTick = lastTick + elapsedSec * 1000;
            onStudyTimeTick?.();
          } else if (!timerState.lastStudyTick) {
            updatedLastStudyTick = now;
          }
        }

        setTimerState((prev) => {
          const updated: TimerState = {
            ...prev,
            remainingMs: remaining,
            lastUpdated: now,
            lastStudyTick: prev.phase === 'study' ? updatedLastStudyTick : null,
          };
          saveTimerState(updated);
          return updated;
        });
      }
    };

    checkTime();
    timerRef.current = window.setInterval(checkTime, 500);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    timerState.isRunning,
    timerState.targetEndTime,
    timerState.phase,
    timerState.cycleIndex,
    timerState.lastStudyTick,
    advanceToNextPhase,
    onStudyTimeTick,
  ]);

  // Window unload / visibilitychange flush to ensure zero study time loss on tab close / switch
  useEffect(() => {
    const flushStudyTime = () => {
      if (timerState.isRunning && timerState.phase === 'study' && timerState.lastStudyTick) {
        const now = Date.now();
        const studySessionBoundary = timerState.targetEndTime ? Math.min(now, timerState.targetEndTime) : now;
        const elapsedMs = Math.max(0, studySessionBoundary - timerState.lastStudyTick);
        const elapsedSec = Math.floor(elapsedMs / 1000);
        if (elapsedSec > 0) {
          recordStudyTimeSession(elapsedSec, timerState.lastStudyTick, timerState.lastStudyTick + elapsedSec * 1000);
          onStudyTimeTick?.();
        }
      }
    };

    window.addEventListener('beforeunload', flushStudyTime);
    document.addEventListener('visibilitychange', flushStudyTime);
    return () => {
      window.removeEventListener('beforeunload', flushStudyTime);
      document.removeEventListener('visibilitychange', flushStudyTime);
    };
  }, [
    timerState.isRunning,
    timerState.phase,
    timerState.lastStudyTick,
    timerState.targetEndTime,
    onStudyTimeTick,
  ]);

  // Controls: START, PAUSE, RESET, SKIP
  const handleStart = () => {
    if (settings.soundEnabled && document.documentElement.getAttribute('data-style') === 'goat') {
      playRefereeWhistleSound(true);
    }
    const now = Date.now();
    const duration = timerState.remainingMs > 0 ? timerState.remainingMs : getPhaseDurationMs(timerState.phase);
    const target = now + duration;

    const newState: TimerState = {
      ...timerState,
      isRunning: true,
      remainingMs: duration,
      targetEndTime: target,
      lastUpdated: now,
      lastStudyTick: timerState.phase === 'study' ? now : null,
    };
    setTimerState(newState);
    saveTimerState(newState);
  };

  const handlePause = () => {
    const now = Date.now();

    // Flush any pending study seconds up to pause moment
    if (timerState.phase === 'study' && timerState.lastStudyTick) {
      const studySessionBoundary = timerState.targetEndTime ? Math.min(now, timerState.targetEndTime) : now;
      const elapsedMs = Math.max(0, studySessionBoundary - timerState.lastStudyTick);
      const elapsedSec = Math.floor(elapsedMs / 1000);
      if (elapsedSec > 0) {
        recordStudyTimeSession(elapsedSec, timerState.lastStudyTick, timerState.lastStudyTick + elapsedSec * 1000);
        onStudyTimeTick?.();
      }
    }

    const remaining = timerState.targetEndTime ? Math.max(0, timerState.targetEndTime - now) : timerState.remainingMs;

    const newState: TimerState = {
      ...timerState,
      isRunning: false,
      remainingMs: remaining,
      targetEndTime: null,
      lastStudyTick: null,
      lastUpdated: now,
    };
    setTimerState(newState);
    saveTimerState(newState);
  };

  const handleReset = () => {
    const now = Date.now();

    // Flush study seconds accumulated up to reset point before stopping
    if (timerState.phase === 'study' && timerState.isRunning && timerState.lastStudyTick) {
      const studySessionBoundary = timerState.targetEndTime ? Math.min(now, timerState.targetEndTime) : now;
      const elapsedMs = Math.max(0, studySessionBoundary - timerState.lastStudyTick);
      const elapsedSec = Math.floor(elapsedMs / 1000);
      if (elapsedSec > 0) {
        recordStudyTimeSession(elapsedSec, timerState.lastStudyTick, timerState.lastStudyTick + elapsedSec * 1000);
        onStudyTimeTick?.();
      }
    }

    const defaultDuration = getPhaseDurationMs(timerState.phase);
    const newState: TimerState = {
      ...timerState,
      isRunning: false,
      remainingMs: defaultDuration,
      targetEndTime: null,
      lastStudyTick: null,
      lastUpdated: now,
    };
    setTimerState(newState);
    saveTimerState(newState);
  };

  const handleSkip = () => {
    const now = Date.now();

    // Flush any pending study seconds up to skip moment
    if (timerState.phase === 'study' && timerState.isRunning && timerState.lastStudyTick) {
      const studySessionBoundary = timerState.targetEndTime ? Math.min(now, timerState.targetEndTime) : now;
      const elapsedMs = Math.max(0, studySessionBoundary - timerState.lastStudyTick);
      const elapsedSec = Math.floor(elapsedMs / 1000);
      if (elapsedSec > 0) {
        recordStudyTimeSession(elapsedSec, timerState.lastStudyTick, timerState.lastStudyTick + elapsedSec * 1000);
        onStudyTimeTick?.();
      }
    }

    // Manually advance without counting towards cycle completion
    advanceToNextPhase(timerState.phase, timerState.cycleIndex, false);
  };

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do NOT trigger if inside input or textarea
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (timerState.isRunning) {
          handlePause();
        } else {
          handleStart();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        handleReset();
      } else if (e.key === 's' || e.key === 'S') {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Calculate formatted time
  const totalPhaseSeconds = Math.max(1, Math.floor(getPhaseDurationMs(timerState.phase) / 1000));
  const currentSeconds = Math.ceil(timerState.remainingMs / 1000);
  const progressRatio = Math.max(0, Math.min(1, 1 - currentSeconds / totalPhaseSeconds));

  const hours = Math.floor(currentSeconds / 3600);
  const minutes = Math.floor((currentSeconds % 3600) / 60);
  const seconds = currentSeconds % 60;

  const timeFormatted =
    hours > 0
      ? `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes.toString().padStart(2, '0')}:${seconds
          .toString()
          .padStart(2, '0')}`;

  const phaseMeta = {
    study: {
      label: 'STUDY',
      icon: <BookOpen className="w-4 h-4" />,
      tag: `Cycle ${timerState.cycleIndex} of ${settings.cyclesBeforeLongBreak}`,
      color: 'var(--timer-study-color, var(--accent))',
    },
    shortBreak: {
      label: 'SHORT BREAK',
      icon: <Coffee className="w-4 h-4" />,
      tag: 'Relax & hydrate',
      color: 'var(--timer-break-color, #10b981)',
    },
    longBreak: {
      label: 'LONG BREAK',
      icon: <Sparkles className="w-4 h-4" />,
      tag: 'Full recovery pause',
      color: 'var(--timer-longbreak-color, #8b5cf6)',
    },
  }[timerState.phase];

  const isCompact = containerWidth ? containerWidth < 420 : false;
  const isMedium = containerWidth ? containerWidth >= 420 && containerWidth < 680 : false;
  const isShort = containerHeight ? containerHeight < 340 : false;

  return (
    <div
      id="study-timer-container"
      data-phase={timerState.phase}
      className="w-full h-full relative overflow-y-auto overflow-x-hidden min-h-0 flex flex-col justify-start gap-2 transition-all duration-200"
      style={{
        color: 'var(--text-primary)',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: '8px',
        padding: isCompact ? '10px 12px' : '14px 16px',
      }}
    >
      {/* Top Banner with Phase Tag */}
      <div className="flex items-center justify-between gap-2 mb-1 shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            id="timer-phase-badge"
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shrink-0"
            style={{ backgroundColor: phaseMeta.color }}
          >
            {phaseMeta.icon}
            <span>{phaseMeta.label}</span>
          </span>
          {!isCompact && (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-md border truncate"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
            >
              {phaseMeta.tag}
            </span>
          )}
        </div>

        {/* Quick config button */}
        <button
          onClick={onOpenSettings}
          className="text-xs font-semibold hover:underline opacity-80 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
          style={{ color: 'var(--accent)' }}
          aria-label="Customize timer lengths"
        >
          Customize
        </button>
      </div>

      {/* Main Digital Timer Display with circular HUD in JARVIS theme */}
      <div
        id="timer-crt-screen"
        className="flex-1 w-full min-h-0 flex flex-col items-center justify-center py-2 px-3 max-w-xl mx-auto text-center select-none crt-screen-inset relative overflow-hidden rounded-2xl border"
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
          {/* Frosted Dark Glass Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-slate-950/65 to-black/85 backdrop-blur-md" />
          {/* Subtle Stadium Light Sweep */}
          <div className="absolute inset-0 opacity-35 bg-[radial-gradient(ellipse_at_bottom,rgba(69,183,255,0.3)_0%,rgba(168,85,247,0.15)_40%,transparent_75%)]" />
        </div>

        {/* Circular HUD element for JARVIS Command Center */}
        <JarvisCircularHud variant="timer" phase={timerState.phase} isRunning={timerState.isRunning} />

        <h3
          id="timer-phase-header"
          className="text-[11px] font-bold tracking-widest uppercase mb-0.5 opacity-70 relative z-10"
          style={{ color: 'var(--text-muted)' }}
        >
          {phaseMeta.label} SESSION
        </h3>
        <div
          id="timer-countdown-display"
          className="font-black font-mono tracking-tight font-mono-numbers my-1 select-none relative z-10 whitespace-nowrap"
          style={{
            color: 'var(--text-primary)',
            fontSize: `clamp(1.75rem, ${Math.min(
              Math.max(20, Math.round((containerWidth || 480) / 7.5)),
              Math.max(20, Math.round(((containerHeight || 300) - 140) * 0.38)),
              72
            )}px, 4.5rem)`,
            lineHeight: 1.05,
          }}
        >
          {timeFormatted}
        </div>

        {/* Linear Progress Bar */}
        <div
          className="w-full max-w-md mx-auto h-2 rounded-full overflow-hidden mt-2 border shrink-0"
          style={{
            backgroundColor: 'var(--bg-card-subtle)',
            borderColor: 'var(--border-color)',
          }}
          role="progressbar"
          aria-valuenow={Math.round(progressRatio * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${Math.round(progressRatio * 100)}%`,
              backgroundColor: phaseMeta.color,
            }}
          />
        </div>
      </div>

      {/* Primary Buttons: START, PAUSE, RESET, SKIP */}
      <div className="shrink-0 flex items-center justify-center gap-2 sm:gap-3 flex-wrap mt-2 w-full">
        {!timerState.isRunning ? (
          <button
            id="timer-start-btn"
            onClick={handleStart}
            className={`flex items-center justify-center gap-1.5 rounded-2xl font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer min-h-[44px] ${
              isCompact ? 'px-4 py-2 text-xs' : 'px-6 sm:px-8 py-2.5 text-sm sm:text-base'
            }`}
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>START</span>
          </button>
        ) : (
          <button
            id="timer-pause-btn"
            onClick={handlePause}
            className={`flex items-center justify-center gap-1.5 rounded-2xl font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer bg-amber-500 hover:bg-amber-600 min-h-[44px] ${
              isCompact ? 'px-4 py-2 text-xs' : 'px-6 sm:px-8 py-2.5 text-sm sm:text-base'
            }`}
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>PAUSE</span>
          </button>
        )}

        <button
          id="timer-reset-btn"
          onClick={handleReset}
          className={`flex items-center justify-center gap-1.5 rounded-2xl font-semibold border shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer min-h-[44px] ${
            isCompact ? 'px-3 py-2 text-xs' : 'px-4 sm:px-5 py-2.5 text-xs sm:text-sm'
          }`}
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
          title="Reset current session (Shortcut: R)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET</span>
        </button>

        <button
          id="timer-skip-btn"
          onClick={handleSkip}
          className={`flex items-center justify-center gap-1.5 rounded-2xl font-semibold border shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer min-h-[44px] ${
            isCompact ? 'px-3 py-2 text-xs' : 'px-4 sm:px-5 py-2.5 text-xs sm:text-sm'
          }`}
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
          title="Skip to next phase without cycle credit (Shortcut: S)"
        >
          <SkipForward className="w-3.5 h-3.5" />
          <span>SKIP</span>
        </button>
      </div>

      {/* Keyboard Shortcuts Hint */}
      {!isShort && (
        <div
          className="shrink-0 mt-1 pt-1.5 border-t flex items-center justify-center gap-3 sm:gap-6 text-[11px] font-mono select-none"
          style={{
            borderColor: 'var(--border-color)',
            color: 'var(--text-muted)',
          }}
        >
          <span>
            <kbd className="px-1.5 py-0.5 rounded border shadow-2xs font-semibold">Space</kbd> Start / Pause
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded border shadow-2xs font-semibold">R</kbd> Reset
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded border shadow-2xs font-semibold">S</kbd> Skip
          </span>
        </div>
      )}
    </div>
  );
};
