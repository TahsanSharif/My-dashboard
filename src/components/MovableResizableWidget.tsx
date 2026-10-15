import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  GripHorizontal,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  X,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { DeskWidgetId, WidgetLayoutConfig } from '../types';
import { snapToGrid, CANVAS_PADDING, SNAP_GRID_SIZE } from '../utils/freeformLayout';

export type ResizeHandlePosition =
  | 'nw' // top-left
  | 'ne' // top-right
  | 'se' // bottom-right
  | 'sw' // bottom-left
  | 'n'  // top
  | 's'  // bottom
  | 'e'  // right
  | 'w'; // left

interface MovableResizableWidgetProps {
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
  onUpdatePositionAndSize: (
    id: DeskWidgetId,
    changes: { x?: number; y?: number; width?: number; height?: number; zIndex?: number }
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

export const MovableResizableWidget: React.FC<MovableResizableWidgetProps> = ({
  config,
  title,
  subtitle,
  icon,
  headerAction,
  children,
  onUpdatePositionAndSize,
  onBringToFront,
  onResetSize,
  onClose,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  layoutMode = 'adaptive',
  containerWidth,
  isCanvasMode = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [activeResizeHandle, setActiveResizeHandle] = useState<ResizeHandlePosition | null>(null);

  // Live dimensions tracked via ResizeObserver
  const [currentDimensions, setCurrentDimensions] = useState<{ width: number; height: number }>({
    width: config.width || 400,
    height: config.height || 360,
  });

  const minWidth = config.minWidth || 280;
  const minHeight = config.minHeight || 180;

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

  // 1. FREE MOVEMENT via Header Click & Drag
  const handleHeaderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // In adaptive layout mode, widgets flow naturally in columns; disable free dragging so page scroll is smooth
    if (layoutMode !== 'freeform') return;

    // Only drag with primary mouse button / touch
    if (e.button !== 0) return;

    // Prevent dragging when clicking interactive elements in header
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('textarea') ||
      target.closest('a') ||
      target.hasAttribute('data-no-drag')
    ) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    onBringToFront?.(config.id);

    const card = cardRef.current;
    if (!card) return;
    const parent = card.parentElement;
    if (!parent) return;

    const startPointerX = e.clientX;
    const startPointerY = e.clientY;

    const startX = config.x ?? card.offsetLeft;
    const startY = config.y ?? card.offsetTop;

    setIsDragging(true);

    let latestX = startX;
    let latestY = startY;

    const onPointerMove = (moveEvt: PointerEvent) => {
      const deltaX = moveEvt.clientX - startPointerX;
      const deltaY = moveEvt.clientY - startPointerY;

      const parentWidth = parent.clientWidth;
      const cardWidth = card.offsetWidth;
      const padding = CANVAS_PADDING;

      // Snap coordinates to 20px grid increment & prevent canvas overflow
      const maxX = Math.max(padding, parentWidth - cardWidth - padding);
      const rawX = startX + deltaX;
      const rawY = startY + deltaY;

      const snappedX = snapToGrid(rawX, SNAP_GRID_SIZE);
      const snappedY = snapToGrid(rawY, SNAP_GRID_SIZE);

      latestX = Math.max(padding, Math.min(maxX, snappedX));
      latestY = Math.max(padding, snappedY);

      // Direct DOM transformation for 60fps zero-lag motion
      card.style.transform = `translate3d(${latestX}px, ${latestY}px, 0)`;
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      setIsDragging(false);

      onUpdatePositionAndSize(config.id, {
        x: latestX,
        y: latestY,
      });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
  };

  // 2. CORNER & EDGE RESIZING (All 4 corners & 4 edges)
  const handleResizePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    handle: ResizeHandlePosition
  ) => {
    e.preventDefault();
    e.stopPropagation();

    onBringToFront?.(config.id);

    const card = cardRef.current;
    if (!card) return;
    const parent = card.parentElement;
    const parentWidth = parent ? parent.clientWidth : 1200;

    const startPointerX = e.clientX;
    const startPointerY = e.clientY;

    const startX = config.x ?? card.offsetLeft;
    const startY = config.y ?? card.offsetTop;
    const startWidth = card.offsetWidth;
    const startHeight = card.offsetHeight;

    setActiveResizeHandle(handle);

    let latestWidth = startWidth;
    let latestHeight = startHeight;
    let latestX = startX;
    let latestY = startY;

    const onPointerMove = (moveEvt: PointerEvent) => {
      const deltaX = moveEvt.clientX - startPointerX;
      const deltaY = moveEvt.clientY - startPointerY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startX;
      let newY = startY;

      const padding = CANVAS_PADDING;

      // X-axis calculations
      if (handle === 'se' || handle === 'ne' || handle === 'e') {
        // Dragging right edge / corners: width increases with deltaX
        const maxW = Math.max(minWidth, parentWidth - startX - padding);
        newWidth = snapToGrid(Math.max(minWidth, Math.min(maxW, startWidth + deltaX)), SNAP_GRID_SIZE);
      } else if (handle === 'sw' || handle === 'nw' || handle === 'w') {
        // Dragging left edge / corners: width changes inversely, x shifts
        const calculatedWidth = startWidth - deltaX;
        if (calculatedWidth >= minWidth) {
          newWidth = snapToGrid(calculatedWidth, SNAP_GRID_SIZE);
          newX = Math.max(padding, snapToGrid(startX + deltaX, SNAP_GRID_SIZE));
        } else {
          newWidth = minWidth;
          newX = startX + (startWidth - minWidth);
        }
      }

      // Y-axis calculations
      if (handle === 'se' || handle === 'sw' || handle === 's') {
        // Dragging bottom edge / corners: height increases with deltaY
        newHeight = snapToGrid(Math.max(minHeight, Math.min(1200, startHeight + deltaY)), SNAP_GRID_SIZE);
      } else if (handle === 'ne' || handle === 'nw' || handle === 'n') {
        // Dragging top edge / corners: height changes inversely, y shifts
        const calculatedHeight = startHeight - deltaY;
        if (calculatedHeight >= minHeight) {
          newHeight = snapToGrid(calculatedHeight, SNAP_GRID_SIZE);
          newY = Math.max(padding, snapToGrid(startY + deltaY, SNAP_GRID_SIZE));
        } else {
          newHeight = minHeight;
          newY = startY + (startHeight - minHeight);
        }
      }

      latestWidth = Math.round(newWidth);
      latestHeight = Math.round(newHeight);
      latestX = Math.round(newX);
      latestY = Math.round(newY);

      // Direct live DOM application for zero flicker / lag
      card.style.width = `${latestWidth}px`;
      card.style.height = `${latestHeight}px`;
      card.style.transform = `translate3d(${latestX}px, ${latestY}px, 0)`;
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      setActiveResizeHandle(null);

      onUpdatePositionAndSize(config.id, {
        x: latestX,
        y: latestY,
        width: latestWidth,
        height: latestHeight,
      });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
  };

  const isCompact = currentDimensions.width < 400;
  const isExpanded = currentDimensions.width > 680;

  // Preset sizes
  const handleApplyPreset = (preset: 'compact' | 'medium' | 'expanded') => {
    let w = 420;
    let h = 340;
    if (preset === 'compact') {
      w = 340;
      h = 260;
    } else if (preset === 'expanded') {
      w = 720;
      h = 520;
    }
    onUpdatePositionAndSize(config.id, {
      width: w,
      height: h,
    });
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

  const isAdaptive = layoutMode === 'adaptive';

  // Compute safe bounding box for freeform canvas mode
  const padding = CANVAS_PADDING;
  const safeParentWidth = Math.max(960, containerWidth || 1200);
  const boundedWidth = isAdaptive
    ? undefined
    : Math.max(minWidth, Math.min(config.width ?? 460, safeParentWidth - padding * 2));
  const boundedX = isAdaptive
    ? undefined
    : Math.max(padding, Math.min(config.x ?? padding, safeParentWidth - (boundedWidth ?? 460) - padding));
  const boundedY = isAdaptive ? undefined : Math.max(padding, config.y ?? padding);

  return (
    <div
      ref={cardRef}
      id={`desk-card-${config.id}`}
      data-widget-id={config.id}
      data-active={isDragging || activeResizeHandle ? 'true' : undefined}
      className={`group/card card-panel flex flex-col rounded-3xl border shadow-lg overflow-hidden select-none transition-all duration-200 ${
        isExiting
          ? 'opacity-0 scale-95 pointer-events-none'
          : isDragging
          ? 'shadow-2xl ring-4 ring-blue-500/50 cursor-grabbing opacity-95 scale-[1.01] active-panel'
          : activeResizeHandle
          ? 'shadow-2xl ring-2 ring-sky-400 active-panel'
          : 'hover:shadow-xl'
      } ${isAdaptive ? 'w-full max-w-full' : ''}`}
      style={
        isAdaptive
          ? {
              position: 'relative',
              width: '100%',
              maxWidth: '100%',
              minWidth: 0,
              height: config.height ? `${Math.min(Math.max(config.height, minHeight), 680)}px` : undefined,
              minHeight: `${minHeight}px`,
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }
          : {
              position: 'absolute',
              top: 0,
              left: 0,
              transform: `translate3d(${boundedX}px, ${boundedY}px, 0)`,
              width: `${boundedWidth}px`,
              height: `${config.height ?? 380}px`,
              minWidth: `${minWidth}px`,
              minHeight: `${minHeight}px`,
              zIndex: isDragging || activeResizeHandle ? 999 : config.zIndex ?? 10,
              backgroundColor: 'var(--bg-card)',
              borderColor: isDragging || activeResizeHandle ? 'var(--accent)' : 'var(--border-color)',
            }
      }
      onClick={() => onBringToFront?.(config.id)}
    >
      {/* ── WINDOW HEADER ── */}
      <div
        id={`header-drag-zone-${config.id}`}
        onPointerDown={handleHeaderPointerDown}
        className={`px-3.5 sm:px-4 py-2.5 sm:py-3 border-b flex items-center justify-between gap-2 sm:gap-3 shrink-0 transition-colors select-none ${
          isAdaptive ? 'cursor-default' : isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          backgroundColor: 'var(--bg-card-subtle)',
          borderColor: 'var(--border-color)',
        }}
        title={
          isAdaptive
            ? `${title} widget`
            : 'Click and drag anywhere on this header to move freely'
        }
      >
        {/* Left: Window Title, Icon & Grip / Sparkle indicator */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div
            className="p-1 rounded-md text-slate-400 group-hover/card:text-slate-600 dark:group-hover/card:text-slate-300 transition-colors shrink-0"
          >
            {isAdaptive ? (
              <Sparkles className="w-3.5 h-3.5 opacity-60" style={{ color: 'var(--accent)' }} />
            ) : (
              <GripHorizontal className="w-4 h-4" />
            )}
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

        {/* Right: Quick actions (Reorder ↑↓ in adaptive, Preset sizes S/M/L, and Close ✕) */}
        <div
          className="flex items-center gap-1 shrink-0 widget-window-controls"
          data-no-drag="true"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {headerAction}

          {/* Touch-Friendly Reorder Buttons (Move Up ↑ & Move Down ↓) in Adaptive Grid Flow */}
          {isAdaptive && (onMoveUp || onMoveDown) && (
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

          {/* Preset size buttons (S, M, L) */}
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
              title="Compact Size"
              className="px-1.5 py-0.5 rounded hover:bg-slate-500/15 transition-colors cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              S
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('medium')}
              title="Medium Size"
              className="px-1.5 py-0.5 rounded hover:bg-slate-500/15 transition-colors cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              M
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('expanded')}
              title="Large Size"
              className="px-1.5 py-0.5 rounded hover:bg-slate-500/15 transition-colors cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              L
            </button>
          </div>

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
        className="flex-1 w-full flex flex-col min-h-0 overflow-y-auto relative cursor-default"
        data-no-drag="true"
        onPointerDown={(e) => {
          // Bring to front on click without initiating window movement
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

      {/* ── 8-WAY EASY RESIZING HANDLES (Only active in freeform canvas mode) ── */}
      {!isAdaptive && (
        <>
          {/* 1. TOP-LEFT CORNER (↖ Width + Height) */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, 'nw')}
            className="absolute -top-1 -left-1 w-5 h-5 cursor-nwse-resize z-50 flex items-center justify-center group/nw"
            title="Resize Top-Left (Width & Height)"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400/40 group-hover/nw:bg-blue-500 transition-colors opacity-0 group-hover/card:opacity-100" />
          </div>

          {/* 2. TOP-RIGHT CORNER (↗ Width + Height) */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, 'ne')}
            className="absolute -top-1 -right-1 w-5 h-5 cursor-nesw-resize z-50 flex items-center justify-center group/ne"
            title="Resize Top-Right (Width & Height)"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400/40 group-hover/ne:bg-blue-500 transition-colors opacity-0 group-hover/card:opacity-100" />
          </div>

          {/* 3. BOTTOM-LEFT CORNER (↙ Width + Height) */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, 'sw')}
            className="absolute -bottom-1 -left-1 w-5 h-5 cursor-nesw-resize z-50 flex items-center justify-center group/sw"
            title="Resize Bottom-Left (Width & Height)"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400/40 group-hover/sw:bg-blue-500 transition-colors opacity-0 group-hover/card:opacity-100" />
          </div>

          {/* 4. BOTTOM-RIGHT CORNER (↘ Width + Height) */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, 'se')}
            className="absolute -bottom-1 -right-1 w-6 h-6 cursor-nwse-resize z-50 flex items-center justify-center group/se"
            title="Resize Bottom-Right (Width & Height)"
          >
            <div className="w-3.5 h-3.5 rounded-br-xl border-r-2 border-b-2 border-slate-400 group-hover/se:border-blue-500 group-hover/se:scale-125 transition-all" />
          </div>

          {/* 5. TOP EDGE */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, 'n')}
            className="absolute -top-1 left-4 right-4 h-3 cursor-ns-resize z-40"
            title="Resize Height (Top Edge)"
          />

          {/* 6. BOTTOM EDGE */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, 's')}
            className="absolute -bottom-1 left-4 right-4 h-3 cursor-ns-resize z-40"
            title="Resize Height (Bottom Edge)"
          />

          {/* 7. LEFT EDGE */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, 'w')}
            className="absolute top-4 bottom-4 -left-1 w-3 cursor-ew-resize z-40"
            title="Resize Width (Left Edge)"
          />

          {/* 8. RIGHT EDGE */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, 'e')}
            className="absolute top-4 bottom-4 -right-1 w-3 cursor-ew-resize z-40"
            title="Resize Width (Right Edge)"
          />

          {/* Live dimensions badge while resizing */}
          {activeResizeHandle && (
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-mono font-bold shadow-xl border z-50 pointer-events-none"
              style={{
                background: 'var(--accent-gradient)',
                color: '#ffffff',
                borderColor: 'var(--border-color)',
              }}
            >
              {currentDimensions.width}px × {currentDimensions.height}px
            </div>
          )}
        </>
      )}
    </div>
  );
};
