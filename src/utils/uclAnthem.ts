/**
 * UEFA Champions League Anthem Audio Controller
 * Binds directly to the user-provided custom audio file: /assets/audio/user-ucl-anthem.mp3
 * Handles auto-trigger on theme entry, browser autoplay unlock, volume, and mute toggles.
 * Incorporates cache-busting to ensure newly uploaded audio tracks invalidate browser disk caching.
 */

type AnthemStateListener = (state: {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
}) => void;

export const UCL_ANTHEM_BASE_PATH = '/assets/audio/user-ucl-anthem.mp3';
export const UCL_ANTHEM_ALT_PATH = '/assets/audio/user-ucl-anthem.mp3.mp3';

// Cache-busting query parameter strategy to prevent stale browser media caching
export function getUclAnthemUrl(bustCache = false): string {
  const cacheKey = bustCache ? Date.now() : '20261017-ucl';
  return `${UCL_ANTHEM_BASE_PATH}?v=${cacheKey}`;
}

let audioElement: HTMLAudioElement | null = null;
let isPlaying = false;
let isMuted = false;
let anthemVolume = 0.75;
let pendingUnlock = false;
const listeners = new Set<AnthemStateListener>();

function notifyListeners() {
  const state = { isPlaying, isMuted, volume: anthemVolume };
  listeners.forEach((fn) => {
    try {
      fn(state);
    } catch {}
  });
}

export function subscribeUclAnthemState(listener: AnthemStateListener): () => void {
  listeners.add(listener);
  listener({ isPlaying, isMuted, volume: anthemVolume });
  return () => {
    listeners.delete(listener);
  };
}

export function getUclAnthemState() {
  return { isPlaying, isMuted, volume: anthemVolume };
}

function getAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;

  if (!audioElement) {
    audioElement = new Audio(getUclAnthemUrl(true));
    audioElement.loop = true;
    audioElement.preload = 'auto';
    audioElement.volume = isMuted ? 0 : anthemVolume;

    audioElement.addEventListener('play', () => {
      isPlaying = true;
      notifyListeners();
    });

    audioElement.addEventListener('pause', () => {
      isPlaying = false;
      notifyListeners();
    });

    audioElement.addEventListener('ended', () => {
      // Loop is true by default, but if loop terminates or resets
      isPlaying = false;
      notifyListeners();
    });

    audioElement.addEventListener('error', (e) => {
      console.warn('UCL Anthem audio load notice:', e);
      if (audioElement) {
        // Fallback: try alternate path or raw path without query string
        if (!audioElement.src.includes('user-ucl-anthem.mp3.mp3')) {
          audioElement.src = `${UCL_ANTHEM_ALT_PATH}?v=${Date.now()}`;
          audioElement.load();
          if (isPlaying) {
            audioElement.play().catch(() => {});
          }
        } else if (audioElement.src.includes('?')) {
          audioElement.src = UCL_ANTHEM_BASE_PATH;
          audioElement.load();
          if (isPlaying) {
            audioElement.play().catch(() => {});
          }
        }
      }
    });
  }

  return audioElement;
}

function setupUserInteractionUnlock() {
  if (pendingUnlock || typeof window === 'undefined') return;
  pendingUnlock = true;

  const unlock = () => {
    const audio = getAudio();
    if (audio && isPlaying && audio.paused) {
      audio.play().catch(() => {});
    }
    window.removeEventListener('click', unlock);
    window.removeEventListener('keydown', unlock);
    window.removeEventListener('touchstart', unlock);
    pendingUnlock = false;
  };

  window.addEventListener('click', unlock, { once: true, passive: true });
  window.addEventListener('keydown', unlock, { once: true, passive: true });
  window.addEventListener('touchstart', unlock, { once: true, passive: true });
}

/**
 * Triggers UCL Anthem playback from /assets/audio/user-ucl-anthem.mp3
 */
export function playUclAnthem() {
  const audio = getAudio();
  if (!audio) return;

  isPlaying = true;
  audio.volume = isMuted ? 0 : anthemVolume;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        isPlaying = true;
        notifyListeners();
      })
      .catch((err) => {
        // Autoplay prevented by browser: wait for user interaction to resume
        console.info('UCL anthem autoplay pending user gesture:', err.message);
        isPlaying = true; // Mark as intended playing state
        notifyListeners();
        setupUserInteractionUnlock();
      });
  }
}

export function stopUclAnthem() {
  isPlaying = false;
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
  notifyListeners();
}

export function pauseUclAnthem() {
  isPlaying = false;
  if (audioElement) {
    audioElement.pause();
  }
  notifyListeners();
}

export function toggleUclAnthem() {
  const audio = getAudio();
  if (!audio) return;

  if (isPlaying && !audio.paused) {
    pauseUclAnthem();
  } else {
    playUclAnthem();
  }
}

export function setUclAnthemMuted(muted: boolean) {
  isMuted = muted;
  const audio = getAudio();
  if (audio) {
    audio.volume = isMuted ? 0 : anthemVolume;
  }
  notifyListeners();
}

export function toggleUclAnthemMute() {
  setUclAnthemMuted(!isMuted);
}

export function setUclAnthemVolume(volume: number) {
  anthemVolume = Math.max(0, Math.min(1, volume));
  const audio = getAudio();
  if (audio && !isMuted) {
    audio.volume = anthemVolume;
  }
  notifyListeners();
}

/**
 * Force-reloads the UCL anthem audio element with a cache-busted URL
 */
export function reloadUclAnthem(forceBust = true) {
  if (audioElement) {
    const wasPlaying = isPlaying;
    audioElement.pause();
    audioElement.src = getUclAnthemUrl(forceBust);
    audioElement.load();
    if (wasPlaying) {
      audioElement.play().catch(() => {});
    }
  }
}
