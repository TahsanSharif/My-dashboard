/**
 * Synthesizes a soothing bell / chime using the browser's Web Audio API.
 * Avoids any external file downloads or 404 errors.
 */
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playTimerCompletionSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Harmonic frequencies for a calming meditation chime (E5, B5, G#6)
    const tones = [659.25, 987.77, 1318.51];

    tones.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      // Attack and gentle decay
      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.2 / (i + 1), now + i * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 1.9);
    });
  } catch (err) {
    console.warn('Audio playback not permitted or failed:', err);
  }
}

export function playClickSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch {
    // silently ignore click sound failure
  }
}

/**
 * Synthesizes an authentic dual-tone referee pea-whistle blast for football match kicks/breaks.
 */
export function playRefereeWhistleSound(shortBurst = false): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = shortBurst ? 0.28 : 0.65;

    // Dual resonant whistle frequencies (2550Hz and 2890Hz) with pea oscillation
    const freqs = [2550, 2890];

    // LFO for pea-whistle trill flutter (32Hz)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(32, now);
    lfoGain.gain.setValueAtTime(95, now);
    lfo.connect(lfoGain);

    freqs.forEach((baseFreq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      lfoGain.connect(osc.frequency);

      // Whistle attack, sustain burst, and sudden choke cutoff
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gain.gain.setValueAtTime(0.18, now + duration - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    });

    lfo.start(now);
    lfo.stop(now + duration + 0.02);
  } catch (err) {
    console.warn('Whistle audio failed:', err);
  }
}

/**
 * Synthesizes an iconic stadium crowd crescendo & celebratory gold fanfare for the SIUUU celebration.
 */
export function playSiuuuRoarSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Stadium crowd surge (white noise filtered through bandpass)
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(1100, now + 0.7);
    filter.frequency.exponentialRampToValueAtTime(350, now + 2.2);
    filter.Q.value = 1.8;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.22, now + 0.45);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 2.2);

    // 2. Triumphant Brass Chords (Trophy Gold fanfare)
    const fanFreqs = [261.63, 329.63, 392.0, 523.25]; // C major triumph
    fanFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + 0.1);

      // Lowpass for warm stadium horn timbre
      const hornFilter = ctx.createBiquadFilter();
      hornFilter.type = 'lowpass';
      hornFilter.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(0, now + 0.1);
      gain.gain.linearRampToValueAtTime(0.08 / (idx + 1), now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

      osc.connect(hornFilter);
      hornFilter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + 0.1);
      osc.stop(now + 2.1);
    });
  } catch (err) {
    console.warn('SIUUU audio failed:', err);
  }
}

