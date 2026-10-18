import React, { useState, useMemo, useRef } from 'react';
import {
  History,
  ChevronDown,
  ChevronUp,
  Calendar,
  CheckCircle,
  Flame,
  Target,
  Trophy,
  Clock,
  TrendingUp,
  BarChart2,
  Download,
  Upload,
  Check,
  Edit2,
  Sparkles,
} from 'lucide-react';
import { DailyRecord } from '../types';
import {
  getTodayKey,
  exportBackupData,
  importBackupData,
  saveDailyStudyGoal,
} from '../utils/storage';

interface StudyHistoryProps {
  history: DailyRecord[];
  todayStudySeconds?: number;
  dailyGoalHours?: number;
  onUpdateDailyGoal?: (hours: number) => void;
  onRefreshData?: () => void;
}

function formatHoursMinutes(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return '0h 0m';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function formatDecimalHours(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return '0.0h';
  return `${(totalSeconds / 3600).toFixed(1)}h`;
}

export const StudyHistory: React.FC<StudyHistoryProps> = ({
  history,
  todayStudySeconds = 0,
  dailyGoalHours = 8,
  onUpdateDailyGoal,
  onRefreshData,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [customGoalInput, setCustomGoalInput] = useState(dailyGoalHours.toString());
  const [notificationMsg, setNotificationMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const todayKey = getTodayKey();

  // Merge today's active study time into the daily records view seamlessly
  const mergedRecords = useMemo(() => {
    const list = [...history];
    const todayIndex = list.findIndex((r) => r.dateKey === todayKey);

    if (todayIndex >= 0) {
      const existing = list[todayIndex];
      const mergedStudySec = Math.max(existing.studyDurationSeconds || 0, todayStudySeconds);
      list[todayIndex] = {
        ...existing,
        studyDurationSeconds: mergedStudySec,
      };
    } else if (todayStudySeconds > 0) {
      // Prepend today's active record if not yet committed into history
      list.unshift({
        dateKey: todayKey,
        displayDate: 'Today',
        cyclesCompleted: 0,
        tasksCompleted: 0,
        tasksTotal: 0,
        studyDurationSeconds: todayStudySeconds,
      });
    }

    return list;
  }, [history, todayKey, todayStudySeconds]);

  // 1. Today's Study Time
  const actualTodaySeconds = useMemo(() => {
    const found = mergedRecords.find((r) => r.dateKey === todayKey);
    return Math.max(found?.studyDurationSeconds || 0, todayStudySeconds);
  }, [mergedRecords, todayKey, todayStudySeconds]);

  // 2. Daily Goal in Seconds & Progress Percentage
  const goalTargetSeconds = dailyGoalHours * 3600;
  const goalProgressPercentage = Math.min(
    100,
    goalTargetSeconds > 0 ? (actualTodaySeconds / goalTargetSeconds) * 100 : 0
  );
  const isGoalReached = actualTodaySeconds >= goalTargetSeconds;
  const remainingToGoalSeconds = Math.max(0, goalTargetSeconds - actualTodaySeconds);

  // 3. Average Daily Study Time across recorded days with study activity
  const { totalStudySeconds, avgDailyStudySeconds, longestDayRecord, totalCycles, totalTasks } =
    useMemo(() => {
      let sumSeconds = 0;
      let sumCycles = 0;
      let sumTasks = 0;
      let maxRecord: { dateKey: string; displayDate: string; seconds: number } | null = null;

      mergedRecords.forEach((record) => {
        const sec = record.studyDurationSeconds || 0;
        sumSeconds += sec;
        sumCycles += record.cyclesCompleted || 0;
        sumTasks += record.tasksCompleted || 0;

        if (sec > 0 && (!maxRecord || sec > maxRecord.seconds)) {
          maxRecord = {
            dateKey: record.dateKey,
            displayDate: record.displayDate,
            seconds: sec,
          };
        }
      });

      const daysCount = mergedRecords.length > 0 ? mergedRecords.length : 1;
      const avgSec = Math.round(sumSeconds / daysCount);

      return {
        totalStudySeconds: sumSeconds,
        avgDailyStudySeconds: avgSec,
        longestDayRecord: maxRecord,
        totalCycles: sumCycles,
        totalTasks: sumTasks,
      };
    }, [mergedRecords]);

  // Handle setting daily study goal
  const handleSelectGoal = (hours: number) => {
    if (hours > 0 && hours <= 24) {
      saveDailyStudyGoal(hours);
      if (onUpdateDailyGoal) onUpdateDailyGoal(hours);
      setIsEditingGoal(false);
      setCustomGoalInput(hours.toString());
    }
  };

  const handleCustomGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customGoalInput);
    if (!isNaN(val) && val >= 1 && val <= 24) {
      handleSelectGoal(val);
    }
  };

  // Handle JSON export
  const handleExport = () => {
    try {
      const dataStr = exportBackupData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lifepivot_backup_${todayKey}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setNotificationMsg({ text: 'Backup exported successfully!', type: 'success' });
      setTimeout(() => setNotificationMsg(null), 3000);
    } catch {
      setNotificationMsg({ text: 'Failed to export backup.', type: 'error' });
      setTimeout(() => setNotificationMsg(null), 3000);
    }
  };

  // Handle JSON import
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const result = importBackupData(content);
        if (result.success) {
          setNotificationMsg({ text: 'Backup imported successfully! Reloading data...', type: 'success' });
          if (onRefreshData) onRefreshData();
          setTimeout(() => {
            window.location.reload();
          }, 600);
        } else {
          setNotificationMsg({ text: result.message || 'Invalid backup file', type: 'error' });
        }
      } catch {
        setNotificationMsg({ text: 'Error reading backup file', type: 'error' });
      }
      setTimeout(() => setNotificationMsg(null), 3500);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Visual Chart Data (Up to the last 10 days for clean responsive layout)
  const chartDays = useMemo(() => {
    // Show in chronological order from left to right (oldest to newest)
    const reversed = [...mergedRecords].reverse();
    return reversed.slice(-10);
  }, [mergedRecords]);

  const maxChartSeconds = useMemo(() => {
    const maxDay = Math.max(...chartDays.map((d) => d.studyDurationSeconds || 0), 0);
    return Math.max(goalTargetSeconds, maxDay, 3600 * 4); // At least 4h for good scaling
  }, [chartDays, goalTargetSeconds]);

  return (
    <section id="study-history-section" className="w-full my-6">
      <div
        className="w-full rounded-3xl border shadow-sm transition-all overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Accordion Trigger Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 sm:p-6 flex items-center justify-between text-left cursor-pointer hover:opacity-95 transition-opacity"
          aria-expanded={isOpen}
          aria-controls="study-history-content"
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 sm:p-2.5 rounded-2xl border shadow-2xs shrink-0"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
              }}
            >
              <History className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className="text-xs sm:text-sm font-black tracking-wider uppercase"
                  style={{ color: 'var(--text-primary)' }}
                >
                  DAILY STUDY HOURS & STATISTICS
                </h3>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs"
                  style={{
                    backgroundColor: 'var(--accent-soft)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--accent-text)',
                  }}
                >
                  {mergedRecords.length} days recorded
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                <span>
                  Today: <strong style={{ color: 'var(--accent-text)' }}>{formatHoursMinutes(actualTodaySeconds)}</strong>
                </span>
                <span className="opacity-40">•</span>
                <span>
                  Goal: <strong>{dailyGoalHours}h ({goalProgressPercentage.toFixed(0)}%)</strong>
                </span>
                <span className="opacity-40 hidden sm:inline">•</span>
                <span className="hidden sm:inline">
                  All-Time: <strong>{formatHoursMinutes(totalStudySeconds)}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold shrink-0" style={{ color: 'var(--accent)' }}>
            <span className="hidden sm:inline">{isOpen ? 'Hide Stats & History' : 'View Full Statistics'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {/* Accordion Content */}
        {isOpen && (
          <div
            id="study-history-content"
            className="px-4 sm:px-6 pb-6 pt-2 border-t animate-in fade-in duration-200"
            style={{ borderColor: 'var(--border-color)' }}
          >
            {/* Notification Toast */}
            {notificationMsg && (
              <div
                className={`mb-4 px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-between ${
                  notificationMsg.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
                }`}
              >
                <span>{notificationMsg.text}</span>
              </div>
            )}

            {/* 1. FOUR MAIN STATISTICS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {/* Card 1: Today's Study Time & Goal Progress */}
              <div
                className="p-4 rounded-2xl border flex flex-col justify-between shadow-2xs transition-all relative overflow-hidden"
                style={{
                  backgroundColor: 'var(--bg-card-subtle)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>Today's Study Time</span>
                    </span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{
                        backgroundColor: isGoalReached ? 'rgba(16, 185, 129, 0.15)' : 'var(--accent-soft)',
                        color: isGoalReached ? '#10b981' : 'var(--accent-text)',
                      }}
                    >
                      {goalProgressPercentage.toFixed(0)}% Done
                    </span>
                  </div>

                  <div className="text-2xl sm:text-3xl font-black font-mono-numbers my-1" style={{ color: 'var(--accent-text)' }}>
                    {formatHoursMinutes(actualTodaySeconds)}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div
                    className="w-full h-2 rounded-full overflow-hidden border"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${goalProgressPercentage}%`,
                        background: isGoalReached
                          ? 'linear-gradient(90deg, #10b981, #059669)'
                          : 'var(--accent-gradient)',
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] mt-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>
                    <span>Target: {dailyGoalHours}h</span>
                    <span>
                      {isGoalReached ? '🎉 Goal Reached!' : `${formatHoursMinutes(remainingToGoalSeconds)} left`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Daily Study Goal Target & Customization */}
              <div
                className="p-4 rounded-2xl border flex flex-col justify-between shadow-2xs transition-all"
                style={{
                  backgroundColor: 'var(--bg-card-subtle)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                      <Target className="w-3.5 h-3.5 text-amber-500" />
                      <span>Daily Study Goal</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingGoal(!isEditingGoal)}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 hover:scale-105 transition-all cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--accent)',
                      }}
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                      <span>{isEditingGoal ? 'Close' : 'Change'}</span>
                    </button>
                  </div>

                  <div className="text-2xl sm:text-3xl font-black font-mono-numbers my-1" style={{ color: 'var(--text-primary)' }}>
                    {dailyGoalHours} <span className="text-sm font-bold text-opacity-70 font-sans">Hours/Day</span>
                  </div>
                </div>

                {/* Quick Presets or Custom Input */}
                <div className="mt-2.5 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  {!isEditingGoal ? (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[6, 8, 10].map((hours) => (
                        <button
                          key={hours}
                          type="button"
                          onClick={() => handleSelectGoal(hours)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                            dailyGoalHours === hours ? 'ring-2 ring-[var(--accent)] font-black' : 'opacity-80 hover:opacity-100'
                          }`}
                          style={{
                            backgroundColor: dailyGoalHours === hours ? 'var(--accent-soft)' : 'var(--bg-card)',
                            borderColor: 'var(--border-color)',
                            color: dailyGoalHours === hours ? 'var(--accent-text)' : 'var(--text-secondary)',
                          }}
                        >
                          {hours}h Goal
                        </button>
                      ))}
                    </div>
                  ) : (
                    <form onSubmit={handleCustomGoalSubmit} className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        max="24"
                        step="0.5"
                        value={customGoalInput}
                        onChange={(e) => setCustomGoalInput(e.target.value)}
                        placeholder="Hours"
                        className="w-16 px-2 py-1 text-xs rounded-lg border font-mono font-bold"
                        style={{
                          backgroundColor: 'var(--bg-card)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)',
                        }}
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-2.5 py-1 text-[10px] font-bold rounded-lg text-white transition-all cursor-pointer shadow-2xs"
                        style={{ backgroundColor: 'var(--accent)' }}
                      >
                        Save
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Card 3: Average Daily Study Time */}
              <div
                className="p-4 rounded-2xl border flex flex-col justify-between shadow-2xs transition-all"
                style={{
                  backgroundColor: 'var(--bg-card-subtle)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Average Daily Study Time</span>
                    </span>
                  </div>

                  <div className="text-2xl sm:text-3xl font-black font-mono-numbers my-1 text-emerald-600 dark:text-emerald-400">
                    {formatHoursMinutes(avgDailyStudySeconds)}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t text-[11px] font-medium flex items-center justify-between" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                  <span>Consistency Rate:</span>
                  <span className="font-bold font-mono">
                    {((avgDailyStudySeconds / goalTargetSeconds) * 100).toFixed(0)}% of goal
                  </span>
                </div>
              </div>

              {/* Card 4: Total Study Hours & Longest Study Day */}
              <div
                className="p-4 rounded-2xl border flex flex-col justify-between shadow-2xs transition-all"
                style={{
                  backgroundColor: 'var(--bg-card-subtle)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                      <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                      <span>Total Study Hours</span>
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-600 dark:text-yellow-400">
                      All-Time
                    </span>
                  </div>

                  <div className="text-2xl sm:text-3xl font-black font-mono-numbers my-1" style={{ color: 'var(--text-primary)' }}>
                    {formatHoursMinutes(totalStudySeconds)}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t text-[11px] flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="font-semibold flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Longest Day:</span>
                  </span>
                  <span className="font-bold text-xs font-mono" style={{ color: 'var(--accent-text)' }}>
                    {longestDayRecord ? `${longestDayRecord.displayDate} (${formatHoursMinutes(longestDayRecord.seconds)})` : 'None yet'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. VISUAL STUDY CONSISTENCY CHART (BAR CHART OVER RECENT DAYS) */}
            <div
              className="p-4 sm:p-5 rounded-2xl border mb-6 shadow-2xs"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  <h4 className="text-xs font-black tracking-wider uppercase" style={{ color: 'var(--text-primary)' }}>
                    STUDY TIME CONSISTENCY TRENDS
                  </h4>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--accent-gradient)' }} />
                    <span>Study Hours</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-0.5 border-b border-dashed border-amber-500" />
                    <span>Goal ({dailyGoalHours}h)</span>
                  </div>
                </div>
              </div>

              {/* Chart Bars */}
              <div className="relative pt-4 pb-2">
                {/* Horizontal Goal Target Line */}
                <div
                  className="absolute left-0 right-0 border-b border-dashed border-amber-500/60 z-0 pointer-events-none flex justify-end"
                  style={{
                    bottom: `${Math.min(95, Math.max(5, (goalTargetSeconds / maxChartSeconds) * 160))}px`,
                  }}
                >
                  <span className="text-[9px] font-bold text-amber-500 bg-[var(--bg-card)] px-1 rounded -translate-y-2 border border-amber-500/30">
                    Goal: {dailyGoalHours}h
                  </span>
                </div>

                {/* Bars Grid */}
                <div className="flex items-end justify-between gap-1.5 sm:gap-3 h-44 w-full relative z-10 overflow-x-auto pb-1">
                  {chartDays.map((day) => {
                    const sec = day.studyDurationSeconds || 0;
                    const heightPercent = maxChartSeconds > 0 ? Math.min(100, Math.max(4, (sec / maxChartSeconds) * 100)) : 4;
                    const isDayGoalMet = sec >= goalTargetSeconds;
                    const isTodayBar = day.dateKey === todayKey;

                    return (
                      <div
                        key={day.dateKey}
                        className="flex-1 min-w-[36px] max-w-[64px] flex flex-col items-center justify-end h-full group"
                      >
                        {/* Hover Tooltip or Top Value */}
                        <div
                          className="text-[9px] font-mono font-bold mb-1 opacity-80 group-hover:opacity-100 transition-opacity truncate"
                          style={{
                            color: isDayGoalMet ? '#10b981' : isTodayBar ? 'var(--accent-text)' : 'var(--text-muted)',
                          }}
                        >
                          {formatDecimalHours(sec)}
                        </div>

                        {/* Bar */}
                        <div
                          className="w-full rounded-t-xl transition-all duration-300 group-hover:scale-102 border shadow-xs"
                          style={{
                            height: `${heightPercent}%`,
                            background: isDayGoalMet
                              ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)'
                              : isTodayBar
                              ? 'var(--accent-gradient)'
                              : 'linear-gradient(180deg, var(--accent) 0%, rgba(99, 102, 241, 0.4) 100%)',
                            borderColor: isDayGoalMet ? '#059669' : 'var(--border-color)',
                            opacity: sec === 0 ? 0.35 : 0.95,
                          }}
                          title={`${day.displayDate}: ${formatHoursMinutes(sec)} (${((sec / goalTargetSeconds) * 100).toFixed(0)}% of goal)`}
                        />

                        {/* Date Label */}
                        <div
                          className={`mt-2 text-[10px] font-semibold text-center truncate w-full ${
                            isTodayBar ? 'font-black underline' : ''
                          }`}
                          style={{
                            color: isTodayBar ? 'var(--accent-text)' : 'var(--text-secondary)',
                          }}
                        >
                          {day.displayDate === 'Today' ? 'Today' : day.displayDate.split(' ')[0]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. DETAILED STUDY HISTORY LOG TABLE */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-black tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
                  DAILY RECORD LOG
                </h4>
                <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Showing {mergedRecords.length} recorded dates
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border shadow-2xs" style={{ borderColor: 'var(--border-color)' }}>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr
                      className="border-b font-bold tracking-wider uppercase text-[11px]"
                      style={{
                        backgroundColor: 'var(--bg-card-subtle)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Study Duration</th>
                      <th className="py-3 px-4 text-center">Goal Status</th>
                      <th className="py-3 px-4 text-center">Cycles</th>
                      <th className="py-3 px-4 text-center">Tasks Solved</th>
                      <th className="py-3 px-4 text-right">Momentum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                    {mergedRecords.map((record, idx) => {
                      const sec = record.studyDurationSeconds || 0;
                      const dayGoalPercent = Math.min(100, (sec / goalTargetSeconds) * 100);
                      const metGoal = sec >= goalTargetSeconds;
                      const isToday = record.dateKey === todayKey;

                      return (
                        <tr
                          key={record.dateKey || idx}
                          className="hover:bg-[var(--bg-card-subtle)] transition-colors"
                        >
                          {/* Date */}
                          <td className="py-3 px-4 font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <Calendar className="w-3.5 h-3.5 opacity-60 shrink-0" />
                            <span>{record.displayDate}</span>
                            {isToday && (
                              <span
                                className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase"
                                style={{
                                  backgroundColor: 'var(--accent)',
                                  color: '#ffffff',
                                }}
                              >
                                Today
                              </span>
                            )}
                          </td>

                          {/* Study Duration */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm" style={{ color: 'var(--accent-text)' }}>
                                {formatHoursMinutes(sec)}
                              </span>
                              {sec > 0 && (
                                <div
                                  className="w-12 h-1.5 rounded-full overflow-hidden border hidden sm:block shrink-0"
                                  style={{
                                    backgroundColor: 'var(--bg-card)',
                                    borderColor: 'var(--border-color)',
                                  }}
                                  title={`${dayGoalPercent.toFixed(0)}% of goal`}
                                >
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: `${dayGoalPercent}%`,
                                      background: metGoal ? '#10b981' : 'var(--accent)',
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Goal Status */}
                          <td className="py-3 px-4 text-center font-semibold text-[11px]">
                            {metGoal ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>Achieved</span>
                              </span>
                            ) : sec > 0 ? (
                              <span className="text-[11px] font-mono opacity-85" style={{ color: 'var(--text-secondary)' }}>
                                {dayGoalPercent.toFixed(0)}%
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[10px]">--</span>
                            )}
                          </td>

                          {/* Cycles */}
                          <td className="py-3 px-4 text-center font-mono font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                            {record.cyclesCompleted || 0}
                          </td>

                          {/* Tasks */}
                          <td className="py-3 px-4 text-center font-mono font-medium" style={{ color: 'var(--text-secondary)' }}>
                            {record.tasksCompleted || 0} / {record.tasksTotal || 0}
                          </td>

                          {/* Momentum */}
                          <td className="py-3 px-4 text-right font-semibold">
                            {metGoal ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">🎯 Master</span>
                            ) : (record.cyclesCompleted || 0) >= 4 || sec >= 3600 * 5 ? (
                              <span className="text-amber-500 font-bold">🔥 High Flow</span>
                            ) : sec > 0 ? (
                              <span className="text-blue-500 font-bold">⚡ Active</span>
                            ) : (
                              <span className="text-slate-400">🌱 Started</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. JSON DATA BACKUP & RESTORE TOOLBAR */}
            <div
              className="p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-3 shadow-2xs"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div>
                <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                  Data Backup & Restore
                </div>
                <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Export all your study history, daily goals, notes, tasks, and settings to a JSON backup file.
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 hover:scale-102 transition-all cursor-pointer shadow-2xs"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-secondary)',
                  }}
                  title="Import a previously saved JSON backup"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import Backup</span>
                </button>

                <button
                  type="button"
                  onClick={handleExport}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl text-white flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                  style={{ background: 'var(--accent-gradient)' }}
                  title="Download a complete JSON backup of your study data"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Backup</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
