import {
  AppearanceMode,
  DailyRecord,
  DeskWidgetId,
  GoatPreset,
  LocationSettings,
  StylePalette,
  ThemeMode,
  TimerSettings,
  TimerState,
  TodoItem,
  UserSettings,
  WidgetLayoutConfig,
} from '../types';

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  studyMinutes: 90,
  shortBreakMinutes: 20,
  longBreakMinutes: 30,
  cyclesBeforeLongBreak: 3,
  soundEnabled: true,
  notificationsEnabled: false,
};

export const DEFAULT_LOCATION: LocationSettings = {
  city: 'Dhaka',
  country: 'Bangladesh',
  timezone: 'Asia/Dhaka',
  latitude: 23.8103,
  longitude: 90.4125,
};

export const DEFAULT_DAILY_STUDY_GOAL_HOURS = 8;

export const DEFAULT_SETTINGS: UserSettings = {
  appearance: 'light',
  style: 'oblivion',
  goatPreset: 'mr-champions-league',
  theme: 'light',
  timer: DEFAULT_TIMER_SETTINGS,
  location: DEFAULT_LOCATION,
  dailyGoalHours: DEFAULT_DAILY_STUDY_GOAL_HOURS,
};

export function getDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayKey(): string {
  return getDateKey(new Date());
}

export function formatDisplayDate(dateKey: string): string {
  try {
    const [y, m, d] = dateKey.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateKey;
  }
}

// Settings
export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem('admission_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      
      // Determine appearance ('light' | 'dark')
      let appearance: AppearanceMode = 'light';
      if (parsed.appearance === 'dark' || parsed.appearance === 'light') {
        appearance = parsed.appearance;
      } else if (parsed.theme === 'dark' || parsed.theme === 'boii') {
        appearance = 'dark';
      }

      // Determine style ('oblivion' as primary default)
      let style: StylePalette = 'oblivion';
      let goatPreset: GoatPreset =
        parsed.goatPreset === 'galactico-gold' ||
        parsed.goatPreset === 'selecao-passion' ||
        parsed.goatPreset === 'red-devil' ||
        parsed.goatPreset === 'el-bicho'
          ? parsed.goatPreset
          : 'mr-champions-league';

      if (
        parsed.style === 'girly' ||
        parsed.style === 'boi' ||
        parsed.style === 'cyberdeck' ||
        parsed.style === 'cassette' ||
        parsed.style === 'jarvis' ||
        parsed.style === 'oblivion' ||
        parsed.style === 'cybergothic' ||
        parsed.style === 'matrix' ||
        parsed.style === 'watchdogs' ||
        parsed.style === 'solarpunk' ||
        parsed.style === 'aerofuturism' ||
        parsed.style === 'goat' ||
        parsed.style === 'mr-champions-league' ||
        parsed.style === 'galactico-gold' ||
        parsed.style === 'selecao-passion' ||
        parsed.style === 'red-devil' ||
        parsed.style === 'el-bicho'
      ) {
        if (parsed.style === 'aerofuturism') {
          style = 'solarpunk';
        } else if (
          parsed.style === 'mr-champions-league' ||
          parsed.style === 'galactico-gold' ||
          parsed.style === 'selecao-passion' ||
          parsed.style === 'red-devil' ||
          parsed.style === 'el-bicho'
        ) {
          style = 'goat';
          goatPreset = parsed.style as GoatPreset;
        } else {
          style = parsed.style;
        }
      } else if (parsed.theme === 'girly') {
        style = 'girly';
      } else if (parsed.theme === 'boii') {
        style = 'boi';
      } else if (parsed.theme === 'cyberdeck') {
        style = 'cyberdeck';
      } else if (parsed.theme === 'cassette') {
        style = 'cassette';
      } else if (parsed.theme === 'jarvis') {
        style = 'jarvis';
      } else if (parsed.theme === 'oblivion') {
        style = 'oblivion';
      } else if (parsed.theme === 'cybergothic') {
        style = 'cybergothic';
      } else if (parsed.theme === 'matrix') {
        style = 'matrix';
      } else if (parsed.theme === 'watchdogs') {
        style = 'watchdogs';
      } else if (parsed.theme === 'solarpunk' || parsed.theme === 'aerofuturism') {
        style = 'solarpunk';
      } else if (
        parsed.theme === 'goat' ||
        parsed.theme === 'mr-champions-league' ||
        parsed.theme === 'galactico-gold' ||
        parsed.theme === 'selecao-passion' ||
        parsed.theme === 'red-devil' ||
        parsed.theme === 'el-bicho'
      ) {
        style = 'goat';
        if (parsed.theme !== 'goat') {
          goatPreset = parsed.theme as GoatPreset;
        }
      }

      const dailyGoalHours =
        typeof parsed.dailyGoalHours === 'number' && parsed.dailyGoalHours > 0
          ? parsed.dailyGoalHours
          : DEFAULT_DAILY_STUDY_GOAL_HOURS;

      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        appearance,
        style,
        goatPreset,
        dailyGoalHours,
        timer: { ...DEFAULT_TIMER_SETTINGS, ...(parsed.timer || {}) },
        location: { ...DEFAULT_LOCATION, ...(parsed.location || {}) },
      };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem('admission_settings', JSON.stringify(settings));
    if (settings.dailyGoalHours) {
      localStorage.setItem('admission_daily_study_goal_hours', settings.dailyGoalHours.toString());
    }
  } catch (e) {
    console.warn('Failed to save settings to localStorage:', e);
  }
}

// Daily Study Goal
export function loadDailyStudyGoal(): number {
  try {
    const raw = localStorage.getItem('admission_daily_study_goal_hours');
    if (raw !== null) {
      const val = parseFloat(raw);
      if (!isNaN(val) && val > 0 && val <= 24) {
        return val;
      }
    }
    const settings = loadSettings();
    if (settings.dailyGoalHours && settings.dailyGoalHours > 0) {
      return settings.dailyGoalHours;
    }
  } catch {
    // ignore
  }
  return DEFAULT_DAILY_STUDY_GOAL_HOURS;
}

export function saveDailyStudyGoal(hours: number): void {
  try {
    const safeHours = Math.max(1, Math.min(24, Number(hours.toFixed(1))));
    localStorage.setItem('admission_daily_study_goal_hours', safeHours.toString());
    const settings = loadSettings();
    if (settings.dailyGoalHours !== safeHours) {
      saveSettings({ ...settings, dailyGoalHours: safeHours });
    }
  } catch (e) {
    console.warn('Failed to save daily study goal:', e);
  }
}

// Daily Study Duration (Actual seconds spent studying via timer)
export function loadDailyStudySeconds(dateKey: string = getTodayKey()): number {
  try {
    const raw = localStorage.getItem(`admission_study_seconds_${dateKey}`);
    if (raw !== null) {
      const val = parseInt(raw, 10);
      if (!isNaN(val) && val >= 0) {
        return val;
      }
    }
    // Fallback: check if existing history has record for this dateKey
    const history = loadHistory();
    const existing = history.find((h) => h.dateKey === dateKey);
    if (existing && existing.studyDurationSeconds !== undefined) {
      return existing.studyDurationSeconds;
    }
  } catch {
    // ignore
  }
  return 0;
}

export function saveDailyStudySeconds(seconds: number, dateKey: string = getTodayKey()): void {
  try {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    localStorage.setItem(`admission_study_seconds_${dateKey}`, safeSeconds.toString());
    syncHistoryRecord(dateKey);
  } catch (e) {
    console.warn('Failed to save study seconds:', e);
  }
}

export function addDailyStudySeconds(deltaSeconds: number, dateKey: string = getTodayKey()): number {
  try {
    if (deltaSeconds <= 0) return loadDailyStudySeconds(dateKey);
    const current = loadDailyStudySeconds(dateKey);
    const updated = current + Math.floor(deltaSeconds);
    localStorage.setItem(`admission_study_seconds_${dateKey}`, updated.toString());
    syncHistoryRecord(dateKey);
    return updated;
  } catch (e) {
    console.warn('Failed to add study seconds:', e);
    return loadDailyStudySeconds(dateKey);
  }
}

/**
 * Record a continuous study duration between two epoch timestamps,
 * automatically splitting between dates if the session crossed midnight!
 */
export function recordStudyTimeSession(
  seconds: number,
  fromTimestamp: number = Date.now() - seconds * 1000,
  toTimestamp: number = Date.now()
): void {
  if (seconds <= 0) return;

  const fromDateKey = getDateKey(new Date(fromTimestamp));
  const toDateKey = getDateKey(new Date(toTimestamp));

  if (fromDateKey === toDateKey) {
    addDailyStudySeconds(seconds, toDateKey);
  } else {
    // Session crossed midnight boundary! Split accurately between the two calendar dates
    const fromDate = new Date(fromTimestamp);
    const nextDayMidnight = new Date(
      fromDate.getFullYear(),
      fromDate.getMonth(),
      fromDate.getDate() + 1,
      0,
      0,
      0,
      0
    ).getTime();

    const msBeforeMidnight = Math.max(0, nextDayMidnight - fromTimestamp);
    const secondsBeforeMidnight = Math.max(
      0,
      Math.min(seconds, Math.floor(msBeforeMidnight / 1000))
    );
    const secondsAfterMidnight = Math.max(0, seconds - secondsBeforeMidnight);

    if (secondsBeforeMidnight > 0) {
      addDailyStudySeconds(secondsBeforeMidnight, fromDateKey);
    }
    if (secondsAfterMidnight > 0) {
      addDailyStudySeconds(secondsAfterMidnight, toDateKey);
    }
  }
}

// Timer State
export function loadTimerState(defaultStudyMinutes: number): TimerState {
  const defaultRemaining = defaultStudyMinutes * 60 * 1000;
  try {
    const raw = localStorage.getItem('admission_timer_state');
    if (raw) {
      const state: TimerState = JSON.parse(raw);
      // If it was running, recalculate remainingMs using targetEndTime
      if (state.isRunning && state.targetEndTime) {
        const now = Date.now();
        const diff = state.targetEndTime - now;

        // If it was running in STUDY phase, accurately credit any elapsed study time since last tick
        if (state.phase === 'study' && state.lastStudyTick) {
          const studySessionEnd = Math.min(now, state.targetEndTime);
          const elapsedMs = Math.max(0, studySessionEnd - state.lastStudyTick);
          const elapsedSec = Math.floor(elapsedMs / 1000);
          if (elapsedSec > 0) {
            recordStudyTimeSession(
              elapsedSec,
              state.lastStudyTick,
              state.lastStudyTick + elapsedSec * 1000
            );
          }
        }

        if (diff > 0) {
          state.remainingMs = diff;
          if (state.phase === 'study') {
            state.lastStudyTick = now;
          }
        } else {
          // Timer expired while page was away
          state.remainingMs = 0;
          state.isRunning = false;
          state.lastStudyTick = null;
        }
      }
      return state;
    }
  } catch {
    // fallback
  }

  return {
    phase: 'study',
    isRunning: false,
    targetEndTime: null,
    remainingMs: defaultRemaining,
    cycleIndex: 1,
    lastUpdated: Date.now(),
    lastStudyTick: null,
  };
}

export function saveTimerState(state: TimerState): void {
  try {
    localStorage.setItem('admission_timer_state', JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save timer state:', e);
  }
}

// Cycles for a specific date
export function loadDailyCycles(dateKey: string = getTodayKey()): number {
  try {
    const raw = localStorage.getItem(`admission_cycles_${dateKey}`);
    if (raw !== null) {
      const val = parseInt(raw, 10);
      return isNaN(val) ? 0 : val;
    }
  } catch {
    // ignore
  }
  return 0;
}

export function saveDailyCycles(cycles: number, dateKey: string = getTodayKey()): void {
  try {
    localStorage.setItem(`admission_cycles_${dateKey}`, cycles.toString());
    syncHistoryRecord(dateKey);
  } catch (e) {
    console.warn('Failed to save cycles:', e);
  }
}

// Todos
export function loadTodos(dateKey: string = getTodayKey()): TodoItem[] {
  try {
    const raw = localStorage.getItem(`admission_todos_${dateKey}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }

  // Provide initial high-yield admission tasks if starting today fresh
  const initialTodos: TodoItem[] = [
    {
      id: 't-1',
      text: 'Physics — Mechanics & Vector Revision',
      completed: false,
      createdAt: Date.now() - 3600000,
      dateKey,
    },
    {
      id: 't-2',
      text: 'Chemistry — Organic Reaction Mechanisms',
      completed: false,
      createdAt: Date.now() - 2400000,
      dateKey,
    },
    {
      id: 't-3',
      text: 'Mathematics — Calculus 50 Question Bank',
      completed: true,
      createdAt: Date.now() - 1200000,
      dateKey,
    },
    {
      id: 't-4',
      text: 'English / GK — Past 5 Years Question Analysis',
      completed: false,
      createdAt: Date.now() - 600000,
      dateKey,
    },
  ];

  try {
    localStorage.setItem(`admission_todos_${dateKey}`, JSON.stringify(initialTodos));
  } catch {
    // ignore
  }
  return initialTodos;
}

export function saveTodos(todos: TodoItem[], dateKey: string = getTodayKey()): void {
  try {
    localStorage.setItem(`admission_todos_${dateKey}`, JSON.stringify(todos));
    syncHistoryRecord(dateKey);
  } catch (e) {
    console.warn('Failed to save todos:', e);
  }
}

// Study History
export function loadHistory(): DailyRecord[] {
  try {
    const raw = localStorage.getItem('admission_history');
    if (raw) {
      const parsed: DailyRecord[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => {
          if (item.studyDurationSeconds === undefined) {
            const rawSec = localStorage.getItem(`admission_study_seconds_${item.dateKey}`);
            if (rawSec !== null) {
              const parsedSec = parseInt(rawSec, 10);
              return { ...item, studyDurationSeconds: isNaN(parsedSec) ? 0 : parsedSec };
            }
          }
          return item;
        });
      }
    }
  } catch {
    // ignore
  }

  // Seed with realistic previous 2 days for initial presentation if empty
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = getDateKey(yesterday);

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const tKey = getDateKey(twoDaysAgo);

  const seed: DailyRecord[] = [
    {
      dateKey: yKey,
      displayDate: formatDisplayDate(yKey),
      cyclesCompleted: 5,
      tasksCompleted: 8,
      tasksTotal: 10,
      studyDurationSeconds: 5 * 90 * 60, // 7.5 hours
    },
    {
      dateKey: tKey,
      displayDate: formatDisplayDate(tKey),
      cyclesCompleted: 4,
      tasksCompleted: 6,
      tasksTotal: 8,
      studyDurationSeconds: 4 * 90 * 60, // 6.0 hours
    },
  ];

  try {
    localStorage.setItem('admission_history', JSON.stringify(seed));
    localStorage.setItem(`admission_study_seconds_${yKey}`, (5 * 90 * 60).toString());
    localStorage.setItem(`admission_study_seconds_${tKey}`, (4 * 90 * 60).toString());
  } catch {
    // ignore
  }
  return seed;
}

export function syncHistoryRecord(dateKey: string = getTodayKey()): void {
  try {
    const cycles = loadDailyCycles(dateKey);
    const todos = loadTodos(dateKey);
    const tasksCompleted = todos.filter((t) => t.completed).length;
    const tasksTotal = todos.length;
    const studyDurationSeconds = loadDailyStudySeconds(dateKey);

    const history = loadHistory();
    const existingIndex = history.findIndex((h) => h.dateKey === dateKey);

    const record: DailyRecord = {
      dateKey,
      displayDate: formatDisplayDate(dateKey),
      cyclesCompleted: cycles,
      tasksCompleted,
      tasksTotal,
      studyDurationSeconds,
    };

    if (existingIndex >= 0) {
      history[existingIndex] = record;
    } else {
      history.unshift(record);
    }

    // Keep top 60 days
    const trimmed = history.slice(0, 60);
    localStorage.setItem('admission_history', JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

export const DEFAULT_DESK_LAYOUT: WidgetLayoutConfig[] = [
  {
    id: 'time',
    order: 0,
    colSpan: 7,
    x: 20,
    y: 20,
    width: 680,
    height: 260,
    minWidth: 320,
    minHeight: 180,
    preset: 'expanded',
    zIndex: 1,
    hidden: false,
  },
  {
    id: 'prayer',
    order: 1,
    colSpan: 5,
    x: 720,
    y: 20,
    width: 460,
    height: 260,
    minWidth: 280,
    minHeight: 180,
    preset: 'compact',
    zIndex: 1,
    hidden: false,
  },
  {
    id: 'pomodoro',
    order: 2,
    colSpan: 7,
    x: 20,
    y: 300,
    width: 680,
    height: 480,
    minWidth: 320,
    minHeight: 320,
    preset: 'expanded',
    zIndex: 2,
    hidden: false,
  },
  {
    id: 'music',
    order: 3,
    colSpan: 5,
    x: 720,
    y: 300,
    width: 460,
    height: 480,
    minWidth: 300,
    minHeight: 260,
    preset: 'medium',
    zIndex: 2,
    hidden: false,
  },
  {
    id: 'todolist',
    order: 4,
    colSpan: 7,
    x: 20,
    y: 800,
    width: 680,
    height: 460,
    minWidth: 300,
    minHeight: 300,
    preset: 'medium',
    zIndex: 3,
    hidden: false,
  },
  {
    id: 'calendar',
    order: 5,
    colSpan: 5,
    x: 720,
    y: 800,
    width: 460,
    height: 460,
    minWidth: 300,
    minHeight: 260,
    preset: 'medium',
    zIndex: 3,
    hidden: false,
  },
  {
    id: 'trello',
    order: 6,
    colSpan: 7,
    x: 20,
    y: 1280,
    width: 680,
    height: 400,
    minWidth: 320,
    minHeight: 260,
    preset: 'medium',
    zIndex: 3,
    hidden: true,
  },
  {
    id: 'notes',
    order: 7,
    colSpan: 5,
    x: 720,
    y: 1280,
    width: 460,
    height: 400,
    minWidth: 300,
    minHeight: 260,
    preset: 'medium',
    zIndex: 3,
    hidden: true,
  },
  {
    id: 'cycles',
    order: 8,
    colSpan: 6,
    x: 20,
    y: 1700,
    width: 680,
    height: 320,
    minWidth: 280,
    minHeight: 200,
    preset: 'medium',
    zIndex: 3,
    hidden: true,
  },
  {
    id: 'prayer_full',
    order: 9,
    colSpan: 6,
    x: 720,
    y: 1700,
    width: 460,
    height: 380,
    minWidth: 300,
    minHeight: 260,
    preset: 'expanded',
    zIndex: 3,
    hidden: true,
  },
  {
    id: 'duas',
    order: 10,
    colSpan: 6,
    x: 20,
    y: 2100,
    width: 680,
    height: 360,
    minWidth: 300,
    minHeight: 240,
    preset: 'medium',
    zIndex: 3,
    hidden: true,
  },
  {
    id: 'stats',
    order: 11,
    colSpan: 12,
    x: 20,
    y: 2480,
    width: 1160,
    height: 420,
    minWidth: 320,
    minHeight: 280,
    preset: 'expanded',
    zIndex: 3,
    hidden: true,
  },
];

export function loadDeskLayout(): WidgetLayoutConfig[] {
  try {
    const raw = localStorage.getItem('admission_desk_layout_free_v3');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 4) {
        // Merge any new default widgets that might not be in the user's saved array yet
        const existingMap = new Map<string, WidgetLayoutConfig>();
        parsed.forEach((w: WidgetLayoutConfig) => existingMap.set(w.id, w));

        const merged: WidgetLayoutConfig[] = [...parsed];
        for (const def of DEFAULT_DESK_LAYOUT) {
          if (!existingMap.has(def.id)) {
            merged.push({ ...def });
          }
        }
        return merged;
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_DESK_LAYOUT;
}

export function saveDeskLayout(layout: WidgetLayoutConfig[]): void {
  try {
    localStorage.setItem('admission_desk_layout_free_v3', JSON.stringify(layout));
  } catch {
    // ignore
  }
}

// Full Application JSON Backup & Restore
export interface AdmissionBackupData {
  version: string;
  exportedAt: string;
  settings: UserSettings;
  dailyGoalHours: number;
  history: DailyRecord[];
  dailyCycles?: Record<string, number>;
  dailyStudySeconds?: Record<string, number>;
  todos?: Record<string, TodoItem[]>;
  notes?: string;
  trello?: unknown;
  deskLayout?: WidgetLayoutConfig[];
}

export function exportBackupData(): string {
  const settings = loadSettings();
  const dailyGoalHours = loadDailyStudyGoal();
  const history = loadHistory();
  const deskLayout = loadDeskLayout();

  const dailyCycles: Record<string, number> = {};
  const dailyStudySeconds: Record<string, number> = {};
  const todos: Record<string, TodoItem[]> = {};

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (key.startsWith('admission_cycles_')) {
        const date = key.replace('admission_cycles_', '');
        dailyCycles[date] = loadDailyCycles(date);
      } else if (key.startsWith('admission_study_seconds_')) {
        const date = key.replace('admission_study_seconds_', '');
        dailyStudySeconds[date] = loadDailyStudySeconds(date);
      } else if (key.startsWith('admission_todos_')) {
        const date = key.replace('admission_todos_', '');
        todos[date] = loadTodos(date);
      }
    }
  } catch {
    // ignore
  }

  let notes: string | undefined;
  let trello: unknown = undefined;
  try {
    const rawNotes = localStorage.getItem('admission_notes');
    if (rawNotes) notes = rawNotes;
    const rawTrello = localStorage.getItem('admission_trello_board');
    if (rawTrello) trello = JSON.parse(rawTrello);
  } catch {
    // ignore
  }

  const backup: AdmissionBackupData = {
    version: '2026.1',
    exportedAt: new Date().toISOString(),
    settings,
    dailyGoalHours,
    history,
    dailyCycles,
    dailyStudySeconds,
    todos,
    notes,
    trello,
    deskLayout,
  };

  return JSON.stringify(backup, null, 2);
}

export function importBackupData(jsonStr: string): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'Invalid backup JSON file' };
    }

    if (parsed.settings) {
      saveSettings(parsed.settings);
    }
    if (typeof parsed.dailyGoalHours === 'number' && parsed.dailyGoalHours > 0) {
      saveDailyStudyGoal(parsed.dailyGoalHours);
    }
    if (Array.isArray(parsed.history)) {
      localStorage.setItem('admission_history', JSON.stringify(parsed.history));
    }
    if (parsed.dailyCycles && typeof parsed.dailyCycles === 'object') {
      Object.entries(parsed.dailyCycles).forEach(([d, val]) => {
        if (typeof val === 'number') {
          localStorage.setItem(`admission_cycles_${d}`, val.toString());
        }
      });
    }
    if (parsed.dailyStudySeconds && typeof parsed.dailyStudySeconds === 'object') {
      Object.entries(parsed.dailyStudySeconds).forEach(([d, val]) => {
        if (typeof val === 'number') {
          localStorage.setItem(`admission_study_seconds_${d}`, val.toString());
        }
      });
    }
    if (parsed.todos && typeof parsed.todos === 'object') {
      Object.entries(parsed.todos).forEach(([d, list]) => {
        if (Array.isArray(list)) {
          localStorage.setItem(`admission_todos_${d}`, JSON.stringify(list));
        }
      });
    }
    if (parsed.notes && typeof parsed.notes === 'string') {
      localStorage.setItem('admission_notes', parsed.notes);
    }
    if (parsed.trello) {
      localStorage.setItem('admission_trello_board', JSON.stringify(parsed.trello));
    }
    if (Array.isArray(parsed.deskLayout)) {
      saveDeskLayout(parsed.deskLayout);
    }

    return { success: true, message: 'Data restored successfully!' };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : 'Failed to import backup' };
  }
}

