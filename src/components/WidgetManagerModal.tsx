import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Clock,
  BookOpen,
  ListTodo,
  Calendar as CalendarIcon,
  Kanban,
  Target,
  Music,
  FileText,
  Compass,
  ScrollText,
  BarChart3,
  AlertTriangle,
  SlidersHorizontal,
  Plus,
} from 'lucide-react';
import { DeskWidgetId, WidgetLayoutConfig } from '../types';

export interface WidgetMetaInfo {
  id: DeskWidgetId;
  name: string;
  category: 'productivity' | 'study' | 'prayer' | 'music' | 'planning';
  categoryLabel: string;
  description: string;
  icon: React.ReactNode;
  defaultSize: string;
}

export const ALL_WIDGETS_METADATA: WidgetMetaInfo[] = [
  {
    id: 'time',
    name: 'Central Clock & Date',
    category: 'planning',
    categoryLabel: '📋 Planning',
    description: 'High-contrast digital clock with local seconds pulse and dynamic date card.',
    icon: <Clock className="w-4 h-4" />,
    defaultSize: '760 × 250 px',
  },
  {
    id: 'prayer',
    name: 'Upcoming Prayer Countdown',
    category: 'prayer',
    categoryLabel: '🕌 Prayer',
    description: 'Live countdown timer and notification for the next upcoming Salah in your city.',
    icon: <Compass className="w-4 h-4" />,
    defaultSize: '420 × 250 px',
  },
  {
    id: 'pomodoro',
    name: 'Pomodoro Focus Timer',
    category: 'productivity',
    categoryLabel: '🕐 Productivity',
    description: 'Customizable 90/20m study blocks with cycle counter & ambient audio bells.',
    icon: <BookOpen className="w-4 h-4" />,
    defaultSize: '640 × 520 px',
  },
  {
    id: 'music',
    name: 'Focus Study Music Player',
    category: 'music',
    categoryLabel: '🎵 Music',
    description: 'Zero-latency binaural alpha waves (432Hz), organic rain, lofi Rhodes & Spotify player.',
    icon: <Music className="w-4 h-4" />,
    defaultSize: '540 × 520 px',
  },
  {
    id: 'todolist',
    name: 'Daily Life Pivot To-Do',
    category: 'productivity',
    categoryLabel: '🕐 Productivity',
    description: 'High-yield task checklist with date-tracking and automatic progress calculation.',
    icon: <ListTodo className="w-4 h-4" />,
    defaultSize: '580 × 440 px',
  },
  {
    id: 'calendar',
    name: 'Life Pivot Milestones Calendar',
    category: 'productivity',
    categoryLabel: '🕐 Productivity',
    description: 'Exam dates, unit registration deadlines, and milestone countdown tracker.',
    icon: <CalendarIcon className="w-4 h-4" />,
    defaultSize: '600 × 440 px',
  },
  {
    id: 'trello',
    name: 'Study Kanban Board',
    category: 'planning',
    categoryLabel: '📋 Planning',
    description: 'Multi-column study organizer for Physics, Chemistry, Math & Life Pivot units.',
    icon: <Kanban className="w-4 h-4" />,
    defaultSize: '600 × 380 px',
  },
  {
    id: 'cycles',
    name: 'Daily Cycle Tracker',
    category: 'productivity',
    categoryLabel: '🕐 Productivity',
    description: 'Visual study cycle counter with daily completion rate and goal targets.',
    icon: <Target className="w-4 h-4" />,
    defaultSize: '580 × 280 px',
  },
  {
    id: 'notes',
    name: 'Quick Study Notes & Formulas',
    category: 'study',
    categoryLabel: '📚 Study',
    description: 'Rapid formula scratchpad, physics mnemonics, and pinned revision cards.',
    icon: <FileText className="w-4 h-4" />,
    defaultSize: '580 × 380 px',
  },
  {
    id: 'prayer_full',
    name: 'Full Prayer Schedule',
    category: 'prayer',
    categoryLabel: '🕌 Prayer',
    description: 'Complete 5 daily prayer timings with Fajr, Dhuhr, Asr, Maghrib & Isha for your city.',
    icon: <Compass className="w-4 h-4" />,
    defaultSize: '600 × 380 px',
  },
  {
    id: 'duas',
    name: 'Focus & Reflection Duas',
    category: 'prayer',
    categoryLabel: '🕌 Prayer',
    description: 'Authentic prayers for exam anxiety, knowledge retention, and spiritual peace.',
    icon: <ScrollText className="w-4 h-4" />,
    defaultSize: '600 × 340 px',
  },
  {
    id: 'stats',
    name: 'Study Analytics & Trends',
    category: 'study',
    categoryLabel: '📚 Study',
    description: 'Comprehensive 30-day aggregate study history, streak charts, and productivity metrics.',
    icon: <BarChart3 className="w-4 h-4" />,
    defaultSize: '1200 × 400 px',
  },
];

interface WidgetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  layout: WidgetLayoutConfig[];
  onToggleWidget: (id: DeskWidgetId, visible: boolean) => void;
  onShowAll: () => void;
  onHideAll: () => void;
  onResetLayout: () => void;
}

export const WidgetManagerModal: React.FC<WidgetManagerModalProps> = ({
  isOpen,
  onClose,
  layout,
  onToggleWidget,
  onShowAll,
  onHideAll,
  onResetLayout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [confirmDialog, setConfirmDialog] = useState<'reset' | 'hideAll' | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmDialog) {
          setConfirmDialog(null);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, confirmDialog, onClose]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setConfirmDialog(null);
      setSearchQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Layout lookup map
  const layoutMap = useMemo(() => {
    const map = new Map<DeskWidgetId, WidgetLayoutConfig>();
    layout.forEach((w) => map.set(w.id, w));
    return map;
  }, [layout]);

  const visibleCount = useMemo(() => {
    return ALL_WIDGETS_METADATA.filter((w) => {
      const config = layoutMap.get(w.id);
      return config ? config.hidden !== true : false;
    }).length;
  }, [layoutMap]);

  // Filter widgets by search query and category
  const filteredWidgets = useMemo(() => {
    return ALL_WIDGETS_METADATA.filter((widget) => {
      const matchesSearch =
        widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        widget.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        widget.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === 'all' || widget.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  if (!isOpen) return null;

  return (
    <div
      id="widget-manager-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !confirmDialog) {
          onClose();
        }
      }}
    >
      {/* ── MAIN MODAL CARD ── */}
      <div
        id="widget-manager-modal"
        className="w-full max-w-3xl rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 relative my-auto max-h-[92vh]"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          boxShadow: '0 25px 60px -15px var(--glow-color)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER ── */}
        <div
          className="px-5 py-4 border-b flex items-center justify-between gap-3 shrink-0"
          style={{
            backgroundColor: 'var(--bg-card-subtle)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0"
              style={{ background: 'var(--accent-gradient)' }}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className="text-base sm:text-lg font-black tracking-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  WIDGET MANAGER
                </h2>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                  style={{
                    backgroundColor: 'var(--accent-soft)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--accent-text)',
                  }}
                >
                  {visibleCount}/{ALL_WIDGETS_METADATA.length} Visible
                </span>
              </div>
              <p
                className="text-[11px] font-medium opacity-75"
                style={{ color: 'var(--text-muted)' }}
              >
                Customize visible dashboard tools. Hidden widgets preserve their position & size.
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-widget-manager-btn"
            onClick={onClose}
            className="p-2 rounded-full border shadow-2xs transition-all hover:scale-110 active:scale-95 cursor-pointer shrink-0"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
            title="Close (Esc)"
            aria-label="Close widget manager"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── SEARCH & CATEGORY FILTER BAR ── */}
        <div
          className="px-5 py-3 border-b flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search widgets (e.g. 'calendar', 'music', 'prayer')..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border outline-none font-medium transition-all shadow-2xs"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Bulk Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={onShowAll}
              className="px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition-all hover:scale-102 cursor-pointer shadow-2xs flex items-center gap-1"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              title="Make all widgets visible on dashboard"
            >
              <Eye className="w-3 h-3 text-emerald-500" />
              <span>Show All</span>
            </button>

            <button
              type="button"
              onClick={() => setConfirmDialog('hideAll')}
              className="px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition-all hover:scale-102 cursor-pointer shadow-2xs flex items-center gap-1"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
              title="Hide all widgets from dashboard"
            >
              <EyeOff className="w-3 h-3 text-rose-500" />
              <span>Hide All</span>
            </button>

            <button
              type="button"
              onClick={() => setConfirmDialog('reset')}
              className="px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition-all hover:scale-102 cursor-pointer shadow-2xs flex items-center gap-1"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
                color: 'var(--accent)',
              }}
              title="Reset widgets to default layout and visibility"
            >
              <RotateCcw className="w-3 h-3 text-amber-500" />
              <span>Reset Layout</span>
            </button>
          </div>
        </div>

        {/* Category Pills Tab */}
        <div
          className="px-5 py-2 border-b flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold shrink-0 no-scrollbar"
          style={{
            backgroundColor: 'var(--bg-card-subtle)',
            borderColor: 'var(--border-color)',
          }}
        >
          {[
            { id: 'all', label: 'All Widgets' },
            { id: 'productivity', label: '🕐 Productivity' },
            { id: 'study', label: '📚 Study' },
            { id: 'prayer', label: '🕌 Prayer' },
            { id: 'music', label: '🎵 Music' },
            { id: 'planning', label: '📋 Planning' },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive ? 'shadow-2xs text-white' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  background: isActive ? 'var(--accent-gradient)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ── WIDGETS LIST ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 min-h-0">
          {filteredWidgets.length === 0 ? (
            <div className="py-12 text-center opacity-60 flex flex-col items-center">
              <Search className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm font-semibold">No widgets match "{searchQuery}"</p>
              <p className="text-xs mt-1">Try another keyword or switch category filter.</p>
            </div>
          ) : (
            filteredWidgets.map((widget) => {
              const config = layoutMap.get(widget.id);
              const isVisible = config ? config.hidden !== true : false;
              const savedDimensions = config
                ? `${config.width ?? 460} × ${config.height ?? 380} px`
                : widget.defaultSize;

              return (
                <div
                  key={widget.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs ${
                    isVisible
                      ? 'ring-1 ring-emerald-500/20'
                      : 'opacity-85'
                  }`}
                  style={{
                    backgroundColor: isVisible ? 'var(--bg-card-subtle)' : 'var(--bg-card)',
                    borderColor: isVisible ? 'var(--accent)' : 'var(--border-color)',
                  }}
                >
                  {/* Left: Icon + Widget Title & Description */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs mt-0.5"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--accent)',
                      }}
                    >
                      {widget.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className="text-xs sm:text-sm font-black tracking-tight"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {widget.name}
                        </h3>

                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isVisible
                              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                              : 'text-slate-400 bg-slate-500/10 border-slate-500/20'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isVisible ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                          <span>{isVisible ? 'Visible' : 'Hidden'}</span>
                        </span>

                        <span
                          className="text-[10px] font-mono px-1.5 py-0.2 rounded opacity-60 hidden md:inline border"
                          style={{
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {savedDimensions}
                        </span>
                      </div>

                      <p
                        className="text-xs font-medium leading-relaxed opacity-75 mt-1"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {widget.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Toggle Switch & Show/Hide Button */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => onToggleWidget(widget.id, !isVisible)}
                      className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                        isVisible
                          ? 'text-slate-600 dark:text-slate-200 border hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-400/40'
                          : 'text-white hover:scale-105 active:scale-95'
                      }`}
                      style={{
                        backgroundColor: isVisible ? 'var(--bg-card)' : undefined,
                        borderColor: isVisible ? 'var(--border-color)' : undefined,
                        background: isVisible ? undefined : 'var(--accent-gradient)',
                      }}
                      title={isVisible ? `Hide ${widget.name} from dashboard` : `Show ${widget.name} on dashboard`}
                    >
                      {isVisible ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-rose-500" />
                          <span>Hide</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Show</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── FOOTER ── */}
        <div
          className="px-5 py-3 border-t flex items-center justify-between text-xs font-semibold shrink-0"
          style={{
            backgroundColor: 'var(--bg-card-subtle)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-1.5 text-[11px] opacity-75">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Widgets preserve custom coordinates & sizes when hidden.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{ background: 'var(--accent-gradient)' }}
          >
            Done
          </button>
        </div>

        {/* ── CONFIRMATION OVERLAY FOR RESET / HIDE ALL ── */}
        {confirmDialog && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center p-4 rounded-3xl animate-in fade-in duration-150"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div
              className="max-w-md w-full p-6 rounded-2xl border shadow-2xl text-center flex flex-col items-center"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h4
                className="text-base font-black mb-1.5"
                style={{ color: 'var(--text-primary)' }}
              >
                {confirmDialog === 'reset'
                  ? 'Reset Widget Layout?'
                  : 'Hide All Dashboard Widgets?'}
              </h4>

              <p
                className="text-xs font-medium leading-relaxed mb-5 opacity-80"
                style={{ color: 'var(--text-muted)' }}
              >
                {confirmDialog === 'reset'
                  ? 'This will restore the default widget positions, sizes, and initial visibility arrangements.'
                  : 'This will temporarily hide all widgets from your desk. You can restore any widget anytime from this manager.'}
              </p>

              <div className="flex items-center justify-center gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setConfirmDialog(null)}
                  className="flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all hover:scale-102 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-card-subtle)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirmDialog === 'reset') {
                      onResetLayout();
                    } else {
                      onHideAll();
                    }
                    setConfirmDialog(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: confirmDialog === 'reset' ? '#f59e0b' : '#ef4444',
                  }}
                >
                  {confirmDialog === 'reset' ? 'Confirm Reset' : 'Hide All'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
