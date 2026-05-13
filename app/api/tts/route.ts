import { NextRequest, NextResponse } from 'next/server';

const MODEL_ID = 'eleven_turbo_v2_5';

const PREFERRED_VOICE_NAMES = [
  'Aria', 'Sarah', 'Charlotte', 'Emily', 'Matilda',
  'Elli', 'Bella', 'Alice', 'Jessica', 'Freya',
  'Adam', 'Josh', 'Sam', 'Brian', 'George',
];

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category?: string;
}

// Promise-based mutex: concurrent callers share one fetch instead of each starting their own.
let voiceResolutionPromise: Promise<string | null> | null = null;

async function resolveVoiceId(apiKey: string): Promise<string | null> {
  // Env override takes absolute priority (bypass cache)
  if (process.env.ELEVENLABS_VOICE_ID) {
    return process.env.ELEVENLABS_VOICE_ID;
  }

  // All concurrent callers wait on the same promise → only one /v1/voices fetch
  if (!voiceResolutionPromise) {
    voiceResolutionPromise = fetchBestVoice(apiKey).catch((err) => {
      // Reset on failure so the next request retries
      voiceResolutionPromise = null;
      console.error('[TTS API] Voice resolution failed:', err);
      return null;
    });
  }
  return voiceResolutionPromise;
}

async function fetchBestVoice(apiKey: string): Promise<string | null> {
  console.log('[TTS API] Fetching available voices from ElevenLabs…');

  let voicesRes: Response;
  try {
    voicesRes = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': apiKey },
    });
  } catch (err) {
    console.error('[TTS API] /v1/voices network error:', err);
    return null;
  }

  if (!voicesRes.ok) {
    const body = await voicesRes.text().catch(() => '');
    console.error(`[TTS API] /v1/voices returned ${voicesRes.status}:`, body);
    return null;
  }

  let voices: ElevenLabsVoice[] = [];
  try {
    const data = await voicesRes.json();
    voices = Array.isArray(data.voices) ? data.voices : [];
    console.log(`[TTS API] Found ${voices.length} voices:`, voices.map((v) => `${v.name}(${v.category})`).join(', '));
  } catch (err) {
    console.error('[TTS API] Failed to parse /v1/voices response:', err);
    return null;
  }

  if (voices.length === 0) {
    console.error('[TTS API] No voices returned for this account.');
    return null;
  }

  // Pick by preferred name first
  for (const name of PREFERRED_VOICE_NAMES) {
    const match = voices.find((v) => v.name.toLowerCase() === name.toLowerCase());
    if (match) {
      console.log(`[TTS API] Selected voice: "${match.name}" (${match.voice_id})`);
      return match.voice_id;
    }
  }

  // Premade voices preferred over community/library
  const premade = voices.find((v) => v.category === 'premade');
  const picked = premade ?? voices[0];
  console.log(`[TTS API] Selected voice (fallback): "${picked.name}" (${picked.voice_id})`);
  return picked.voice_id;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('[TTS API] ELEVENLABS_API_KEY not set');
    return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 500 });
  }

  let text: string;
  let requestedVoiceId: string | undefined;
  try {
    const body = await req.json();
    text = (body.text ?? '').trim();
    requestedVoiceId = body.voiceId ?? undefined;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!text) return NextResponse.json({ error: 'text is required' }, { status: 400 });
  if (text.length > 500) return NextResponse.json({ error: 'text too long (max 500)' }, { status: 400 });

  // voiceId from request body (e.g. preview / user prefs) takes priority over auto-detection
  const voiceId = requestedVoiceId ?? (await resolveVoiceId(apiKey));
  if (!voiceId) {
    console.error('[TTS API] Could not resolve a usable voice ID — aborting TTS request');
    return NextResponse.json({ error: 'No usable ElevenLabs voice found' }, { status: 502 });
  }

  console.log(`[TTS API] speak("${text.slice(0, 60)}…") via voice ${voiceId}`);

  let elevenRes: Response;
  try {
    elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: MODEL_ID,
          voice_settings: { stability: 0.55, similarity_boost: 0.75, style: 0.15, use_speaker_boost: true },
        }),
      }
    );
  } catch (err) {
    console.error('[TTS API] Network error calling ElevenLabs TTS:', err);
    return NextResponse.json({ error: 'Failed to reach ElevenLabs' }, { status: 502 });
  }

  if (!elevenRes.ok) {
    const errText = await elevenRes.text().catch(() => '');
    console.error(`[TTS API] ElevenLabs TTS returned ${elevenRes.status}:`, errText);
    // Reset voice cache on auth/payment errors so next call retries voice detection
    if (elevenRes.status === 401 || elevenRes.status === 402 || elevenRes.status === 403) {
      // Reset promise cache so next request retries voice detection
      voiceResolutionPromise = null;
    }
    return NextResponse.json({ error: 'ElevenLabs TTS error', status: elevenRes.status }, { status: 502 });
  }

  const audio = await elevenRes.arrayBuffer();
  return new NextResponse(audio, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  });
}
