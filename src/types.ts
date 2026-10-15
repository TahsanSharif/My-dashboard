export type AppearanceMode = 'light' | 'dark';
export type GoatPreset =
  | 'mr-champions-league'
  | 'galactico-gold'
  | 'selecao-passion'
  | 'red-devil'
  | 'el-bicho';

export type StylePalette =
  | 'girly'
  | 'boi'
  | 'cyberdeck'
  | 'cassette'
  | 'jarvis'
  | 'oblivion'
  | 'cybergothic'
  | 'matrix'
  | 'watchdogs'
  | 'solarpunk'
  | 'aerofuturism'
  | 'goat'
  | 'mr-champions-league'
  | 'galactico-gold'
  | 'selecao-passion'
  | 'red-devil'
  | 'el-bicho';

export type ThemeMode =
  | 'light'
  | 'dark'
  | 'girly'
  | 'boii'
  | 'boi'
  | 'cyberdeck'
  | 'cassette'
  | 'jarvis'
  | 'oblivion'
  | 'cybergothic'
  | 'matrix'
  | 'watchdogs'
  | 'solarpunk'
  | 'aerofuturism'
  | 'goat'
  | 'mr-champions-league'
  | 'galactico-gold'
  | 'selecao-passion'
  | 'red-devil'
  | 'el-bicho';

export type TimerPhase = 'study' | 'shortBreak' | 'longBreak';

export interface TimerSettings {
  studyMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  cyclesBeforeLongBreak: number;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface LocationSettings {
  city: string;
  country: string;
  timezone: string;
  latitude: number;
  longitude: number;
}

export interface UserSettings {
  appearance: AppearanceMode;
  style: StylePalette;
  goatPreset?: GoatPreset;
  theme?: ThemeMode; // Legacy backward-compatibility
  timer: TimerSettings;
  location: LocationSettings;
  dailyGoalHours?: number; // Target daily study hours (default 8)
}

export interface TimerState {
  phase: TimerPhase;
  isRunning: boolean;
  targetEndTime: number | null; // epoch timestamp ms
  remainingMs: number;
  cycleIndex: number; // 1-based, up to cyclesBeforeLongBreak
  lastUpdated: number;
  lastStudyTick?: number | null; // epoch ms of last recorded study heartbeat
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  dateKey: string; // YYYY-MM-DD
}

export interface DailyRecord {
  dateKey: string; // YYYY-MM-DD
  displayDate: string; // e.g. "Sep 15"
  cyclesCompleted: number;
  tasksCompleted: number;
  tasksTotal: number;
  studyDurationSeconds?: number; // Total actual study time in seconds for this date
}

export interface PrayerTime {
  name: 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
  arabicName: string;
  time: string; // HH:MM (24h or 12h)
  timestamp: number; // today's epoch ms for that prayer
}

export interface NextPrayerInfo {
  name: string;
  arabicName: string;
  remainingSeconds: number;
  targetTimeFormatted: string;
}

export interface DuaItem {
  id: number;
  title: string;
  subtitle: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  reference?: string;
  note?: string;
}

export type DeskWidgetId =
  | 'time'
  | 'clock'
  | 'prayer'
  | 'pomodoro'
  | 'todolist'
  | 'calendar'
  | 'trello'
  | 'cycles'
  | 'music'
  | 'notes'
  | 'prayer_full'
  | 'duas'
  | 'stats';

export interface WidgetLayoutConfig {
  id: DeskWidgetId;
  order: number;
  colSpan?: number; // fallback for grid mode
  // Free desktop positioning (pixels relative to canvas or percentage)
  x?: number;
  y?: number;
  width?: number; // width in pixels
  height?: number; // height in pixels
  customWidthPx?: number;
  customHeightPx?: number;
  minWidth?: number;
  minHeight?: number;
  zIndex?: number;
  preset?: 'compact' | 'medium' | 'expanded' | 'full';
  hidden?: boolean; // When true, widget is hidden from visible dashboard
}
