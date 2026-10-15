import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  AppearanceMode,
  DailyRecord,
  DeskWidgetId,
  LocationSettings,
  StylePalette,
  ThemeMode,
  TodoItem,
  UserSettings,
  WidgetLayoutConfig,
  GoatPreset,
} from './types';
import {
  DEFAULT_DESK_LAYOUT,
  getTodayKey,
  loadDailyCycles,
  loadDeskLayout,
  loadHistory,
  loadSettings,
  loadTodos,
  loadDailyStudySeconds,
  loadDailyStudyGoal,
  saveDailyStudyGoal,
  saveDailyCycles,
  saveDeskLayout,
  saveSettings,
  saveTodos,
  syncHistoryRecord,
} from './utils/storage';
import { calculateTidyFreeformLayout, isFreeformLayoutTidy } from './utils/freeformLayout';
import { Header } from './components/Header';
import { Clock } from './components/Clock';
import { MiniPrayerTimer } from './components/MiniPrayerTimer';
import { StudyTimer } from './components/StudyTimer';
import { CycleCounter } from './components/CycleCounter';
import { PrayerWidget } from './components/PrayerWidget';
import { TodoList } from './components/TodoList';
import { DuaCards } from './components/DuaCards';
import { StudyHistory } from './components/StudyHistory';
import { SettingsModal } from './components/SettingsModal';
import { MovableResizableWidget } from './components/MovableResizableWidget';
import { CalendarWidget } from './components/CalendarWidget';
import { TrelloWidget } from './components/TrelloWidget';
import { MusicWidget } from './components/MusicWidget';
import { NotesWidget } from './components/NotesWidget';
import { WidgetManagerModal, ALL_WIDGETS_METADATA } from './components/WidgetManagerModal';
import { StartupIntro } from './components/StartupIntro';
import { TabPinningWarningModal } from './components/TabPinningWarningModal';
import { MatrixDigitalRain } from './components/MatrixDigitalRain';
import { WatchDogsBackground } from './components/WatchDogsBackground';
import { SolarpunkBackground } from './components/SolarpunkBackground';
import { GoatStadiumBackground } from './components/GoatStadiumBackground';
import { GoatStarParticles } from './components/GoatStarParticles';
import { Preset1FloodlightOverlay } from './components/Preset1FloodlightOverlay';
import { JerseyCabinet } from './components/JerseyCabinet';
import { SiuuuCelebrationModal } from './components/SiuuuCelebrationModal';
import { playUclAnthem, stopUclAnthem } from './utils/uclAnthem';
import {
  LayoutGrid,
  RotateCcw,
  Clock as ClockIcon,
  Compass,
  BookOpen,
  ListTodo,
  Sparkles,
  Calendar as CalendarIcon,
  Kanban,
  Target,
  Maximize2,
  Plus,
  Pin,
  Music,
  FileText,
  SlidersHorizontal,
  Instagram,
  Youtube,
  ScrollText,
  BarChart3,
  Move,
  Columns,
} from 'lucide-react';

export default function App() {
  const [currentDateKey, setCurrentDateKey] = useState<string>(getTodayKey);
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [cycles, setCycles] = useState<number>(() => loadDailyCycles(getTodayKey()));
  const [todos, setTodos] = useState<TodoItem[]>(() => loadTodos(getTodayKey()));
  const [history, setHistory] = useState<DailyRecord[]>(loadHistory);
  const [todayStudySeconds, setTodayStudySeconds] = useState<number>(() => loadDailyStudySeconds(getTodayKey()));
  const [dailyGoalHours, setDailyGoalHours] = useState<number>(loadDailyStudyGoal);
  const [deskLayout, setDeskLayout] = useState<WidgetLayoutConfig[]>(loadDeskLayout);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isWidgetManagerOpen, setIsWidgetManagerOpen] = useState<boolean>(false);
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [isSiuuuModalOpen, setIsSiuuuModalOpen] = useState<boolean>(false);
  const [siuuuReason, setSiuuuReason] = useState<string>('Goal Scored! Mission #7 Completed!');

  // Responsive desk container measurement & layout mode
  const deskContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1200);
  const [layoutMode, setLayoutMode] = useState<'adaptive' | 'freeform'>(() => {
    try {
      const saved = localStorage.getItem('admission_desk_layout_mode');
      if (saved === 'adaptive' || saved === 'freeform') return saved;
    } catch {}
    return 'adaptive';
  });

  // Track desk canvas container width in real-time
  useEffect(() => {
    if (!deskContainerRef.current) return;
    const el = deskContainerRef.current;

    setContainerWidth(el.clientWidth || 1200);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setContainerWidth(Math.round(entry.contentRect.width));
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSetLayoutMode = (mode: 'adaptive' | 'freeform') => {
    setLayoutMode(mode);
    try {
      localStorage.setItem('admission_desk_layout_mode', mode);
    } catch {}
    if (mode === 'freeform' && !isFreeformLayoutTidy(deskLayout, containerWidth)) {
      const tidy = calculateTidyFreeformLayout(deskLayout, containerWidth);
      setDeskLayout(tidy);
      saveDeskLayout(tidy);
    }
  };

  // If container width is narrow (< 960px), freeform absolute multi-card placement
  // would cause clipping / offscreen widgets, so enforce adaptive flow automatically
  const isNarrowScreen = containerWidth < 960;
  const effectiveLayoutMode = isNarrowScreen ? 'adaptive' : layoutMode;

  // Auto-align freeform layout if coordinates are untidy, overlapping or missing
  useEffect(() => {
    if (layoutMode === 'freeform' && !isNarrowScreen && containerWidth > 0) {
      if (!isFreeformLayoutTidy(deskLayout, containerWidth)) {
        const tidy = calculateTidyFreeformLayout(deskLayout, containerWidth);
        setDeskLayout(tidy);
        saveDeskLayout(tidy);
      }
    }
  }, [layoutMode, isNarrowScreen, containerWidth]);

  // Apply two independent theme layers to document element (enforcing dark mode for JARVIS & GOAT)
  useEffect(() => {
    const effectiveAppearance =
      settings.style === 'jarvis' || (settings.style === 'goat' && settings.goatPreset !== 'galactico-gold')
        ? 'dark'
        : settings.style === 'goat' && settings.goatPreset === 'galactico-gold'
        ? 'light'
        : settings.appearance;
    document.documentElement.setAttribute('data-appearance', effectiveAppearance);
    document.documentElement.setAttribute('data-style', settings.style);

    if (settings.style === 'goat') {
      const preset = settings.goatPreset || 'mr-champions-league';
      document.documentElement.setAttribute('data-goat-preset', preset);
      // Support both red-devil and the-red-devil
      if (preset === 'red-devil' || preset === 'the-red-devil') {
        document.documentElement.setAttribute('data-goat-preset', 'the-red-devil');
      }
    } else {
      document.documentElement.removeAttribute('data-goat-preset');
    }

    // Legacy fallback for any styles relying on data-theme
    document.documentElement.setAttribute(
      'data-theme',
      settings.style === 'goat'
        ? (settings.goatPreset === 'red-devil' || settings.goatPreset === 'the-red-devil' ? 'the-red-devil' : (settings.goatPreset || 'mr-champions-league'))
        : settings.style === 'cyberdeck'
        ? 'cyberdeck'
        : settings.style === 'cassette'
        ? 'cassette'
        : settings.style === 'jarvis'
        ? 'jarvis'
        : settings.style === 'oblivion'
        ? 'oblivion'
        : settings.style === 'cybergothic'
        ? 'cybergothic'
        : settings.style === 'matrix'
        ? 'matrix'
        : settings.style === 'watchdogs'
        ? 'watchdogs'
        : settings.style === 'solarpunk' || settings.style === 'aerofuturism'
        ? 'solarpunk'
        : effectiveAppearance === 'dark'
        ? 'dark'
        : settings.style
    );
  }, [settings.appearance, settings.style, settings.goatPreset]);

  // Trigger the UEFA Champions League Anthem audio playback whenever the user enters or activates
  // the "European Nights" theme (including on initial page load if "European Nights" is the active saved theme).
  useEffect(() => {
    const isEuropeanNights =
      settings.style === 'goat' &&
      (!settings.goatPreset ||
        settings.goatPreset === 'mr-champions-league' ||
        (settings.goatPreset as string) === 'the-european-nights' ||
        (settings.goatPreset as string) === 'european-nights');

    if (isEuropeanNights) {
      playUclAnthem();
    } else {
      stopUclAnthem();
    }
  }, [settings.style, settings.goatPreset]);

  // Check for day rollover every minute
  useEffect(() => {
    const checkDateInterval = setInterval(() => {
      const todayKey = getTodayKey();
      if (todayKey !== currentDateKey) {
        // Date has rolled over!
        // Sync previous day to history first
        syncHistoryRecord(currentDateKey);

        // Update active date key
        setCurrentDateKey(todayKey);

        // Load new day cycles and todos and study seconds
        const newDayCycles = loadDailyCycles(todayKey);
        const newDayTodos = loadTodos(todayKey);
        setCycles(newDayCycles);
        setTodos(newDayTodos);
        setTodayStudySeconds(loadDailyStudySeconds(todayKey));
        setHistory(loadHistory());
      }
    }, 30000);

    return () => clearInterval(checkDateInterval);
  }, [currentDateKey]);

  // Handle live study time updates from timer heartbeat
  const handleStudyTimeTick = useCallback(() => {
    setTodayStudySeconds(loadDailyStudySeconds(currentDateKey));
    setHistory(loadHistory());
  }, [currentDateKey]);

  // Handle daily study goal update
  const handleUpdateDailyGoal = useCallback((hours: number) => {
    saveDailyStudyGoal(hours);
    setDailyGoalHours(hours);
    setSettings((prev) => ({
      ...prev,
      dailyGoalHours: hours,
    }));
  }, []);

  // Handle study cycle completed
  const handleStudyCycleCompleted = useCallback(() => {
    if (settings.style === 'goat') {
      setSiuuuReason('Training Session Concluded! +70 XP Earned!');
      setIsSiuuuModalOpen(true);
    }
    setCycles((prev) => {
      const updated = prev + 1;
      saveDailyCycles(updated, currentDateKey);
      setHistory(loadHistory());
      return updated;
    });
  }, [currentDateKey, settings.style]);

  // Manual cycle adjustment (does NOT invent study hours, preserving actual timer records)
  const handleUpdateCycles = (newCount: number) => {
    setCycles(newCount);
    saveDailyCycles(newCount, currentDateKey);
    setHistory(loadHistory());
  };

  // Theme controls: 1. Appearance (Light ↔ Dark) & 2. Style
  const handleAppearanceChange = (newAppearance: AppearanceMode) => {
    // If in JARVIS or GOAT and user toggles Light, switch style to 'boi' (default palette that supports light mode)
    const newStyle =
      newAppearance === 'light' && (settings.style === 'jarvis' || settings.style === 'goat')
        ? 'boi'
        : settings.style;
    const updated: UserSettings = {
      ...settings,
      appearance: newAppearance,
      theme: newAppearance,
      style: newStyle,
    };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleStyleChange = (newStyle: StylePalette) => {
    let actualStyle = newStyle;
    let actualGoatPreset = settings.goatPreset || 'mr-champions-league';

    if (
      newStyle === 'mr-champions-league' ||
      newStyle === 'galactico-gold' ||
      newStyle === 'selecao-passion' ||
      newStyle === 'red-devil' ||
      newStyle === 'the-red-devil' ||
      newStyle === 'el-bicho'
    ) {
      actualStyle = 'goat';
      actualGoatPreset = newStyle === 'the-red-devil' ? 'red-devil' : (newStyle as GoatPreset);
    }

    // When switching to JARVIS, Matrix, Watch Dogs, or GOAT, automatically enforce dark appearance for optimal experience
    const newAppearance =
      actualStyle === 'jarvis' || actualStyle === 'matrix' || actualStyle === 'watchdogs' || actualStyle === 'goat'
        ? 'dark'
        : settings.appearance;

    const updated: UserSettings = {
      ...settings,
      style: actualStyle,
      goatPreset: actualGoatPreset,
      appearance: newAppearance,
      theme: newAppearance,
    };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleGoatPresetChange = (preset: GoatPreset) => {
    const updated: UserSettings = {
      ...settings,
      style: 'goat',
      goatPreset: preset,
      appearance: 'dark',
      theme: 'dark',
    };
    setSettings(updated);
    saveSettings(updated);
  };

  // Quick sound toggle
  const handleToggleSound = () => {
    const updated: UserSettings = {
      ...settings,
      timer: {
        ...settings.timer,
        soundEnabled: !settings.timer.soundEnabled,
      },
    };
    setSettings(updated);
    saveSettings(updated);
  };

  // Save settings from modal
  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Location update from geolocation indicator
  const handleLocationUpdate = useCallback((newLoc: Partial<LocationSettings>) => {
    setSettings((prev) => {
      const updated: UserSettings = {
        ...prev,
        location: {
          ...prev.location,
          ...newLoc,
        },
      };
      saveSettings(updated);
      return updated;
    });
  }, []);

  // Step 2 & 3: Intro completes -> Reveal Dashboard -> Show Glassmorphic Warning after 300-500ms
  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    const isDismissed = localStorage.getItem('admission_pin_warning_dismissed');
    if (!isDismissed) {
      setTimeout(() => {
        setShowWarning(true);
      }, 400); // Wait 400ms after dashboard becomes visible
    }
  }, []);

  const handleCloseWarning = useCallback(() => {
    setShowWarning(false);
    localStorage.setItem('admission_pin_warning_dismissed', 'true');
  }, []);

  const handleReplayIntro = useCallback(() => {
    localStorage.removeItem('admission_pin_warning_dismissed');
    setShowIntro(true);
  }, []);

  const handleResetOnboarding = useCallback(() => {
    sessionStorage.removeItem('admission_intro_viewed_v1');
    localStorage.removeItem('admission_pin_warning_dismissed');
    setShowIntro(true);
  }, []);

  // Todo operations
  const handleAddTodo = (text: string) => {
    const newTodo: TodoItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      text,
      completed: false,
      createdAt: Date.now(),
      dateKey: currentDateKey,
    };
    const updated = [newTodo, ...todos];
    setTodos(updated);
    saveTodos(updated, currentDateKey);
    setHistory(loadHistory());
  };

  const handleToggleTodo = (id: string) => {
    const target = todos.find((t) => t.id === id);
    if (target && !target.completed) {
      // Trigger gold #D4AF37 star-shaped particles to celebrate the #7 legacy
      window.dispatchEvent(
        new CustomEvent('goat-mission-completed', {
          detail: { id, text: target.text },
        })
      );
    }
    const updated = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    setTodos(updated);
    saveTodos(updated, currentDateKey);
    setHistory(loadHistory());
  };

  const handleEditTodo = (id: string, newText: string) => {
    const updated = todos.map((t) => (t.id === id ? { ...t, text: newText } : t));
    setTodos(updated);
    saveTodos(updated, currentDateKey);
    setHistory(loadHistory());
  };

  const handleDeleteTodo = (id: string) => {
    const updated = todos.filter((t) => t.id !== id);
    setTodos(updated);
    saveTodos(updated, currentDateKey);
    setHistory(loadHistory());
  };

  const handleClearCompleted = () => {
    const updated = todos.filter((t) => !t.completed);
    setTodos(updated);
    saveTodos(updated, currentDateKey);
    setHistory(loadHistory());
  };

  // Layout state handlers for free movement & resizing
  const handleUpdateWidgetPositionAndSize = useCallback(
    (
      id: DeskWidgetId,
      changes: { x?: number; y?: number; width?: number; height?: number; zIndex?: number }
    ) => {
      setDeskLayout((prev) => {
        const next = prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              x: changes.x !== undefined ? changes.x : item.x,
              y: changes.y !== undefined ? changes.y : item.y,
              width: changes.width !== undefined ? changes.width : item.width,
              height: changes.height !== undefined ? changes.height : item.height,
              zIndex: changes.zIndex !== undefined ? changes.zIndex : item.zIndex,
            };
          }
          return item;
        });
        saveDeskLayout(next);
        return next;
      });
    },
    []
  );

  const handleBringToFront = useCallback((id: DeskWidgetId) => {
    setDeskLayout((prev) => {
      const highestZ = Math.max(...prev.map((w) => w.zIndex || 10), 10);
      const next = prev.map((item) => {
        if (item.id === id) {
          return { ...item, zIndex: highestZ + 1 };
        }
        return item;
      });
      saveDeskLayout(next);
      return next;
    });
  }, []);

  const handleResetDeskLayout = useCallback(() => {
    const tidy = calculateTidyFreeformLayout(DEFAULT_DESK_LAYOUT, containerWidth);
    setDeskLayout(tidy);
    saveDeskLayout(tidy);
  }, [containerWidth]);

  const handleAutoAlignDeskLayout = useCallback(() => {
    const tidy = calculateTidyFreeformLayout(deskLayout, containerWidth);
    setDeskLayout(tidy);
    saveDeskLayout(tidy);
  }, [deskLayout, containerWidth]);

  const handleToggleWidget = useCallback((id: DeskWidgetId, visible: boolean) => {
    setDeskLayout((prev) => {
      const next = prev.map((item) => {
        if (item.id === id) {
          return { ...item, hidden: !visible };
        }
        return item;
      });
      saveDeskLayout(next);
      return next;
    });
  }, []);

  const handleShowAllWidgets = useCallback(() => {
    setDeskLayout((prev) => {
      const next = prev.map((item) => ({ ...item, hidden: false }));
      saveDeskLayout(next);
      return next;
    });
  }, []);

  const handleHideAllWidgets = useCallback(() => {
    setDeskLayout((prev) => {
      const next = prev.map((item) => ({ ...item, hidden: true }));
      saveDeskLayout(next);
      return next;
    });
  }, []);

  // Touch-friendly widget reordering for responsive/mobile layouts
  const handleMoveWidgetUp = useCallback((id: DeskWidgetId) => {
    setDeskLayout((prev) => {
      const visible = prev
        .filter((w) => !w.hidden)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      const currentIndex = visible.findIndex((w) => w.id === id);
      if (currentIndex <= 0) return prev;

      const prevWidget = visible[currentIndex - 1];
      const currentWidget = visible[currentIndex];

      const newOrderCurrent = prevWidget.order ?? 0;
      const newOrderPrev = currentWidget.order ?? 0;

      const next = prev.map((w) => {
        if (w.id === currentWidget.id) return { ...w, order: newOrderCurrent };
        if (w.id === prevWidget.id) return { ...w, order: newOrderPrev };
        return w;
      });

      saveDeskLayout(next);
      return next;
    });
  }, []);

  const handleMoveWidgetDown = useCallback((id: DeskWidgetId) => {
    setDeskLayout((prev) => {
      const visible = prev
        .filter((w) => !w.hidden)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      const currentIndex = visible.findIndex((w) => w.id === id);
      if (currentIndex < 0 || currentIndex >= visible.length - 1) return prev;

      const nextWidget = visible[currentIndex + 1];
      const currentWidget = visible[currentIndex];

      const newOrderCurrent = nextWidget.order ?? 0;
      const newOrderNext = currentWidget.order ?? 0;

      const next = prev.map((w) => {
        if (w.id === currentWidget.id) return { ...w, order: newOrderCurrent };
        if (w.id === nextWidget.id) return { ...w, order: newOrderNext };
        return w;
      });

      saveDeskLayout(next);
      return next;
    });
  }, []);

  // Render individual widget component by ID with live dimensions
  const renderWidgetContent = (
    id: DeskWidgetId,
    dimensions: { width: number; height: number; isCompact: boolean; isExpanded: boolean }
  ) => {
    switch (id) {
      case 'time':
        return (
          <Clock
            location={settings.location}
            containerWidth={dimensions.width}
            containerHeight={dimensions.height}
          />
        );

      case 'prayer':
        return (
          <MiniPrayerTimer
            location={settings.location}
            containerWidth={dimensions.width}
            containerHeight={dimensions.height}
            onScrollToFull={() => {
              const el = document.getElementById('whole-prayer-schedule');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        );

      case 'pomodoro':
        return (
          <div className="flex-1 flex flex-col justify-between h-full">
            <StudyTimer
              settings={settings.timer}
              onStudyCycleCompleted={handleStudyCycleCompleted}
              onOpenSettings={() => setIsSettingsOpen(true)}
              containerWidth={dimensions.width}
              containerHeight={dimensions.height}
              todayStudySeconds={todayStudySeconds}
              dailyGoalHours={dailyGoalHours}
              onStudyTimeTick={handleStudyTimeTick}
            />
            {/* Integrated Quick Cycle Tracker status footer */}
            <div
              className="px-4 py-2 border-t flex items-center justify-between text-xs font-semibold select-none"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                  Today's Cycles:
                </span>
                <span className="font-mono font-black text-sm" style={{ color: 'var(--text-primary)' }}>
                  {cycles}
                </span>
                <span className="text-[10px] opacity-70 hidden sm:inline">
                  (Goal: 6+)
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleUpdateCycles(Math.max(0, cycles - 1))}
                  disabled={cycles === 0}
                  className="px-2 py-0.5 rounded border text-[11px] font-bold hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                  style={{ borderColor: 'var(--border-color)' }}
                  title="Decrease cycle count"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateCycles(cycles + 1)}
                  className="px-2 py-0.5 rounded border text-[11px] font-bold hover:bg-slate-200 dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                  style={{ borderColor: 'var(--border-color)' }}
                  title="Add completed cycle"
                >
                  +1
                </button>
              </div>
            </div>
          </div>
        );

      case 'todolist':
        return (
          <TodoList
            todos={todos}
            onAddTodo={handleAddTodo}
            onToggleTodo={handleToggleTodo}
            onEditTodo={handleEditTodo}
            onDeleteTodo={handleDeleteTodo}
            onClearCompleted={handleClearCompleted}
            containerWidth={dimensions.width}
            containerHeight={dimensions.height}
          />
        );

      case 'calendar':
        return (
          <CalendarWidget
            containerWidth={dimensions.width}
            containerHeight={dimensions.height}
          />
        );

      case 'trello':
        return (
          <TrelloWidget
            containerWidth={dimensions.width}
            containerHeight={dimensions.height}
          />
        );

      case 'cycles':
        return (
          <CycleCounter
            cycles={cycles}
            onUpdateCycles={handleUpdateCycles}
            containerWidth={dimensions.width}
          />
        );

      case 'music':
        return (
          <MusicWidget
            containerWidth={dimensions.width}
            containerHeight={dimensions.height}
            isGoat={settings.style === 'goat'}
            goatPreset={settings.goatPreset}
          />
        );

      case 'notes':
        return (
          <NotesWidget
            containerWidth={dimensions.width}
            containerHeight={dimensions.height}
          />
        );

      case 'duas':
        return (
          <div className="flex-1 overflow-y-auto p-2">
            <DuaCards />
          </div>
        );

      case 'prayer_full':
        return (
          <div className="flex-1 overflow-y-auto p-2">
            <PrayerWidget
              location={settings.location}
              onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          </div>
        );

      case 'stats':
        return (
          <div className="flex-1 overflow-y-auto p-2">
            <StudyHistory
              history={history}
              todayStudySeconds={todayStudySeconds}
              dailyGoalHours={dailyGoalHours}
              onUpdateDailyGoal={handleUpdateDailyGoal}
              onRefreshData={() => {
                setHistory(loadHistory());
                setTodayStudySeconds(loadDailyStudySeconds(currentDateKey));
                setSettings(loadSettings());
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const getWidgetMeta = (id: DeskWidgetId) => {
    const isGoat = settings.style === 'goat';

    switch (id) {
      case 'time':
        return {
          title: isGoat ? 'Matchday Clock' : 'Central Clock',
          subtitle: isGoat ? 'Substitution Board · UEFA Night' : `${settings.location.city}`,
          icon: <ClockIcon className="w-3.5 h-3.5" />,
        };
      case 'prayer':
        return {
          title: isGoat ? 'Upcoming Match & Prayer' : 'Upcoming Prayer',
          subtitle: 'Countdown',
          icon: <Compass className="w-3.5 h-3.5" />,
        };
      case 'pomodoro':
        return {
          title: isGoat ? 'Training Sessions' : 'Pomodoro Focus Timer',
          subtitle: isGoat ? `${settings.timer.studyMinutes}m Work Rate & Sprints` : `${settings.timer.studyMinutes}m study`,
          icon: <BookOpen className="w-3.5 h-3.5" />,
        };
      case 'todolist':
        return {
          title: isGoat ? 'Mission Board' : 'Daily Admission To-Do',
          subtitle: isGoat
            ? `${todos.filter((t) => t.completed).length}/${todos.length} Matches Won (#7)`
            : `${todos.filter((t) => t.completed).length}/${todos.length} done`,
          icon: <ListTodo className="w-3.5 h-3.5" />,
        };
      case 'calendar':
        return {
          title: isGoat ? 'This Season' : 'Admission Calendar',
          subtitle: isGoat ? 'European Fixtures & Matchdays' : 'Milestones & Dates',
          icon: <CalendarIcon className="w-3.5 h-3.5" />,
        };
      case 'trello':
        return {
          title: isGoat ? 'Tactics & Match Strategy' : 'Study Kanban Board',
          subtitle: isGoat ? 'Tactical Board' : 'Subjects & Tasks',
          icon: <Kanban className="w-3.5 h-3.5" />,
        };
      case 'cycles':
        return {
          title: isGoat ? "Ballon d'Or Cabinet" : 'Daily Cycle Tracker',
          subtitle: isGoat ? `${cycles} Trophies Lifted` : `${cycles} completed`,
          icon: <Target className="w-3.5 h-3.5" />,
        };
      case 'music':
        return {
          title: isGoat ? 'Pre-Match Tunnel Audio' : 'Focus Study Music',
          subtitle: isGoat ? 'Focus & Stadium Beats' : 'Binaural & Lofi Waves',
          icon: <Music className="w-3.5 h-3.5" />,
        };
      case 'notes':
        return {
          title: isGoat ? 'Manager Notes & Playbook' : 'Quick Study Notes',
          subtitle: isGoat ? 'Strategy & Drills' : 'Formulas & Mnemonics',
          icon: <FileText className="w-3.5 h-3.5" />,
        };
      case 'duas':
        return {
          title: 'Focus & Reflection Duas',
          subtitle: '5 Spiritual Prayers',
          icon: <ScrollText className="w-3.5 h-3.5" />,
        };
      case 'prayer_full':
        return {
          title: 'Full Prayer Schedule',
          subtitle: 'All Daily Times',
          icon: <Compass className="w-3.5 h-3.5" />,
        };
      case 'stats':
        return {
          title: isGoat ? 'Career Statistics' : 'Study Analytics & Trends',
          subtitle: isGoat ? 'Performance Analytics & Goals' : 'History & Streaks',
          icon: <BarChart3 className="w-3.5 h-3.5" />,
        };
      default:
        return {
          title: 'Widget',
          subtitle: '',
          icon: <Sparkles className="w-3.5 h-3.5" />,
        };
    }
  };

  return (
    <div
      id="app-root-container"
      data-appearance={settings.style === 'jarvis' ? 'dark' : settings.appearance}
      data-style={settings.style}
      data-goat-preset={settings.style === 'goat' ? (settings.goatPreset || 'mr-champions-league') : undefined}
      data-theme={
        settings.style === 'goat'
          ? (settings.goatPreset || 'mr-champions-league')
          : settings.style === 'cyberdeck'
          ? 'cyberdeck'
          : settings.style === 'cassette'
          ? 'cassette'
          : settings.style === 'jarvis'
          ? 'jarvis'
          : settings.style === 'oblivion'
          ? 'oblivion'
          : settings.style === 'cybergothic'
          ? 'cybergothic'
          : settings.style === 'matrix'
          ? 'matrix'
          : settings.style === 'watchdogs'
          ? 'watchdogs'
          : settings.style === 'solarpunk' || settings.style === 'aerofuturism'
          ? 'solarpunk'
          : settings.appearance === 'dark'
          ? 'dark'
          : settings.style
      }
      className="min-h-screen flex flex-col transition-colors duration-200 relative overflow-x-hidden"
      style={{
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Background Matrix Digital Rain Effect */}
      {settings.style === 'matrix' && <MatrixDigitalRain />}
      {/* Background Watch Dogs ctOS Urban Surveillance Grid Effect */}
      {settings.style === 'watchdogs' && <WatchDogsBackground />}
      {/* Background Aero-Futurism / Solarpunk Solar Energy & Atmosphere Effect */}
      {(settings.style === 'solarpunk' || settings.style === 'aerofuturism') && <SolarpunkBackground />}
      {/* Background THE GOAT Stadium Atmosphere & Sweeping Floodlights */}
      {settings.style === 'goat' && <GoatStadiumBackground preset={settings.goatPreset || 'mr-champions-league'} />}
      {/* Preset 1: Subtle stadium floodlights sweeping background overlay */}
      {settings.style === 'goat' && (!settings.goatPreset || settings.goatPreset === 'mr-champions-league') && (
        <Preset1FloodlightOverlay />
      )}

      {/* Gold #D4AF37 star-shaped particles floating across screen celebrating the #7 legacy on mission completion */}
      <GoatStarParticles />

      {/* 1. Header with title, subtitle, independent appearance & style controls, sound & settings */}
      <Header
        appearance={settings.appearance}
        style={settings.style}
        goatPreset={settings.goatPreset || 'mr-champions-league'}
        onGoatPresetChange={handleGoatPresetChange}
        onAppearanceChange={handleAppearanceChange}
        onStyleChange={handleStyleChange}
        soundEnabled={settings.timer.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenSettings={() => setIsSettingsOpen(true)}
        location={settings.location}
        onLocationUpdate={handleLocationUpdate}
        onReplayIntro={handleReplayIntro}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-3 flex flex-col items-center">
        {/* The Jersey Cabinet: CR7 Era Presets switcher when in THE GOAT theme */}
        {settings.style === 'goat' && (
          <JerseyCabinet
            currentPreset={settings.goatPreset || 'mr-champions-league'}
            onSelectPreset={handleGoatPresetChange}
          />
        )}

        {/* INTERACTIVE DESK BAR: Controls for adaptive grid & freeform movable widgets */}
        <section className="w-full mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-2xs"
              style={{
                backgroundColor: 'var(--accent-soft)',
                borderColor: 'var(--border-color)',
                color: 'var(--accent-text)',
              }}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{effectiveLayoutMode === 'adaptive' ? 'Adaptive Responsive Desk' : 'Free-Move Interactive Desk'}</span>
            </span>

            {/* Layout mode switcher on viewports wide enough for freeform canvas */}
            {!isNarrowScreen ? (
              <div
                id="layout-mode-toggle-group"
                className="inline-flex items-center p-0.5 rounded-xl border text-xs font-bold"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleSetLayoutMode('adaptive')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    layoutMode === 'adaptive' ? 'shadow-xs font-black text-white' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    background: layoutMode === 'adaptive' ? 'var(--accent-gradient)' : 'transparent',
                    color: layoutMode === 'adaptive' ? '#ffffff' : 'var(--text-secondary)',
                  }}
                  title="Fluid multi-column adaptive layout that reorganizes dynamically"
                >
                  📐 Adaptive Grid
                </button>
                <button
                  type="button"
                  onClick={() => handleSetLayoutMode('freeform')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    layoutMode === 'freeform' ? 'shadow-xs font-black text-white' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    background: layoutMode === 'freeform' ? 'var(--accent-gradient)' : 'transparent',
                    color: layoutMode === 'freeform' ? '#ffffff' : 'var(--text-secondary)',
                  }}
                  title="Freeform drag and resize anywhere on desktop canvas"
                >
                  🖐️ Freeform Canvas
                </button>
              </div>
            ) : (
              <span
                className="text-[11px] font-medium px-2 py-0.5 rounded-full border opacity-75 hidden xs:inline"
                style={{
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-muted)',
                }}
              >
                Intelligently adapts to available screen width
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end flex-wrap">
            {/* Widget Manager Modal Trigger Button */}
            <button
              type="button"
              id="open-widget-manager-btn"
              onClick={() => setIsWidgetManagerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl border shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer text-white"
              style={{
                background: 'var(--accent-gradient)',
              }}
              title="Add, remove, or customize dashboard widgets"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Widgets ({deskLayout.filter((w) => !w.hidden).length}/{ALL_WIDGETS_METADATA.length})</span>
            </button>

            {/* Quick auto-align button in freeform canvas */}
            {effectiveLayoutMode === 'freeform' && (
              <button
                type="button"
                onClick={handleAutoAlignDeskLayout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer opacity-90 hover:opacity-100"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--accent)',
                }}
                title="Auto-align and snap all visible widgets into a clean 2-column matrix"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Align</span>
              </button>
            )}

            {/* Quick reset widget layout button */}
            <button
              type="button"
              onClick={handleResetDeskLayout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer opacity-90 hover:opacity-100"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
              title="Reset desk widgets to tidy default positions and sizes calculated for your screen width"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Layout</span>
            </button>
          </div>
        </section>

        {/* 2. DYNAMIC WORKSPACE: ADAPTIVE FLUID GRID OR FREEFORM CANVAS */}
        {effectiveLayoutMode === 'adaptive' ? (
          <section
            ref={deskContainerRef}
            id="desk-canvas-area"
            className="w-full relative rounded-3xl border border-dashed p-3 sm:p-5 transition-all duration-300"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-card-subtle)',
            }}
          >
            {deskLayout.filter((w) => !w.hidden).length === 0 ? (
              <div className="py-20 sm:py-24 text-center flex flex-col items-center justify-center opacity-70">
                <SlidersHorizontal className="w-10 h-10 mb-3 text-amber-500 animate-pulse" />
                <h3 className="text-base font-black mb-1" style={{ color: 'var(--text-primary)' }}>
                  All Widgets Are Currently Hidden
                </h3>
                <p className="text-xs max-w-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  Your desk is completely cleared. Open the Widget Manager to restore or add any focus tools.
                </p>
                <button
                  type="button"
                  onClick={() => setIsWidgetManagerOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-md transition-all hover:scale-105 cursor-pointer"
                  style={{ background: 'var(--accent-gradient)' }}
                >
                  Open Widget Manager
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5 w-full">
                {deskLayout
                  .filter((w) => !w.hidden)
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((widgetConfig, idx, arr) => {
                    const meta = getWidgetMeta(widgetConfig.id);
                    // Determine smart multi-column span for wider widgets on tablets / desktops:
                    // Default desktop pairs have ~60% (7 cols) and ~40% (5 cols) out of 12 columns.
                    let colSpanClass = 'col-span-1 sm:col-span-12 md:col-span-6';

                    if (widgetConfig.id === 'time') {
                      // Row 1 Left: Central Clock (~60% width)
                      colSpanClass = 'col-span-1 sm:col-span-7';
                    } else if (widgetConfig.id === 'prayer') {
                      // Row 1 Right: Upcoming Prayer (~40% width)
                      colSpanClass = 'col-span-1 sm:col-span-5';
                    } else if (widgetConfig.id === 'pomodoro') {
                      // Row 2 Left: Pomodoro Study Timer (~60% width)
                      colSpanClass = 'col-span-1 sm:col-span-12 md:col-span-7';
                    } else if (widgetConfig.id === 'music') {
                      // Row 2 Right: Study Music & Ambient Player (~40% width)
                      colSpanClass = 'col-span-1 sm:col-span-12 md:col-span-5';
                    } else if (widgetConfig.id === 'todolist') {
                      // Row 3 Left: Admission To Do List (~60% width)
                      colSpanClass = 'col-span-1 sm:col-span-12 md:col-span-7';
                    } else if (widgetConfig.id === 'calendar') {
                      // Row 3 Right: Milestones & Exam Calendar (~40% width)
                      colSpanClass = 'col-span-1 sm:col-span-12 md:col-span-5';
                    } else if (
                      widgetConfig.id === 'stats' ||
                      widgetConfig.id === 'prayer_full' ||
                      (widgetConfig.colSpan !== undefined && widgetConfig.colSpan >= 12)
                    ) {
                      colSpanClass = 'col-span-1 sm:col-span-12';
                    } else if (widgetConfig.colSpan === 7) {
                      colSpanClass = 'col-span-1 sm:col-span-12 md:col-span-7';
                    } else if (widgetConfig.colSpan === 5) {
                      colSpanClass = 'col-span-1 sm:col-span-12 md:col-span-5';
                    } else if (widgetConfig.colSpan !== undefined) {
                      colSpanClass =
                        widgetConfig.colSpan >= 8
                          ? 'col-span-1 sm:col-span-12 md:col-span-8'
                          : 'col-span-1 sm:col-span-12 md:col-span-6';
                    }

                    return (
                      <div key={widgetConfig.id} className={`${colSpanClass} flex flex-col w-full min-w-0`}>
                        <MovableResizableWidget
                          config={widgetConfig}
                          title={meta.title}
                          subtitle={meta.subtitle}
                          icon={meta.icon}
                          layoutMode="adaptive"
                          containerWidth={containerWidth}
                          isFirst={idx === 0}
                          isLast={idx === arr.length - 1}
                          onMoveUp={handleMoveWidgetUp}
                          onMoveDown={handleMoveWidgetDown}
                          onUpdatePositionAndSize={handleUpdateWidgetPositionAndSize}
                          onBringToFront={handleBringToFront}
                          onResetSize={handleResetDeskLayout}
                          onClose={(id) => handleToggleWidget(id, false)}
                        >
                          {(dimensions) => renderWidgetContent(widgetConfig.id, dimensions)}
                        </MovableResizableWidget>
                      </div>
                    );
                  })}
              </div>
            )}
          </section>
        ) : (
          <section
            ref={deskContainerRef}
            id="desk-canvas-area"
            className="w-full relative rounded-3xl border border-dashed p-4 transition-all duration-300 select-none overflow-x-hidden"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-card-subtle)',
              minHeight: `${Math.max(
                700,
                ...deskLayout
                  .filter((w) => !w.hidden)
                  .map((w) => (w.y ?? 0) + (w.height ?? 380) + 40),
                0
              )}px`,
            }}
          >
            {deskLayout.filter((w) => !w.hidden).length === 0 ? (
              <div className="py-24 text-center flex flex-col items-center justify-center opacity-70">
                <SlidersHorizontal className="w-10 h-10 mb-3 text-amber-500 animate-pulse" />
                <h3 className="text-base font-black mb-1" style={{ color: 'var(--text-primary)' }}>
                  All Widgets Are Currently Hidden
                </h3>
                <p className="text-xs max-w-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  Your desk is completely cleared. Open the Widget Manager to restore or add any focus tools.
                </p>
                <button
                  type="button"
                  onClick={() => setIsWidgetManagerOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-md transition-all hover:scale-105 cursor-pointer"
                  style={{ background: 'var(--accent-gradient)' }}
                >
                  Open Widget Manager
                </button>
              </div>
            ) : (
              deskLayout
                .filter((widgetConfig) => !widgetConfig.hidden)
                .map((widgetConfig) => {
                  const meta = getWidgetMeta(widgetConfig.id);
                  return (
                    <MovableResizableWidget
                      key={widgetConfig.id}
                      config={widgetConfig}
                      title={meta.title}
                      subtitle={meta.subtitle}
                      icon={meta.icon}
                      layoutMode="freeform"
                      containerWidth={containerWidth}
                      onUpdatePositionAndSize={handleUpdateWidgetPositionAndSize}
                      onBringToFront={handleBringToFront}
                      onResetSize={handleResetDeskLayout}
                      onClose={(id) => handleToggleWidget(id, false)}
                    >
                      {(dimensions) => renderWidgetContent(widgetConfig.id, dimensions)}
                    </MovableResizableWidget>
                  );
                })
            )}
          </section>
        )}

        {/* 3. DOWNWARDS: The Whole Prayer Schedule & Timers */}
        <section id="whole-prayer-schedule" className="w-full my-6">
          <PrayerWidget
            location={settings.location}
            onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        </section>

        {/* 4. Five Focus & Reflection Dua Cards */}
        <section className="w-full my-4">
          <DuaCards />
        </section>

        {/* 5. Study History & Aggregate Trends */}
        <section className="w-full my-4">
          <StudyHistory
            history={history}
            todayStudySeconds={todayStudySeconds}
            dailyGoalHours={dailyGoalHours}
            onUpdateDailyGoal={handleUpdateDailyGoal}
            onRefreshData={() => {
              setHistory(loadHistory());
              setTodayStudySeconds(loadDailyStudySeconds(currentDateKey));
              setSettings(loadSettings());
            }}
          />
        </section>
      </main>

      {/* Footer */}
      <footer
        className="w-full border-t py-6 text-center text-xs transition-colors"
        style={{
          borderColor: 'var(--border-color)',
          color: 'var(--text-muted)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="font-semibold tracking-wide">
              ADMISSION 2026 — FOCUS • STUDY • PRAY • REPEAT
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/___t_a_h_s_a_n__/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] font-bold text-pink-500 hover:underline inline-flex items-center gap-1"
                title="Instagram @___t_a_h_s_a_n__"
              >
                <Instagram className="w-3 h-3 text-pink-500" />
                <span>@___t_a_h_s_a_n__</span>
              </a>
              <span className="opacity-40">•</span>
              <a
                href="https://www.youtube.com/@tahsansharif17"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] font-bold text-red-500 hover:underline inline-flex items-center gap-1"
                title="YouTube @tahsansharif17"
              >
                <Youtube className="w-3 h-3 text-red-500" />
                <span>@tahsansharif17</span>
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2.5 font-mono text-[11px]">
            <span>Developed by Tahsan Sharif + AI</span>
            <span className="opacity-40">•</span>
            <span>Pin this tab 📌</span>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onResetOnboarding={handleResetOnboarding}
      />

      {/* Widget Manager Modal */}
      <WidgetManagerModal
        isOpen={isWidgetManagerOpen}
        onClose={() => setIsWidgetManagerOpen(false)}
        layout={deskLayout}
        onToggleWidget={handleToggleWidget}
        onShowAll={handleShowAllWidgets}
        onHideAll={handleHideAllWidgets}
        onResetLayout={handleResetDeskLayout}
      />

      {/* Step 1: Full-Screen Startup Intro (~2-3s animated command center intro) */}
      {showIntro && (
        <StartupIntro
          onComplete={handleIntroComplete}
          forceShow={true}
        />
      )}

      {/* Step 3 & 4: Post-Intro Glassmorphic Tab-Pinning Warning Modal (pops up 300-500ms after dashboard reveals) */}
      <TabPinningWarningModal
        isOpen={showWarning}
        onClose={handleCloseWarning}
      />

      {/* SIUUU! Victory celebration modal for THE GOAT theme */}
      <SiuuuCelebrationModal
        isOpen={isSiuuuModalOpen}
        onClose={() => setIsSiuuuModalOpen(false)}
        reason={siuuuReason}
        soundEnabled={settings.timer.soundEnabled}
      />
    </div>
  );
}
