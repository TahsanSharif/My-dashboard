import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';

interface CalendarWidgetProps {
  containerWidth?: number;
  containerHeight?: number;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  containerWidth,
  containerHeight,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const handlePrev = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNext = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const isCompact = containerWidth ? containerWidth < 380 : false;
  const isLarge = containerWidth ? containerWidth > 580 : false;

  // Key university admission countdown milestone (e.g. Admission 2026 Target: 100 days study cycle)
  const admissionTarget = new Date(2026, 7, 1); // August 2026 target
  const daysRemaining = Math.max(0, Math.ceil((admissionTarget.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div
      id="calendar-widget-content"
      className="w-full h-full flex flex-col justify-start gap-2 select-none transition-all overflow-y-auto overflow-x-hidden min-h-0 relative"
      style={{
        color: 'var(--text-primary)',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: '8px',
        padding: isCompact ? '10px 12px' : '12px 14px',
      }}
    >
      {/* Calendar Header: Month/Year navigation */}
      <div className="shrink-0 flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <h3 className="font-bold text-sm tracking-tight">
            {monthNames[month]} <span className="font-mono text-xs opacity-75">{year}</span>
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToday}
            className="px-2.5 py-1 text-[11px] font-bold rounded-lg border shadow-2xs transition-colors hover:scale-105 active:scale-95 cursor-pointer min-h-[32px] flex items-center justify-center"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
          >
            Today
          </button>

          <button
            type="button"
            onClick={handlePrev}
            className="p-1.5 rounded-lg border hover:opacity-80 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="p-1.5 rounded-lg border hover:opacity-80 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
            aria-label="Next month"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="shrink-0 grid grid-cols-7 gap-1 text-center text-[10px] font-bold opacity-60 mb-0.5">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-0.5">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid Days */}
      <div className="grid grid-cols-7 gap-1 flex-1 min-h-0 items-stretch">
        {/* Prev month fill */}
        {Array.from({ length: firstDayIndex }).map((_, i) => {
          const prevDay = daysInPrevMonth - firstDayIndex + i + 1;
          return (
            <div
              key={`prev-${i}`}
              className="flex items-center justify-center text-xs opacity-25 font-mono p-1 rounded-lg"
            >
              {prevDay}
            </div>
          );
        })}

        {/* Current month days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const isToday = isCurrentMonth && today.getDate() === dayNum;

          return (
            <div
              key={`day-${dayNum}`}
              className={`flex flex-col items-center justify-center text-xs font-mono font-medium rounded-xl transition-all ${
                isToday
                  ? 'font-bold shadow-xs text-white scale-105'
                  : 'hover:bg-slate-500/10'
              }`}
              style={{
                background: isToday ? 'var(--accent-gradient)' : 'transparent',
                border: isToday ? 'none' : '1px solid transparent',
              }}
            >
              <span>{dayNum}</span>
              {isToday && (
                <span className="w-1 h-1 rounded-full bg-white mt-0.5" />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Admission Target Counter */}
      <div
        className="shrink-0 mt-1 pt-1.5 border-t flex items-center justify-between text-[11px]"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <span className="opacity-70 flex items-center gap-1">
          <Clock className="w-3 h-3 text-amber-500" />
          <span>Life Pivot Sprint</span>
        </span>
        <span
          className="font-bold px-2 py-0.5 rounded-full text-[10px]"
          style={{
            backgroundColor: 'var(--accent-soft)',
            color: 'var(--accent-text)',
          }}
        >
          {daysRemaining} days to exam
        </span>
      </div>
    </div>
  );
};
