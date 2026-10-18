import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  ExternalLink,
  Music,
  Headphones,
  Trophy,
} from 'lucide-react';
import { GoatPreset } from '../types';
import {
  toggleUclAnthem,
  toggleUclAnthemMute,
  setUclAnthemVolume,
  subscribeUclAnthemState,
  getUclAnthemState,
} from '../utils/uclAnthem';
import { UclTrophyVector } from './UclTrophyVector';

interface MusicWidgetProps {
  containerWidth?: number;
  containerHeight?: number;
  isGoat?: boolean;
  goatPreset?: GoatPreset;
}

interface AudioTrack {
  id: string;
  title: string;
  genre: string;
  type: 'synth-lofi' | 'synth-rain' | 'synth-alpha' | 'synth-cafe';
  description: string;
  bpm: number;
}

const TRACKS: AudioTrack[] = [
  {
    id: 'lofi-beats',
    title: 'Midnight Lofi Chill',
    genre: 'Lofi Study Beats',
    type: 'synth-lofi',
    description: 'Smooth pentatonic Rhodes chords & gentle vinyl texture',
    bpm: 72,
  },
  {
    id: 'rain-focus',
    title: 'Rain on Library Window',
    genre: 'Ambient Soundscape',
    type: 'synth-rain',
    description: 'Soothing organic rain simulation with soft thunder',
    bpm: 0,
  },
  {
    id: 'alpha-waves',
    title: '432Hz Deep Focus Alpha',
    genre: 'Binaural Focus',
    type: 'synth-alpha',
    description: 'Calibrated harmonic sine drones for deep concentration',
    bpm: 60,
  },
  {
    id: 'cafe-vibes',
    title: 'Warm Campus Study Cafe',
    genre: 'Atmospheric Noise',
    type: 'synth-cafe',
    description: 'Soft rhythmic pink noise and cozy acoustic resonance',
    bpm: 80,
  },
];

export const MusicWidget: React.FC<MusicWidgetProps> = ({
  containerWidth = 400,
  isGoat = false,
  goatPreset = 'mr-champions-league',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.65);
  const [isMuted, setIsMuted] = useState(false);
  const [embedMode, setEmbedMode] = useState<'ambient' | 'spotify'>('ambient');
  const [anthemState, setAnthemState] = useState(getUclAnthemState);
  const [spotifyEmbedUrl, setSpotifyEmbedUrl] = useState(
    'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator'
  );

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Subscribe to real-time UCL Anthem state
  useEffect(() => {
    return subscribeUclAnthemState((state) => {
      setAnthemState(state);
    });
  }, []);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  const activeTrack = TRACKS[activeTrackIndex];

  // Stop synthesis on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(
        isMuted ? 0 : volume * 0.25,
        audioCtxRef.current.currentTime,
        0.05
      );
    }
  }, [volume, isMuted]);

  // Audio synthesis engine for zero-dependency ambient sound
  const startSynthesizer = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (!gainNodeRef.current) {
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.25, ctx.currentTime);
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;
      }

      const master = gainNodeRef.current;

      // Clean existing interval
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      if (activeTrack.type === 'synth-lofi') {
        // Lofi chords progression (Cmaj7 - Am7 - Dm7 - G7)
        const chordPitches = [
          [261.63, 329.63, 392.0, 493.88], // Cmaj7
          [220.0, 261.63, 329.63, 392.0],  // Am7
          [293.66, 349.23, 440.0, 523.25], // Dm7
          [196.0, 246.94, 293.66, 349.23], // G7
        ];
        let chordIndex = 0;

        const playChord = () => {
          if (!ctx || ctx.state === 'closed') return;
          const pitches = chordPitches[chordIndex % chordPitches.length];
          chordIndex++;

          pitches.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const noteGain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(900, ctx.currentTime);

            noteGain.gain.setValueAtTime(0.001, ctx.currentTime);
            noteGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.15);
            noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.2);

            osc.connect(filter);
            filter.connect(noteGain);
            noteGain.connect(master);

            osc.start();
            osc.stop(ctx.currentTime + 3.5);
          });
        };

        playChord();
        timerIntervalRef.current = window.setInterval(playChord, 3200);
      } else if (activeTrack.type === 'synth-alpha') {
        // 432 Hz + 442 Hz binaural drone
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const droneGain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(432, ctx.currentTime);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(442, ctx.currentTime); // 10Hz alpha difference

        droneGain.gain.setValueAtTime(0.001, ctx.currentTime);
        droneGain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 1.0);

        osc1.connect(droneGain);
        osc2.connect(droneGain);
        droneGain.connect(master);

        osc1.start();
        osc2.start();

        timerIntervalRef.current = window.setInterval(() => {
          // Keep active
        }, 10000);
      } else {
        // Gentle filtered rain/pink noise
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, ctx.currentTime);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.001, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.0);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(master);

        whiteNoise.start();
      }
    } catch (e) {
      console.warn('Audio synthesis initialized with error:', e);
    }
  };

  const stopSynthesizer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
      gainNodeRef.current = null;
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopSynthesizer();
      setIsPlaying(false);
    } else {
      startSynthesizer();
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (index: number) => {
    setActiveTrackIndex(index);
    if (isPlaying) {
      stopSynthesizer();
      setTimeout(() => {
        startSynthesizer();
      }, 50);
    }
  };

  const isCompact = containerWidth < 380;

  return (
    <div
      id="music-widget-container"
      className="flex-1 flex flex-col p-3 sm:p-4 justify-between h-full select-none overflow-y-auto"
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Pre-Match Tunnel Audio: UEFA Champions League Anthem Controls */}
      {isGoat && (
        <div
          id="ucl-anthem-player"
          className="p-3 rounded-2xl border mb-3 flex flex-col gap-2.5 shadow-md relative overflow-hidden transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(7, 87, 200, 0.3) 0%, rgba(6, 21, 46, 0.9) 60%, rgba(212, 175, 55, 0.2) 100%)',
            borderColor: anthemState.isPlaying && !anthemState.isMuted ? '#45B7FF' : 'rgba(69, 183, 255, 0.35)',
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <UclTrophyVector className="w-7 h-8 filter drop-shadow-[0_0_8px_rgba(69,183,255,0.7)]" />
                {anthemState.isPlaying && !anthemState.isMuted && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-black text-white font-mono tracking-tight flex items-center gap-1">
                    <span>UCL ANTHEM</span>
                    <span className="text-[10px] text-amber-300 font-bold">· TUNNEL AUDIO</span>
                  </h4>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-sky-400/40 text-sky-200 bg-sky-950/60">
                    EUROPEAN NIGHTS
                  </span>
                </div>
                <p className="text-[10px] text-sky-200/80 truncate font-mono">
                  {anthemState.isPlaying
                    ? anthemState.isMuted
                      ? 'Muted in Pre-Match Tunnel'
                      : 'Playing Live · Die Meister! Die Besten!'
                    : 'Pre-Match Anthem Paused'}
                </p>
              </div>
            </div>

            {/* Audio Toggle & Mute Control inside Pre-Match Tunnel Audio Widget */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                id="ucl-anthem-mute-btn"
                onClick={toggleUclAnthemMute}
                className="p-2 rounded-xl border text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                style={{
                  backgroundColor: anthemState.isMuted ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.12)',
                  borderColor: anthemState.isMuted ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 255, 255, 0.25)',
                  color: anthemState.isMuted ? '#FCA5A5' : '#FFFFFF',
                }}
                title={anthemState.isMuted ? 'Unmute UCL Anthem' : 'Mute UCL Anthem'}
                aria-label={anthemState.isMuted ? 'Unmute UCL Anthem' : 'Mute UCL Anthem'}
              >
                {anthemState.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                id="ucl-anthem-toggle-btn"
                onClick={toggleUclAnthem}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs text-white shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  background: anthemState.isPlaying
                    ? 'linear-gradient(135deg, #0757C8 0%, #0369A1 100%)'
                    : 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                  color: anthemState.isPlaying ? '#FFFFFF' : '#0B1528',
                }}
                title={anthemState.isPlaying ? 'Pause UCL Anthem' : 'Play UCL Anthem'}
              >
                {anthemState.isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>PAUSE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>PLAY</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Equalizer animation bars & Volume bar */}
          <div className="flex items-center justify-between gap-3 pt-1 border-t border-sky-400/20">
            <div className="flex items-center gap-1 h-3">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full bg-sky-400 transition-all ${
                    anthemState.isPlaying && !anthemState.isMuted ? 'animate-bounce' : 'h-1 opacity-40'
                  }`}
                  style={{
                    height: anthemState.isPlaying && !anthemState.isMuted ? `${8 + (i % 3) * 6}px` : '4px',
                    animationDuration: `${0.4 + (i % 4) * 0.15}s`,
                    animationDelay: `${i * 0.08}s`,
                  }}
                />
              ))}
              <span className="text-[10px] font-mono text-sky-300 ml-1.5 font-bold">
                {anthemState.isPlaying ? (anthemState.isMuted ? 'MUTED' : 'LIVE') : 'OFF'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-white/70">VOL</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={anthemState.volume}
                onChange={(e) => setUclAnthemVolume(parseFloat(e.target.value))}
                className="w-16 sm:w-20 h-1 accent-sky-400 bg-white/20 rounded-lg cursor-pointer"
                title="Anthem volume"
              />
            </div>
          </div>
        </div>
      )}
      {/* Mode Selector: Built-in Focus Waves vs. Spotify */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div
          id="music-mode-toggle"
          className="flex items-center p-0.5 rounded-xl border text-[11px] font-bold"
          style={{
            backgroundColor: 'var(--bg-card-subtle)',
            borderColor: 'var(--border-color)',
          }}
        >
          <button
            type="button"
            id="music-tab-focus-waves"
            onClick={() => {
              setEmbedMode('ambient');
              if (isPlaying) stopSynthesizer();
              setIsPlaying(false);
            }}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              embedMode === 'ambient' ? 'shadow-2xs text-white' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              background: embedMode === 'ambient' ? 'var(--accent-gradient)' : 'transparent',
              color: embedMode === 'ambient' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            🎧 Focus Waves
          </button>
          <button
            type="button"
            id="music-tab-spotify"
            onClick={() => {
              setEmbedMode('spotify');
              if (isPlaying) stopSynthesizer();
              setIsPlaying(false);
            }}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              embedMode === 'spotify' ? 'shadow-2xs text-white' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              background: embedMode === 'spotify' ? 'var(--accent-gradient)' : 'transparent',
              color: embedMode === 'spotify' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            🟢 Spotify Embed
          </button>
        </div>

        <span
          id="music-live-badge"
          className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border opacity-75"
          style={{
            borderColor: 'var(--border-color)',
            color: 'var(--accent)',
          }}
        >
          {isPlaying ? '● LIVE' : '○ IDLE'}
        </span>
      </div>

      {embedMode === 'ambient' ? (
        <>
          {/* Main Track Display */}
          <div
            className="p-3 rounded-2xl border mb-3 flex items-center justify-between gap-3 shadow-2xs"
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0 transition-transform ${
                  isPlaying ? 'scale-105 animate-pulse' : ''
                }`}
                style={{ background: 'var(--accent-gradient)' }}
              >
                <Headphones className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4
                  className="text-xs sm:text-sm font-black truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {activeTrack.title}
                </h4>
                <p
                  className="text-[11px] truncate opacity-75 font-medium"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {activeTrack.description}
                </p>
              </div>
            </div>

            {/* Play / Pause Primary Button */}
            <button
              type="button"
              onClick={handleTogglePlay}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer shrink-0"
              style={{ background: 'var(--accent-gradient)' }}
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>
          </div>

          {/* Soundscapes List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[140px] pr-1 mb-3">
            {TRACKS.map((t, idx) => {
              const isSelected = idx === activeTrackIndex;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectTrack(idx)}
                  className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    isSelected ? 'shadow-2xs ring-1 ring-amber-400/40' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'var(--bg-card)' : 'transparent',
                    borderColor: isSelected ? 'var(--accent)' : 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm">{idx === 0 ? '☕' : idx === 1 ? '🌧️' : idx === 2 ? '🧠' : '📚'}</span>
                    <span className="truncate" style={{ color: 'var(--text-primary)' }}>
                      {t.title}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-mono shrink-0 opacity-60 uppercase"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {t.genre}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Volume Control Bar */}
          <div
            className="pt-2 border-t flex items-center justify-between gap-3 text-xs"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center gap-2 flex-1">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-amber-500 bg-slate-200 dark:bg-slate-700"
                aria-label="Volume slider"
              />
              <span className="text-[10px] font-mono w-8 text-right opacity-70">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>
        </>
      ) : (
        /* Spotify Player Embed */
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex-1 w-full rounded-2xl overflow-hidden border shadow-inner mb-2">
            <iframe
              src={spotifyEmbedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Study Player"
              className="w-full h-full min-h-[160px] rounded-xl"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] opacity-75">
            <span>Official Spotify Web Player</span>
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:underline text-emerald-500 font-bold"
            >
              <span>Open Spotify</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
