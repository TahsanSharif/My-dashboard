import React, { useState } from 'react';
import { BookOpen, Copy, Check, Sparkles, Heart } from 'lucide-react';
import { DuaItem } from '../types';

export const DUA_ITEMS: DuaItem[] = [
  {
    id: 1,
    title: 'KNOWLEDGE',
    subtitle: 'Seeking intellectual growth',
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    transliteration: 'Rabbi zidni ilma',
    meaning: '“My Lord, increase me in knowledge.”',
    reference: "Qur'an 20:114",
  },
  {
    id: 2,
    title: 'MAKE IT EASY',
    subtitle: 'Overcoming difficult subjects',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    transliteration: 'Rabbi ishrah li sadri, wa yassir li amri',
    meaning: '“My Lord, expand my chest and make my task easy.”',
    reference: "Qur'an 20:25–26",
  },
  {
    id: 3,
    title: 'PROTECTION',
    subtitle: 'Warding off distractions',
    arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    transliteration: "A'udhu billahi minash-shaytanir-rajim",
    meaning: '“I seek refuge in Allah from Satan, the accursed.”',
  },
  {
    id: 4,
    title: 'EASE',
    subtitle: 'Calmness under examination pressure',
    arabic: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا',
    transliteration: "Allahumma la sahla illa ma ja'altahu sahla",
    meaning: '“O Allah, there is no ease except what You make easy.”',
  },
  {
    id: 5,
    title: 'BEGIN',
    subtitle: 'Starting study with intention',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    meaning: '“In the name of Allah.”',
    note: "Start now. Don't wait to feel motivated.",
  },
];

export const DuaCards: React.FC = () => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (dua: DuaItem) => {
    const text = `${dua.title}\n${dua.arabic}\n${dua.transliteration}\n${dua.meaning}${
      dua.reference ? ` (${dua.reference})` : ''
    }${dua.note ? `\n— ${dua.note}` : ''}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(dua.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <section id="dua-cards-section" className="w-full my-8">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 mb-4 px-1">
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg border shadow-2xs"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <BookOpen className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h2
              className="text-sm font-extrabold tracking-wider uppercase"
              style={{ color: 'var(--text-primary)' }}
            >
              FOCUS & REFLECTION DUAS
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Spiritual grounding for discipline, patience, and clear intellect
            </p>
          </div>
        </div>
      </div>

      {/* 5 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {DUA_ITEMS.map((dua) => {
          const isCopied = copiedId === dua.id;

          return (
            <div
              key={dua.id}
              id={`dua-card-${dua.id}`}
              className="p-5 rounded-3xl border shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 relative group"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              {/* Card Top: Title, subtitle & Copy button */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border"
                      style={{
                        backgroundColor: 'var(--accent-soft)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--accent-text)',
                      }}
                    >
                      CARD {dua.id}
                    </span>
                    <h3
                      className="text-xs font-bold tracking-wider uppercase"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {dua.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(dua)}
                  className="p-1 rounded-lg border shadow-2xs opacity-60 hover:opacity-100 hover:scale-105 transition-all cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-card-subtle)',
                    borderColor: 'var(--border-color)',
                    color: isCopied ? '#10b981' : 'var(--text-secondary)',
                  }}
                  title="Copy Dua & Meaning"
                  aria-label="Copy dua text"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Arabic Calligraphy */}
              <div
                lang="ar"
                className="arabic-text dua-arabic-script my-3 text-right font-arabic-calligraphy text-2xl sm:text-3xl font-bold leading-loose select-text"
                style={{
                  direction: 'rtl',
                }}
              >
                {dua.arabic}
              </div>

              {/* Transliteration */}
              <div
                className="text-xs font-semibold italic mt-1"
                style={{ color: 'var(--accent-text)' }}
              >
                {dua.transliteration}
              </div>

              {/* English Meaning */}
              <div
                className="text-xs font-medium leading-relaxed mt-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                {dua.meaning}
              </div>

              {/* Reference / Motivational Note */}
              <div className="mt-4 pt-3 border-t flex items-center justify-between text-[11px]" style={{ borderColor: 'var(--border-color)' }}>
                {dua.reference ? (
                  <span
                    className="font-bold font-mono text-[10px] px-2 py-0.5 rounded border"
                    style={{
                      backgroundColor: 'var(--bg-card-subtle)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {dua.reference}
                  </span>
                ) : dua.note ? (
                  <span
                    className="font-bold text-[11px] tracking-tight"
                    style={{ color: 'var(--accent)' }}
                  >
                    {dua.note}
                  </span>
                ) : (
                  <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                    Recite with intention
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
