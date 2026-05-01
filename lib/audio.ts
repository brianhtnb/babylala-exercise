let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

// Initialize audio context on first user interaction
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
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

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
  await playTone(523.25, 0.1, 'sine'); // C5
  await playTone(659.25, 0.1, 'sine'); // E5
  await playTone(783.99, 0.2, 'sine'); // G5
}

async function playIncorrectSound(): Promise<void> {
  await playTone(200, 0.3, 'sawtooth');
}

async function playCelebrationSound(): Promise<void> {
  const ctx = getAudioContext();
  
  // Arpeggio up
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  for (const freq of notes) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
    
    await new Promise(resolve => setTimeout(resolve, 80));
  }
  
  // Final chord
  const chordFreqs = [523.25, 659.25, 783.99];
  chordFreqs.forEach(freq => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
}

async function playClickSound(): Promise<void> {
  await playTone(800, 0.05, 'sine');
}

async function playUnlockSound(): Promise<void> {
  await playTone(440, 0.1, 'sine');
  await playTone(554, 0.1, 'sine');
  await playTone(659, 0.2, 'sine');
}

async function playStarSound(): Promise<void> {
  await playTone(880, 0.15, 'sine');
  await playTone(1174, 0.2, 'sine');
}

let speechUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string, rate: number = 0.9, pitch: number = 1.1): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }

    // Cancel any ongoing speech
    if (speechUtterance) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = 'en-US';

    // Try to find a friendly voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.name.includes('Samantha') || v.name.includes('Karen') || v.lang === 'en-US'
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      speechUtterance = null;
      resolve();
    };

    utterance.onerror = () => {
      speechUtterance = null;
      resolve();
    };

    speechUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    speechUtterance = null;
  }
}

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

// Legacy support for direct playSound calls
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function playSound(soundUrl: string): Promise<void> {
  return new Promise((resolve) => {
    console.warn('playSound with URL is deprecated, use playEffect instead');
    resolve();
  });
}
