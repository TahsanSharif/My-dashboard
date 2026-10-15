import { WidgetLayoutConfig, DeskWidgetId } from '../types';

export const SNAP_GRID_SIZE = 20;
export const CANVAS_PADDING = 20;
export const CANVAS_GAP = 20;

/**
 * Snap any numeric coordinate or dimension to the nearest grid increment.
 */
export function snapToGrid(value: number, step: number = SNAP_GRID_SIZE): number {
  return Math.round(value / step) * step;
}

/**
 * Default height definitions for standard widgets in freeform canvas mode
 */
export const DEFAULT_WIDGET_HEIGHTS: Record<string, number> = {
  time: 260,
  clock: 260,
  prayer: 260,
  pomodoro: 480,
  music: 480,
  todolist: 460,
  calendar: 460,
  trello: 400,
  notes: 400,
  cycles: 320,
  prayer_full: 380,
  duas: 360,
  stats: 420,
};

/**
 * Canonical column pairings for a structured, balanced 2-column desk matrix:
 * Row 1: Central Clock + Upcoming Prayer (60/40 ratio)
 * Row 2: Pomodoro Focus Timer + Focus Study Music (60/40 ratio)
 * Row 3: To-do List + Admission Calendar (60/40 ratio)
 * Row 4: Kanban Board + Scratchpad Notes (60/40 ratio)
 * Row 5: Daily Cycles + Full Prayer Schedule (60/40 ratio)
 */
const CANONICAL_PAIRS: [DeskWidgetId[], DeskWidgetId[]][] = [
  [['clock', 'time'], ['prayer']],
  [['pomodoro'], ['music']],
  [['todolist'], ['calendar']],
  [['trello'], ['notes']],
  [['cycles'], ['prayer_full']],
];

/**
 * Calculate clean, snapped, non-overlapping pixel coordinates (x, y, width, height)
 * for all widgets based on the current screen width.
 */
export function calculateTidyFreeformLayout(
  widgets: WidgetLayoutConfig[],
  containerWidth: number
): WidgetLayoutConfig[] {
  const safeWidth = Math.max(960, containerWidth);
  const padding = CANVAS_PADDING;
  const gap = CANVAS_GAP;
  const usableWidth = safeWidth - padding * 2;

  // 2-column snapped matrix: Col 1 is strictly 60% width, Col 2 is 40% width
  const col1Width = snapToGrid(Math.round((usableWidth - gap) * 0.60), SNAP_GRID_SIZE);
  const col2Width = usableWidth - gap - col1Width;

  const col1X = padding;
  const col2X = padding + col1Width + gap;

  // Map existing widgets for easy lookup
  const widgetMap = new Map<string, WidgetLayoutConfig>();
  widgets.forEach((w) => widgetMap.set(w.id, { ...w }));

  const processed = new Set<string>();
  const result: WidgetLayoutConfig[] = [];

  let col1Y = padding;
  let col2Y = padding;

  // 1. Process canonical 2-column pairs first
  for (const [ids1, ids2] of CANONICAL_PAIRS) {
    let w1: WidgetLayoutConfig | undefined;
    for (const id of ids1) {
      if (widgetMap.has(id)) {
        w1 = widgetMap.get(id);
        break;
      }
    }

    let w2: WidgetLayoutConfig | undefined;
    for (const id of ids2) {
      if (widgetMap.has(id)) {
        w2 = widgetMap.get(id);
        break;
      }
    }

    const isW1Visible = w1 && !w1.hidden;
    const isW2Visible = w2 && !w2.hidden;

    if (isW1Visible && isW2Visible && w1 && w2) {
      // Both visible: Place side by side on a snapped row (60/40 ratio)
      const rowY = Math.max(col1Y, col2Y);
      const h1 = snapToGrid(w1.height || DEFAULT_WIDGET_HEIGHTS[w1.id] || 380, SNAP_GRID_SIZE);
      const h2 = snapToGrid(w2.height || DEFAULT_WIDGET_HEIGHTS[w2.id] || 380, SNAP_GRID_SIZE);

      result.push({
        ...w1,
        x: col1X,
        y: rowY,
        width: col1Width,
        height: h1,
        zIndex: w1.zIndex || 10,
      });

      result.push({
        ...w2,
        x: col2X,
        y: rowY,
        width: col2Width,
        height: h2,
        zIndex: w2.zIndex || 10,
      });

      col1Y = rowY + h1 + gap;
      col2Y = rowY + h2 + gap;

      processed.add(w1.id);
      processed.add(w2.id);
    } else if (isW1Visible && w1) {
      // Only w1 is visible: place into whichever column is currently shorter
      const isCol1 = col1Y <= col2Y;
      const x = isCol1 ? col1X : col2X;
      const width = isCol1 ? col1Width : col2Width;
      const y = isCol1 ? col1Y : col2Y;
      const h = snapToGrid(w1.height || DEFAULT_WIDGET_HEIGHTS[w1.id] || 380, SNAP_GRID_SIZE);

      result.push({
        ...w1,
        x,
        y,
        width,
        height: h,
        zIndex: w1.zIndex || 10,
      });

      if (isCol1) {
        col1Y += h + gap;
      } else {
        col2Y += h + gap;
      }
      processed.add(w1.id);
    } else if (isW2Visible && w2) {
      // Only w2 is visible
      const isCol1 = col1Y <= col2Y;
      const x = isCol1 ? col1X : col2X;
      const width = isCol1 ? col1Width : col2Width;
      const y = isCol1 ? col1Y : col2Y;
      const h = snapToGrid(w2.height || DEFAULT_WIDGET_HEIGHTS[w2.id] || 380, SNAP_GRID_SIZE);

      result.push({
        ...w2,
        x,
        y,
        width,
        height: h,
        zIndex: w2.zIndex || 10,
      });

      if (isCol1) {
        col1Y += h + gap;
      } else {
        col2Y += h + gap;
      }
      processed.add(w2.id);
    }
  }

  // 2. Process other visible widgets not in canonical pairs (e.g. duas, stats, custom)
  for (const w of widgets) {
    if (processed.has(w.id) || w.hidden) continue;

    const isFullWidth = w.id === 'stats' || (w.colSpan && w.colSpan >= 10);
    const defHeight = DEFAULT_WIDGET_HEIGHTS[w.id] || 380;
    const h = snapToGrid(w.height || defHeight, SNAP_GRID_SIZE);

    if (isFullWidth) {
      const rowY = Math.max(col1Y, col2Y);
      result.push({
        ...w,
        x: col1X,
        y: rowY,
        width: usableWidth,
        height: h,
        zIndex: w.zIndex || 10,
      });
      col1Y = rowY + h + gap;
      col2Y = col1Y;
    } else {
      const isCol1 = col1Y <= col2Y;
      const x = isCol1 ? col1X : col2X;
      const width = isCol1 ? col1Width : col2Width;
      const y = isCol1 ? col1Y : col2Y;

      result.push({
        ...w,
        x,
        y,
        width,
        height: h,
        zIndex: w.zIndex || 10,
      });

      if (isCol1) {
        col1Y += h + gap;
      } else {
        col2Y += h + gap;
      }
    }
    processed.add(w.id);
  }

  // 3. Process remaining hidden widgets, stacking them neatly below active content
  let hiddenY = Math.max(col1Y, col2Y) + gap;
  for (const w of widgets) {
    if (processed.has(w.id)) continue;

    const isFullWidth = w.id === 'stats' || (w.colSpan && w.colSpan >= 10);
    const defHeight = DEFAULT_WIDGET_HEIGHTS[w.id] || 380;
    const h = snapToGrid(w.height || defHeight, SNAP_GRID_SIZE);

    result.push({
      ...w,
      x: col1X,
      y: hiddenY,
      width: isFullWidth ? usableWidth : col1Width,
      height: h,
      zIndex: w.zIndex || 10,
    });

    hiddenY += h + gap;
    processed.add(w.id);
  }

  return result;
}

/**
 * Checks if current visible widgets in freeform canvas have valid, non-overlapping coordinates.
 */
export function isFreeformLayoutTidy(
  widgets: WidgetLayoutConfig[],
  containerWidth: number
): boolean {
  const visible = widgets.filter((w) => !w.hidden);
  if (visible.length <= 1) return true;

  const safeWidth = Math.max(960, containerWidth);

  for (let i = 0; i < visible.length; i++) {
    const a = visible[i];
    if (a.x === undefined || a.y === undefined || a.width === undefined || a.height === undefined) {
      return false;
    }
    // Check if widget bounds go completely off container
    if (a.x < 0 || a.x + (a.width || 300) > safeWidth + 40) {
      return false;
    }

    // Check for severe overlapping with any other card (> 40% area overlap)
    for (let j = i + 1; j < visible.length; j++) {
      const b = visible[j];
      if (b.x === undefined || b.y === undefined) continue;

      const overlapX = Math.max(0, Math.min(a.x + a.width, b.x + (b.width || 400)) - Math.max(a.x, b.x));
      const overlapY = Math.max(0, Math.min(a.y + a.height, b.y + (b.height || 300)) - Math.max(a.y, b.y));

      const overlapArea = overlapX * overlapY;
      const minArea = Math.min(a.width * a.height, (b.width || 400) * (b.height || 300));

      if (overlapArea > minArea * 0.35) {
        // Significant overlap detected
        return false;
      }
    }
  }

  return true;
}
