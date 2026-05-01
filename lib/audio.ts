let currentAudio: HTMLAudioElement | null = null;

export function playSound(soundUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(soundUrl);
    currentAudio = audio;

    audio.addEventListener('ended', () => {
      currentAudio = null;
      resolve();
    });

    audio.addEventListener('error', () => {
      currentAudio = null;
      reject(new Error('Failed to play sound'));
    });

    audio.play().catch((error) => {
      currentAudio = null;
      reject(error);
    });
  });
}

let speechUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string, rate: number = 0.9, pitch: number = 1.1): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }

    if (speechUtterance) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = 'en-US';

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

export const Sounds = {
  correct: '/sounds/correct.mp3',
  incorrect: '/sounds/incorrect.mp3',
  celebration: '/sounds/celebration.mp3',
  click: '/sounds/click.mp3',
  unlock: '/sounds/unlock.mp3',
  star: '/sounds/star.mp3',
} as const;

export type SoundType = keyof typeof Sounds;

export async function playEffect(type: SoundType): Promise<void> {
  try {
    await playSound(Sounds[type]);
  } catch (error) {
    console.warn(`Failed to play sound: ${type}`, error);
  }
}
