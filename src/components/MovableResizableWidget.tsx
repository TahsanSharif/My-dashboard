import React, { useRef, useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Maximize2,
} from 'lucide-react';
import { DeskWidgetId, WidgetLayoutConfig } from '../types';

export interface WidgetCardProps {
  config: WidgetLayoutConfig;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: (dimensions: {
    width: number;
    height: number;
    isCompact: boolean;
    isExpanded: boolean;
  }) => React.ReactNode;
  isLocked?: boolean;
  onUpdatePositionAndSize?: (
    id: DeskWidgetId,
    changes: { x?: number; y?: number; width?: number; height?: number; zIndex?: number; colSpan?: number },
    commitToStorage?: boolean
  ) => void;
  onBringToFront?: (id: DeskWidgetId) => void;
  onResetSize?: (id: DeskWidgetId) => void;
  onClose?: (id: DeskWidgetId) => void;
  onMoveUp?: (id: DeskWidgetId) => void;
  onMoveDown?: (id: DeskWidgetId) => void;
  isFirst?: boolean;
  isLast?: boolean;
  layoutMode?: 'adaptive' | 'freeform';
  containerWidth?: number;
  isCanvasMode?: boolean;
}

/**
 * Standard Adaptive Grid Widget Card Component.
 * Supports interactive drag-and-drop reordering, bidirectional corner resizing (colSpan & height),
 * and layout locking to freeze positions and dimensions.
 */
export const WidgetCard: React.FC<WidgetCardProps> = ({
  config,
  title,
  subtitle,
  icon,
  headerAction,
  children,
  isLocked = false,
  onUpdatePositionAndSize,
  onBringToFront,
  onClose,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  containerWidth = 1200,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExiting, setIsExiting] = useState(false);

  // Live dimensions tracked via ResizeObserver
  const [currentDimensions, setCurrentDimensions] = useState<{ width: number; height: number }>({
    width: config.width ?? 420,
    height: config.height ?? 270,
  });

  const minHeight = config.minHeight ?? 180;

  // Track title/subtitle updates to trigger 'data-glitch' signal distortion animation
  const [isTitleGlitching, setIsTitleGlitching] = useState(false);
  const prevTitleRef = useRef(title + '::' + (subtitle || ''));

  useEffect(() => {
    const nextKey = title + '::' + (subtitle || '');
    if (prevTitleRef.current !== nextKey) {
      prevTitleRef.current = nextKey;
      setIsTitleGlitching(true);
      const timer = setTimeout(() => setIsTitleGlitching(false), 480);
      return () => clearTimeout(timer);
    }
  }, [title, subtitle]);

  // Track live sizes with ResizeObserver so inner child queries react immediately
  useEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setCurrentDimensions({
            width: Math.round(entry.contentRect.width),
            height: Math.round(entry.contentRect.height),
          });
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isCompact = currentDimensions.width < 400;
  const isExpanded = currentDimensions.width > 680;

  // Preset sizes (Height & Column Span adaptation for adaptive grid)
  const handleApplyPreset = (preset: 'compact' | 'medium' | 'expanded') => {
    if (isLocked) return;
    let h = 340;
    let cols = 6;
    if (preset === 'compact') {
      h = 260;
      cols = 5;
    } else if (preset === 'medium') {
      h = 380;
      cols = 7;
    } else if (preset === 'expanded') {
      h = 500;
      cols = 12;
    }
    onUpdatePositionAndSize?.(config.id, {
      height: h,
      colSpan: cols,
    }, true);
  };

  // Close / Hide widget with smooth animation
  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClose) {
      setIsExiting(true);
      setTimeout(() => {
        onClose(config.id);
      }, 180);
    }
  };

  // ── BIDIRECTIONAL CORNER RESIZING (Width/ColSpan & Height simultaneously) ──
  const [isResizing, setIsResizing] = useState(false);
  const [liveResize, setLiveResize] = useState<{
    height?: number;
    colSpan?: number;
    width?: number;
  }>({});

  const handleCornerResizeStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isLocked) return;
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;

    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const startWidth = rect.width;
    const startHeight = rect.height;
    const gridWidth = containerWidth || rect.parentElement?.parentElement?.clientWidth || window.innerWidth;
    const initialColSpan = config.colSpan ?? 6;

    setIsResizing(true);

    let finalHeight = Math.round(startHeight);
    let finalColSpan = initialColSpan;
    let finalWidth = Math.round(startWidth);

    const handlePointerMove = (moveEv: PointerEvent) => {
      moveEv.preventDefault();
      const deltaX = moveEv.clientX - startX;
      const deltaY = moveEv.clientY - startY;

      // Vertical resizing: clamp between minHeight and 780px
      const newHeight = Math.max(minHeight, Math.min(780, Math.round(startHeight + deltaY)));

      // Horizontal resizing: clamp between 260px and gridWidth
      const newWidth = Math.max(260, Math.min(gridWidth, Math.round(startWidth + deltaX)));

      // Snapping to 12-column grid span (4 to 12)
      const fraction = newWidth / gridWidth;
      let newColSpan = Math.round(fraction * 12);
      newColSpan = Math.max(4, Math.min(12, newColSpan));

      finalHeight = newHeight;
      finalColSpan = newColSpan;
      finalWidth = newWidth;

      setLiveResize({
        height: newHeight,
        colSpan: newColSpan,
        width: newWidth,
      });

      // Notify parent to reflow grid layout live without writing to storage on every tick
      onUpdatePositionAndSize?.(
        config.id,
        {
          height: newHeight,
          colSpan: newColSpan,
          width: newWidth,
        },
        false
      );
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      setIsResizing(false);
      setLiveResize({});

      // Commit final dimensions & column span to state and localStorage
      onUpdatePositionAndSize?.(
        config.id,
        {
          height: finalHeight,
          colSpan: finalColSpan,
          width: finalWidth,
        },
        true
      );
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const displayHeight = isResizing && liveResize.height !== undefined
    ? liveResize.height
    : config.height;

  return (
    <div
      ref={cardRef}
      id={`desk-card-${config.id}`}
      data-widget-id={config.id}
      className={`group/card card-panel panel-card flex flex-col rounded-3xl border shadow-lg overflow-hidden select-none transition-all duration-200 hover:shadow-xl w-full max-w-full relative ${
        isExiting ? 'opacity-0 scale-95 pointer-events-none' : ''
      } ${
        !isLocked ? 'hover:border-amber-500/40' : ''
      }`}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        height: displayHeight ? `${Math.min(Math.max(displayHeight, minHeight), 780)}px` : undefined,
        minHeight: `${minHeight}px`,
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
      }}
      onClick={() => onBringToFront?.(config.id)}
    >
      {/* ── WINDOW HEADER ── */}
      <div
        id={`header-drag-zone-${config.id}`}
        className={`px-3.5 sm:px-4 py-2.5 sm:py-3 border-b flex items-center justify-between gap-2 sm:gap-3 shrink-0 transition-colors select-none ${
          !isLocked ? 'cursor-grab active:cursor-grabbing hover:bg-black/5 dark:hover:bg-white/5' : 'cursor-default'
        }`}
        style={{
          backgroundColor: 'var(--bg-card-subtle)',
          borderColor: 'var(--border-color)',
        }}
        title={!isLocked ? `Click & drag ${title} to reorder in grid` : `${title} widget`}
      >
        {/* Left: Window Title, Icon, Reorder Handle & Sparkle indicator */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          {/* Subtle drag handle indicator when unlocked */}
          {!isLocked && (
            <div
              className="p-0.5 rounded text-amber-500/70 hover:text-amber-400 hover:bg-amber-500/10 transition-colors shrink-0"
              title="Drag to reorder in dashboard grid"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          )}

          <div className="p-1 rounded-md text-slate-400 group-hover/card:text-slate-600 dark:group-hover/card:text-slate-300 transition-colors shrink-0">
            <Sparkles className="w-3.5 h-3.5 opacity-60" style={{ color: 'var(--accent)' }} />
          </div>

          {icon && (
            <div className="shrink-0 text-sm" style={{ color: 'var(--accent)' }}>
              {icon}
            </div>
          )}

          <div className="truncate flex items-baseline gap-1.5 min-w-0">
            <span
              data-glitch={isTitleGlitching ? 'true' : undefined}
              data-glitch-text={title}
              className={`text-xs sm:text-sm font-black tracking-tight truncate ${
                isTitleGlitching ? 'data-glitch-active' : ''
              }`}
              style={{ color: 'var(--text-primary)' }}
            >
              {title}
            </span>
            {subtitle && (
              <span
                data-glitch={isTitleGlitching ? 'true' : undefined}
                className={`text-[10px] sm:text-xs font-mono font-medium hidden xs:inline truncate opacity-75 ${
                  isTitleGlitching ? 'data-glitch-active' : ''
                }`}
                style={{ color: 'var(--text-muted)' }}
              >
                · {subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Right: Quick actions (Reorder ↑↓ in adaptive grid, Preset sizes S/M/L, and Close ✕) */}
        <div
          className="flex items-center gap-1 shrink-0 widget-window-controls"
          data-no-drag="true"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {headerAction}

          {/* Touch-Friendly Reorder Buttons (Move Up ↑ & Move Down ↓) in Adaptive Grid Flow (visible when unlocked) */}
          {!isLocked && (onMoveUp || onMoveDown) && (
            <div
              className="flex items-center p-0.5 rounded-lg border text-[10px] font-bold"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
              data-no-drag="true"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp?.(config.id);
                }}
                disabled={isFirst}
                className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-20 hover:bg-slate-500/10 transition-colors cursor-pointer"
                title="Move widget up in dashboard order"
                aria-label={`Move ${title} up`}
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveDown?.(config.id);
                }}
                disabled={isLast}
                className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-20 hover:bg-slate-500/10 transition-colors cursor-pointer"
                title="Move widget down in dashboard order"
                aria-label={`Move ${title} down`}
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Preset size buttons (S, M, L) - visible when unlocked */}
          {!isLocked && (
            <div
              className="hidden sm:flex items-center p-0.5 rounded-lg border text-[10px] font-bold"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              <button
                type="button"
                onClick={() => handleApplyPreset('compact')}
                title="Compact Size (5 cols, 260px)"
                className="px-1.5 py-0.5 rounded hover:bg-slate-500/15 transition-colors cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
              >
                S
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('medium')}
                title="Medium Size (7 cols, 380px)"
                className="px-1.5 py-0.5 rounded hover:bg-slate-500/15 transition-colors cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
              >
                M
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('expanded')}
                title="Large Full-Width Size (12 cols, 500px)"
                className="px-1.5 py-0.5 rounded hover:bg-slate-500/15 transition-colors cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
              >
                L
              </button>
            </div>
          )}

          {/* Close / Hide Widget button (does NOT delete, hides to Widget Manager) */}
          {onClose && (
            <button
              type="button"
              data-no-drag="true"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={handleCloseClick}
              className="p-1.5 rounded-lg border text-slate-400 hover:text-rose-500 hover:border-rose-400/40 hover:bg-rose-500/10 transition-all cursor-pointer shrink-0 ml-0.5"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
              title={`Hide ${title} widget (restore anytime from ⊞ Widgets)`}
              aria-label={`Hide ${title} widget`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── RESPONSIVE WIDGET BODY ── */}
      <div
        className="flex-1 w-full flex flex-col min-h-0 overflow-y-auto relative cursor-default z-10"
        data-no-drag="true"
        onPointerDown={(e) => {
          onBringToFront?.(config.id);
          e.stopPropagation();
        }}
      >
        {children({
          width: currentDimensions.width,
          height: currentDimensions.height,
          isCompact,
          isExpanded,
        })}
      </div>

      {/* ── LIVE CORNER RESIZE TOOLTIP BADGE ── */}
      {isResizing && (
        <div className="absolute bottom-3 right-8 px-2.5 py-1 rounded-lg bg-black/90 text-amber-300 text-[11px] font-mono font-bold shadow-2xl border border-amber-500/50 pointer-events-none z-50 flex items-center gap-1.5 backdrop-blur-md">
          <Maximize2 className="w-3 h-3 text-amber-400" />
          <span>{liveResize.colSpan ?? config.colSpan ?? 6} cols</span>
          <span className="opacity-40">×</span>
          <span>{displayHeight}px</span>
        </div>
      )}

      {/* ── BIDIRECTIONAL CORNER RESIZE HANDLE (Bottom-Right, Hidden when isLocked) ── */}
      {!isLocked && (
        <div
          id={`resize-corner-${config.id}`}
          className="absolute bottom-0 right-0 w-7 h-7 flex items-end justify-end p-1 z-30 cursor-se-resize group/corner select-none touch-none"
          onPointerDown={handleCornerResizeStart}
          data-no-drag="true"
          title="Drag corner to scale both width & height"
        >
          {/* Subtle OS-style corner dots grip handle */}
          <div className="w-3.5 h-3.5 flex flex-col justify-end items-end gap-0.5 opacity-40 group-hover/corner:opacity-100 group-hover/corner:scale-110 transition-all pointer-events-none">
            <div className="w-1 h-1 rounded-full bg-amber-500" />
            <div className="flex gap-0.5">
              <div className="w-1 h-1 rounded-full bg-amber-500" />
              <div className="w-1 h-1 rounded-full bg-amber-500" />
            </div>
            <div className="flex gap-0.5">
              <div className="w-1 h-1 rounded-full bg-amber-500" />
              <div className="w-1 h-1 rounded-full bg-amber-500" />
              <div className="w-1 h-1 rounded-full bg-amber-500" />
            </div>
          </div>
        </div>
      )}

      {/* Number 7 Watermark element */}
      <span
        aria-hidden="true"
        className="widget-watermark-7 bg-number-7 watermark-overlay-7 number-7-watermark pointer-events-none select-none absolute bottom-[-10px] right-3 z-0"
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        7
      </span>
    </div>
  );
};

// Aliased export for backwards compatibility
export const MovableResizableWidget = WidgetCard;
export default WidgetCard;
