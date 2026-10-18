import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Copy, Check, Pin, Tag, BookOpen } from 'lucide-react';

interface NotesWidgetProps {
  containerWidth?: number;
  containerHeight?: number;
}

interface NoteItem {
  id: string;
  text: string;
  tag: 'Physics' | 'Chemistry' | 'Math' | 'Biology' | 'General';
  isPinned?: boolean;
  createdAt: number;
}

const DEFAULT_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    text: 'Carnot Efficiency: η = 1 - (T_c / T_h). Temperatures must always be in Kelvin (K)!',
    tag: 'Physics',
    isPinned: true,
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'note-2',
    text: 'pH Calculation: pH = -log10[H+]. Buffer Henderson-Hasselbalch: pH = pKa + log([A-]/[HA])',
    tag: 'Chemistry',
    isPinned: false,
    createdAt: Date.now() - 7200000,
  },
];

export const NotesWidget: React.FC<NotesWidgetProps> = () => {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const raw = localStorage.getItem('admission_study_notes');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_NOTES;
  });

  const [inputNote, setInputNote] = useState('');
  const [selectedTag, setSelectedTag] = useState<'Physics' | 'Chemistry' | 'Math' | 'Biology' | 'General'>('Physics');
  const [filterTag, setFilterTag] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('admission_study_notes', JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNote.trim()) return;

    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      text: inputNote.trim(),
      tag: selectedTag,
      createdAt: Date.now(),
    };

    setNotes([newNote, ...notes]);
    setInputNote('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const handleTogglePin = (id: string) => {
    setNotes(
      notes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filteredNotes = notes
    .filter((n) => filterTag === 'All' || n.tag === filterTag)
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.createdAt - a.createdAt;
    });

  const tagColors: Record<string, string> = {
    Physics: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    Chemistry: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    Math: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    Biology: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    General: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  };

  return (
    <div
      className="w-full h-full flex-1 flex flex-col p-3 sm:p-4 justify-between select-none overflow-hidden"
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Quick Input Bar */}
      <form onSubmit={handleAddNote} className="space-y-2 mb-3">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={inputNote}
            onChange={(e) => setInputNote(e.target.value)}
            placeholder="Quick note, key formula, or shortcut..."
            className="flex-1 px-3 py-2 text-xs rounded-xl border outline-none transition-all shadow-2xs font-medium"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          />
          <button
            type="submit"
            disabled={!inputNote.trim()}
            className="px-3 py-2 rounded-xl text-xs font-bold text-white shadow-2xs transition-all hover:scale-105 active:scale-95 disabled:opacity-40 cursor-pointer shrink-0"
            style={{ background: 'var(--accent-gradient)' }}
            title="Add formula/note"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Tag Selector & Filter */}
        <div className="flex items-center justify-between gap-1 flex-wrap text-[10px]">
          <div className="flex items-center gap-1">
            <span className="opacity-60 font-semibold">Subject:</span>
            {(['Physics', 'Chemistry', 'Math', 'General'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTag(t)}
                className={`px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                  selectedTag === t ? 'font-black border-amber-500 text-amber-500' : 'opacity-60'
                }`}
                style={{ borderColor: selectedTag === t ? undefined : 'var(--border-color)' }}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 opacity-75">
            <span className="font-mono">{filteredNotes.length} notes</span>
          </div>
        </div>
      </form>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
        {filteredNotes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 opacity-50">
            <BookOpen className="w-8 h-8 mb-2" />
            <p className="text-xs font-medium">No formulas saved yet.</p>
            <p className="text-[10px]">Write equations, mnemonics, or revision points.</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-2.5 rounded-xl border flex flex-col gap-1.5 transition-all group shadow-2xs"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: note.isPinned ? 'var(--accent)' : 'var(--border-color)',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${
                    tagColors[note.tag] || tagColors.General
                  }`}
                >
                  {note.tag}
                </span>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleTogglePin(note.id)}
                    className={`p-1 rounded hover:bg-slate-500/10 cursor-pointer ${
                      note.isPinned ? 'text-amber-500' : 'text-slate-400'
                    }`}
                    title={note.isPinned ? 'Unpin note' : 'Pin note'}
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(note.id, note.text)}
                    className="p-1 rounded hover:bg-slate-500/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title="Copy note"
                  >
                    {copiedId === note.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1 rounded hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 cursor-pointer"
                    title="Delete note"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <p
                className="text-xs font-medium leading-relaxed select-text"
                style={{ color: 'var(--text-primary)' }}
              >
                {note.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
