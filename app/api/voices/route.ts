import { NextResponse } from 'next/server';
import type { VoiceInfo } from '@/lib/voice-settings';

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category?: string;
  labels?: Record<string, string>;
}

function inferGender(
  name: string,
  labels?: Record<string, string>
): VoiceInfo['gender'] {
  const g = labels?.gender?.toLowerCase();
  if (g === 'female') return 'female';
  if (g === 'male') return 'male';

  // Best-effort from common first names when labels missing
  const firstName = name.split(/[\s\-–]/)[0].toLowerCase();
  const femaleNames = /^(sarah|laura|alice|matilda|jessica|bella|lily|emily|grace|charlotte|aria|freya|elli|river|victoria|clara)/;
  const maleNames = /^(roger|charlie|george|callum|harry|liam|will|eric|chris|brian|daniel|adam|bill|josh|sam|ethan|james|michael|ryan|paul)/;
  if (femaleNames.test(firstName)) return 'female';
  if (maleNames.test(firstName)) return 'male';
  return 'other';
}

export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  let res: Response;
  try {
    res = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': apiKey },
    });
  } catch (err) {
    console.error('[Voices API] Network error:', err);
    return NextResponse.json({ error: 'Network error' }, { status: 502 });
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error(`[Voices API] ElevenLabs returned ${res.status}:`, body);
    return NextResponse.json({ error: 'ElevenLabs error' }, { status: 502 });
  }

  const data = await res.json();
  const voices: VoiceInfo[] = ((data.voices ?? []) as ElevenLabsVoice[])
    .filter((v) => v.category === 'premade')
    .map((v) => {
      const dashIdx = v.name.indexOf(' - ');
      const displayName = dashIdx >= 0 ? v.name.slice(0, dashIdx).trim() : v.name;
      return {
        id: v.voice_id,
        name: v.name,
        displayName,
        description: v.labels?.description ?? '',
        gender: inferGender(v.name, v.labels),
        accent: v.labels?.accent ?? '',
        age: v.labels?.age ?? '',
      };
    });

  return NextResponse.json({ voices });
}
