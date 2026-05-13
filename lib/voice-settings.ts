export interface VoiceInfo {
  id: string;
  name: string;
  displayName: string;
  description: string;
  gender: 'female' | 'male' | 'other';
  accent: string;
  age: string;
}

export interface VoicePrefs {
  voiceId: string | null;
  speed: number; // maps to AudioBufferSourceNode.playbackRate, default 1.0
}

export const DEFAULT_PREFS: VoicePrefs = { voiceId: null, speed: 1.0 };

export const SPEED_OPTIONS: { label: string; value: number }[] = [
  { label: '0.75×', value: 0.75 },
  { label: 'Normal', value: 1.0 },
  { label: '1.25×', value: 1.25 },
  { label: '1.5×', value: 1.5 },
];

const LS_KEY = 'babylala:voice-prefs';

export function loadVoicePrefs(): VoicePrefs {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

export function saveVoicePrefs(prefs: VoicePrefs): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LS_KEY, JSON.stringify(prefs));
}
