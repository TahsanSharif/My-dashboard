import React, { useState } from 'react';
import { Plus, Check, MoreHorizontal, Trash2, Tag, CheckCircle2 } from 'lucide-react';

interface KanbanCard {
  id: string;
  text: string;
  tag?: string;
}

interface KanbanColumn {
  id: 'todo' | 'progress' | 'done';
  title: string;
  color: string;
}

interface TrelloWidgetProps {
  containerWidth?: number;
  containerHeight?: number;
}

export const TrelloWidget: React.FC<TrelloWidgetProps> = ({
  containerWidth,
  containerHeight,
}) => {
  const [cards, setCards] = useState<Record<'todo' | 'progress' | 'done', KanbanCard[]>>(() => {
    try {
      const saved = localStorage.getItem('admission_kanban_cards');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      todo: [
        { id: '1', text: 'Physics Chapter 4 Practice', tag: 'Physics' },
        { id: '2', text: 'Organic Chemistry Reactions', tag: 'Chemistry' },
      ],
      progress: [
        { id: '3', text: 'Calculus Differentiation Drill', tag: 'Math' },
      ],
      done: [
        { id: '4', text: 'English Vocabulary Sheet', tag: 'English' },
      ],
    };
  });

  const [inputCol, setInputCol] = useState<'todo' | 'progress' | 'done' | null>(null);
  const [newText, setNewText] = useState('');

  const saveCards = (newCards: typeof cards) => {
    setCards(newCards);
    try {
      localStorage.setItem('admission_kanban_cards', JSON.stringify(newCards));
    } catch {}
  };

  const handleAddCard = (colId: 'todo' | 'progress' | 'done') => {
    if (!newText.trim()) {
      setInputCol(null);
      return;
    }
    const newCard: KanbanCard = {
      id: Date.now().toString(),
      text: newText.trim(),
      tag: 'Study',
    };
    const updated = {
      ...cards,
      [colId]: [...cards[colId], newCard],
    };
    saveCards(updated);
    setNewText('');
    setInputCol(null);
  };

  const handleMoveCard = (
    cardId: string,
    fromCol: 'todo' | 'progress' | 'done',
    toCol: 'todo' | 'progress' | 'done'
  ) => {
    if (fromCol === toCol) return;
    const card = cards[fromCol].find((c) => c.id === cardId);
    if (!card) return;

    const updated = {
      ...cards,
      [fromCol]: cards[fromCol].filter((c) => c.id !== cardId),
      [toCol]: [...cards[toCol], card],
    };
    if (toCol === 'done') {
      window.dispatchEvent(
        new CustomEvent('goat-mission-completed', {
          detail: { id: cardId, text: card.text },
        })
      );
    }
    saveCards(updated);
  };

  const handleDeleteCard = (colId: 'todo' | 'progress' | 'done', cardId: string) => {
    const updated = {
      ...cards,
      [colId]: cards[colId].filter((c) => c.id !== cardId),
    };
    saveCards(updated);
  };

  const columns: KanbanColumn[] = [
    { id: 'todo', title: 'To Do', color: '#3b82f6' },
    { id: 'progress', title: 'In Progress', color: '#f59e0b' },
    { id: 'done', title: 'Completed', color: '#10b981' },
  ];

  const [activeCompactCol, setActiveCompactCol] = useState<'todo' | 'progress' | 'done'>('todo');
  const isCompact = containerWidth ? containerWidth < 540 : false;

  return (
    <div
      id="trello-widget-content"
      className="w-full h-full flex flex-col justify-start gap-2 p-3 sm:p-3.5 relative overflow-y-auto overflow-x-hidden min-h-0 select-none"
      style={{
        color: 'var(--text-primary)',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: '8px',
      }}
    >
      {/* Compact Column Switcher Tabs on narrow viewports */}
      {isCompact && (
        <div
          className="flex items-center p-1 rounded-xl border mb-2.5 gap-1 shrink-0"
          style={{
            backgroundColor: 'var(--bg-card-subtle)',
            borderColor: 'var(--border-color)',
          }}
        >
          {columns.map((col) => {
            const isActive = activeCompactCol === col.id;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => setActiveCompactCol(col.id)}
                className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isActive ? 'shadow-xs font-black' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                <span>{col.title}</span>
                <span className="text-[10px] font-mono opacity-70">({cards[col.id].length})</span>
              </button>
            );
          })}
        </div>
      )}

      <div className={`grid ${isCompact ? 'grid-cols-1' : 'grid-cols-3 gap-3'} flex-1 min-h-0`}>
        {columns
          .filter((col) => (!isCompact ? true : col.id === activeCompactCol))
          .map((col) => {
            const colCards = cards[col.id];
          return (
            <div
              key={col.id}
              className="flex flex-col rounded-2xl border p-2.5 flex-1 min-h-[120px] overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
              }}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between gap-1 mb-2 px-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: col.color }}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {col.title}
                  </span>
                  <span
                    className="px-1.5 py-0.2 rounded-full text-[10px] font-bold border"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {colCards.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setInputCol(col.id);
                    setNewText('');
                  }}
                  className="p-1 rounded-md hover:bg-slate-500/10 cursor-pointer"
                  title="Add card"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card input field */}
              {inputCol === col.id && (
                <div className="mb-2 p-2 rounded-xl border bg-[var(--bg-card)] border-[var(--border-color)]">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Enter card title..."
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddCard(col.id);
                      if (e.key === 'Escape') setInputCol(null);
                    }}
                    className="w-full text-xs p-1.5 rounded bg-transparent outline-none"
                    style={{ color: 'var(--text-primary)' }}
                  />
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => setInputCol(null)}
                      className="px-2 py-0.5 text-[10px] rounded hover:opacity-75"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddCard(col.id)}
                      className="px-2 py-0.5 text-[10px] font-bold rounded text-white"
                      style={{ background: 'var(--accent-gradient)' }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Cards list */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
                {colCards.map((card) => (
                  <div
                    key={card.id}
                    className="p-2 rounded-xl border shadow-2xs group flex flex-col gap-1 transition-all hover:scale-[1.01]"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-xs font-medium leading-snug">
                        {card.text}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCard(col.id, card.id)}
                        className="opacity-40 group-hover:opacity-100 hover:text-rose-500 transition-opacity p-1 cursor-pointer shrink-0"
                        title="Delete card"
                        aria-label="Delete card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-1 mt-1 pt-1 border-t border-[var(--border-color)]/50">
                      {card.tag && (
                        <span
                          className="px-1.5 py-0.2 rounded text-[9px] font-semibold"
                          style={{
                            backgroundColor: 'var(--accent-soft)',
                            color: 'var(--accent-text)',
                          }}
                        >
                          {card.tag}
                        </span>
                      )}

                      {/* Quick stage advance buttons */}
                      <div className="flex items-center gap-1 ml-auto">
                        {col.id !== 'todo' && (
                          <button
                            type="button"
                            onClick={() => handleMoveCard(card.id, col.id, col.id === 'done' ? 'progress' : 'todo')}
                            className="text-[9px] px-1 py-0.5 rounded border border-[var(--border-color)] opacity-70 hover:opacity-100"
                            title="Move back"
                          >
                            ←
                          </button>
                        )}
                        {col.id !== 'done' && (
                          <button
                            type="button"
                            onClick={() => handleMoveCard(card.id, col.id, col.id === 'todo' ? 'progress' : 'done')}
                            className="text-[9px] px-1 py-0.5 rounded border border-[var(--border-color)] opacity-70 hover:opacity-100"
                            title="Move forward"
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
