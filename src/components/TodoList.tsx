import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Trash2, Edit3, Check, X, ListTodo } from 'lucide-react';
import { TodoItem } from '../types';

interface TodoListProps {
  todos: TodoItem[];
  onAddTodo: (text: string) => void;
  onToggleTodo: (id: string) => void;
  onEditTodo: (id: string, newText: string) => void;
  onDeleteTodo: (id: string) => void;
  onClearCompleted: () => void;
  containerWidth?: number;
  containerHeight?: number;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onAddTodo,
  onToggleTodo,
  onEditTodo,
  onDeleteTodo,
  onClearCompleted,
  containerWidth,
  containerHeight,
}) => {
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onAddTodo(trimmed);
    setInputText('');
  };

  const startEditing = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const saveEdit = (id: string) => {
    const trimmed = editingText.trim();
    if (trimmed) {
      onEditTodo(id, trimmed);
    }
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const isCompact = containerWidth ? containerWidth < 400 : false;
  const taskListMaxHeight = containerHeight ? Math.max(140, containerHeight - (isCompact ? 220 : 250)) : 360;

  return (
    <div
      id="todo-list-card"
      className="w-full h-full relative overflow-y-auto overflow-x-hidden min-h-0 flex flex-col justify-start gap-2 transition-all duration-300"
      style={{
        color: 'var(--text-primary)',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: '8px',
        padding: isCompact ? '10px 12px' : '14px 16px',
      }}
    >
      <div className="shrink-0 flex flex-col gap-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div
              className="p-1.5 rounded-xl border shadow-2xs shrink-0"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-color)',
              }}
            >
              <ListTodo className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h3
                className="text-[10px] font-bold tracking-wider uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                DAILY LIFE PIVOT TO-DO
              </h3>
              <span
                id="todo-completion-fraction"
                className="text-xs sm:text-sm font-extrabold"
                style={{ color: 'var(--text-primary)' }}
              >
                {completedCount} / {totalCount} completed
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1">
            {(['all', 'active', 'completed'] as const).map((f) => {
              const label = isCompact
                ? f === 'all'
                  ? 'All'
                  : f === 'active'
                  ? 'Act.'
                  : 'Done'
                : f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded-lg border capitalize transition-all cursor-pointer ${
                    filter === f ? 'font-bold shadow-2xs' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: filter === f ? 'var(--accent-soft)' : 'transparent',
                    borderColor: filter === f ? 'var(--accent)' : 'var(--border-color)',
                    color: filter === f ? 'var(--accent-text)' : 'var(--text-secondary)',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center text-[11px] font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
            <span>Daily Completion</span>
            <span>{progressPercent}%</span>
          </div>
          <div
            className="w-full h-1.5 rounded-full overflow-hidden border"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
            }}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: 'var(--accent)',
              }}
            />
          </div>
        </div>

        {/* Add Task Input Form */}
        <form onSubmit={handleAddSubmit} className="flex gap-1.5 mb-3">
          <input
            id="new-todo-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isCompact ? 'Add study goal...' : 'Add Life Pivot goal (e.g. Physics — Chapter 4)...'}
            className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border transition-colors outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          />
          <button
            id="add-todo-btn"
            type="submit"
            disabled={!inputText.trim()}
            className="flex items-center gap-1 px-3 py-2 rounded-xl font-bold text-xs text-white shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer shrink-0"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <Plus className="w-4 h-4" />
            {!isCompact && <span>Add</span>}
          </button>
        </form>
      </div>

      {/* Tasks List with dynamic flex container height */}
      <div
        className="space-y-1.5 overflow-y-auto pr-1 flex-1 min-h-0 my-1"
      >
        {filteredTodos.length === 0 ? (
          <div
            className="py-8 text-center text-xs font-medium border border-dashed rounded-2xl"
            style={{
              borderColor: 'var(--border-color)',
              color: 'var(--text-muted)',
            }}
          >
            {filter === 'all'
              ? 'No tasks for today yet. Add your study milestones above!'
              : filter === 'active'
              ? 'All active tasks completed for today!'
              : 'No completed tasks yet.'}
          </div>
        ) : (
          filteredTodos.map((todo) => {
            const isEditing = editingId === todo.id;

            const isMustWin = todo.text.includes('!') || /urgent|must-win|priority|match/i.test(todo.text);

            return (
              <div
                key={todo.id}
                id={`todo-item-${todo.id}`}
                data-todo-row="true"
                data-todo-completed={todo.completed ? 'true' : 'false'}
                data-todo-priority={isMustWin ? 'high' : undefined}
                data-todo-must-win={isMustWin ? 'true' : undefined}
                className="group flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all hover:border-[var(--border-highlight)]"
                style={{
                  backgroundColor: todo.completed ? 'var(--bg-card-subtle)' : 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                }}
              >
                {/* Checkbox and Text */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={(e) => {
                      if (!todo.completed) {
                        window.dispatchEvent(
                          new CustomEvent('goat-mission-completed', {
                            detail: { id: todo.id, x: e.clientX, y: e.clientY },
                          })
                        );
                      }
                      onToggleTodo(todo.id);
                    }}
                    className="shrink-0 transition-transform active:scale-90 cursor-pointer"
                    style={{ color: todo.completed ? 'var(--accent)' : 'var(--text-muted)' }}
                    aria-label={todo.completed ? 'Mark uncomplete' : 'Mark complete'}
                  >
                    {todo.completed ? (
                      <CheckSquare className="w-5 h-5 fill-current/10" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>

                  {isEditing ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(todo.id);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        autoFocus
                        className="flex-1 px-2.5 py-1 text-sm rounded-lg border outline-none"
                        style={{
                          backgroundColor: 'var(--bg-card)',
                          borderColor: 'var(--accent)',
                          color: 'var(--text-primary)',
                        }}
                      />
                      <button
                        onClick={() => saveEdit(todo.id)}
                        className="p-1 rounded-md text-emerald-600 hover:bg-emerald-500/10 cursor-pointer"
                        title="Save edit"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1 rounded-md text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                        title="Cancel edit"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span
                      onClick={(e) => {
                        if (!todo.completed) {
                          window.dispatchEvent(
                            new CustomEvent('goat-mission-completed', {
                              detail: { id: todo.id, x: e.clientX, y: e.clientY },
                            })
                          );
                        }
                        onToggleTodo(todo.id);
                      }}
                      className={`text-xs sm:text-sm font-medium select-none break-words min-w-0 cursor-pointer transition-all leading-snug ${
                        todo.completed
                          ? 'line-through opacity-50'
                          : 'opacity-95'
                      }`}
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {todo.text}
                    </span>
                  )}
                </div>

                {/* Actions: Edit & Delete + #7 WIN badge with clean flex spacing */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {todo.completed && (
                    <span
                      className="mission-win-badge completed-task-badge badge-number-7 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider border shadow-2xs select-none"
                      style={{
                        backgroundColor: 'rgba(213, 180, 106, 0.15)',
                        borderColor: 'rgba(213, 180, 106, 0.4)',
                        color: 'var(--gold-trophy, #D5B46A)',
                      }}
                      title="SIUUU - Mission Completed"
                    >
                      <span className="sr-only">SIUUU</span>
                    </span>
                  )}

                  {!isEditing && (
                    <div className="mission-item-actions flex items-center opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditing(todo)}
                        className="p-2 rounded-xl border shadow-2xs hover:scale-105 cursor-pointer"
                        style={{
                          backgroundColor: 'var(--bg-card-subtle)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-secondary)',
                        }}
                        title="Edit task"
                        aria-label="Edit task"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTodo(todo.id)}
                        className="p-2 rounded-xl border shadow-2xs hover:scale-105 text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                        style={{
                          backgroundColor: 'var(--bg-card-subtle)',
                          borderColor: 'var(--border-color)',
                        }}
                        title="Delete task"
                        aria-label="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Clear Completed */}
      {completedCount > 0 && (
        <div className="shrink-0 mt-1 pt-2 border-t flex justify-end" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={onClearCompleted}
            className="text-xs font-semibold opacity-70 hover:opacity-100 hover:underline cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            Clear {completedCount} completed task{completedCount > 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
};
