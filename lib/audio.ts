// ---------------------------------------------------------------------------
// AudioContext — sound effects
// ---------------------------------------------------------------------------

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    )();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

export function initAudio(): void {
  if (typeof window === 'undefined') return;
  try {
    getAudioContext();
  } catch (e) {
    console.warn('Audio context init failed:', e);
  }
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine'): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') { resolve(); return; }
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
      setTimeout(resolve, duration * 1000);
    } catch (e) {
      console.warn('Tone playback failed:', e);
      resolve();
    }
  });
}

async function playCorrectSound(): Promise<void> {
  await playTone(523.25, 0.1, 'sine');
  await playTone(659.25, 0.1, 'sine');
  await playTone(783.99, 0.2, 'sine');
}

async function playIncorrectSound(): Promise<void> {
  await playTone(200, 0.3, 'sawtooth');
}

async function playCelebrationSound(): Promise<void> {
  const ctx = getAudioContext();
  for (const freq of [523.25, 659.25, 783.99, 1046.5]) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
    await new Promise((r) => setTimeout(r, 80));
  }
  for (const freq of [523.25, 659.25, 783.99]) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  }
  await new Promise((r) => setTimeout(r, 500));
}

async function playClickSound(): Promise<void> { await playTone(800, 0.05, 'sine'); }
async function playUnlockSound(): Promise<void> {
  await playTone(440, 0.1, 'sine');
  await playTone(554, 0.1, 'sine');
  await playTone(659, 0.2, 'sine');
}
async function playStarSound(): Promise<void> {
  await playTone(880, 0.15, 'sine');
  await playTone(1174, 0.2, 'sine');
}

// ---------------------------------------------------------------------------
// ElevenLabs TTS — primary
// ---------------------------------------------------------------------------

/** Client-side AudioBuffer cache — eliminates repeated /api/tts calls. */
const ttsCache = new Map<string, AudioBuffer>();

/** Currently playing source node — kept so stopSpeaking() can stop it. */
let activeSource: AudioBufferSourceNode | null = null;

/** AbortController for the in-flight /api/tts fetch. */
let activeFetchController: AbortController | null = null;

/** Play a decoded AudioBuffer through the shared AudioContext. */
function playAudioBuffer(buffer: AudioBuffer): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const ctx = getAudioContext();
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      activeSource = source;
      source.onended = () => {
        activeSource = null;
        resolve();
      };
      source.start();
    } catch (err) {
      activeSource = null;
      reject(err);
    }
  });
}

/**
 * Fetch audio from /api/tts, decode, cache, then play.
 * Throws on failure so the caller can fall back to Web Speech.
 * Respects cancellation via AbortController.
 */
async function speakElevenLabs(text: string): Promise<void> {
  // Serve from cache — no network needed
  const cached = ttsCache.get(text);
  if (cached) {
    await playAudioBuffer(cached);
    return;
  }

  // Start a cancellable fetch
  const controller = new AbortController();
  activeFetchController = controller;

  let res: Response;
  try {
    res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
  } catch (err) {
    activeFetchController = null;
    if (err instanceof Error && err.name === 'AbortError') return; // cancelled cleanly
    throw err;
  }
  activeFetchController = null;

  if (!res.ok) throw new Error(`/api/tts responded ${res.status}`);

  const arrayBuffer = await res.arrayBuffer();
  const ctx = getAudioContext();
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

  ttsCache.set(text, audioBuffer);
  await playAudioBuffer(audioBuffer);
}

// ---------------------------------------------------------------------------
// Web Speech API — fallback
// ---------------------------------------------------------------------------

let cachedVoices: SpeechSynthesisVoice[] = [];

function pickVoice(): SpeechSynthesisVoice | undefined {
  if (typeof window === 'undefined' || !window.speechSynthesis) return undefined;
  const fresh = window.speechSynthesis.getVoices();
  if (fresh.length > 0) cachedVoices = fresh;
  const voices = cachedVoices.length > 0 ? cachedVoices : fresh;
  return (
    voices.find((v) => v.name === 'Samantha') ||
    voices.find((v) => v.name === 'Karen') ||
    voices.find((v) => v.name.includes('Google US English')) ||
    voices.find((v) => v.lang === 'en-US') ||
    voices.find((v) => v.lang.startsWith('en')) ||
    voices[0]
  );
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  const seed = window.speechSynthesis.getVoices();
  if (seed.length > 0) {
    cachedVoices = seed;
  } else {
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      cachedVoices = window.speechSynthesis.getVoices();
    });
  }
}

/**
 * Web Speech fallback — always resolves (never hangs), handles Chrome bugs:
 * - cancel → speak race: 50 ms delay
 * - idle-pause: resume() before speak
 * - onend-never-fires: safety timeout
 */
function speakWebSpeech(text: string, rate = 0.9, pitch = 1.1): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) { resolve(); return; }

    window.speechSynthesis.cancel();

    const safetyMs = Math.max(3000, text.length * 90);
    let settled = false;
    // eslint-disable-next-line prefer-const
    let safetyTimer: ReturnType<typeof setTimeout>;

    const settle = () => {
      if (settled) return;
      settled = true;
      clearTimeout(safetyTimer);
      resolve();
    };

    safetyTimer = setTimeout(settle, safetyMs);

    // 50 ms gap: Chrome needs time to flush cancel before accepting new speak()
    setTimeout(() => {
      if (settled) return;
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = 'en-US';

      const voice = pickVoice();
      if (voice) utterance.voice = voice;

      utterance.onend = settle;
      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('[TTS fallback] Error:', e.error, '|', text);
        }
        settle();
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('[TTS fallback] speak() threw:', err);
        settle();
      }
    }, 50);
  });
}

// ---------------------------------------------------------------------------
// Public speak() — ElevenLabs → Web Speech fallback
// ---------------------------------------------------------------------------

/**
 * In-flight deduplication: if speak("same text") is called concurrently
 * (e.g. React StrictMode double-invoking useEffect in dev), all callers
 * share one request instead of each triggering a separate API call + playback.
 */
const inFlight = new Map<string, Promise<void>>();

/**
 * Speak `text` using ElevenLabs (high quality) with an automatic fallback
 * to the browser's Web Speech API if ElevenLabs is unreachable or errors.
 */
export function speak(text: string): Promise<void> {
  const key = text.trim();
  if (!key) return Promise.resolve();

  // Return the existing promise if the same text is already being spoken
  const existing = inFlight.get(key);
  if (existing) return existing;

  const promise = (async () => {
    initAudio();
    try {
      await speakElevenLabs(key);
    } catch (err) {
      console.warn('[TTS] ElevenLabs unavailable, falling back to Web Speech:', err);
      await speakWebSpeech(key);
    }
  })().finally(() => {
    inFlight.delete(key);
  });

  inFlight.set(key, promise);
  return promise;
}

/**
 * Cancel all in-flight and currently-playing speech:
 * - Aborts any pending /api/tts HTTP request
 * - Stops any playing AudioBufferSourceNode
 * - Clears the in-flight deduplication map
 * - Cancels Web Speech API fallback
 */
export function stopSpeaking(): void {
  // Abort in-flight ElevenLabs fetch
  if (activeFetchController) {
    activeFetchController.abort();
    activeFetchController = null;
  }

  // Stop playing audio immediately
  if (activeSource) {
    try { activeSource.stop(); } catch { /* already stopped */ }
    activeSource = null;
  }

  // Clear deduplication map so the next speak() call is treated as fresh
  inFlight.clear();

  // Cancel Web Speech API fallback
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// ---------------------------------------------------------------------------
// Sound effects
// ---------------------------------------------------------------------------

export type SoundType = 'correct' | 'incorrect' | 'celebration' | 'click' | 'unlock' | 'star';

const soundGenerators: Record<SoundType, () => Promise<void>> = {
  correct: playCorrectSound,
  incorrect: playIncorrectSound,
  celebration: playCelebrationSound,
  click: playClickSound,
  unlock: playUnlockSound,
  star: playStarSound,
};

export async function playEffect(type: SoundType): Promise<void> {
  try {
    initAudio();
    await soundGenerators[type]();
  } catch (error) {
    console.warn(`Failed to play sound: ${type}`, error);
  }
}

// ---------------------------------------------------------------------------
// Legacy
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function playSound(_soundUrl: string): Promise<void> {
  return Promise.resolve();
}
