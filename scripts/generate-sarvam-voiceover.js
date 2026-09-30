import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import ffmpegPkg from '@ffmpeg-installer/ffmpeg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const ffmpeg = ffmpegPkg.path;

const SARVAM_API_KEY = 'sk_5egan3dv_m2eNGRgM7htKmgdDW87yoK1y';
const SARVAM_URL = 'https://api.sarvam.ai/text-to-speech';
const SPEAKER = 'aditya'; // High-quality Indian male voice
const MODEL = 'bulbul:v3';

const segments = [
  {
    id: 1,
    startSec: 1.0,
    text: "Welcome to Agentic Dating. We built an autonomous platform where real AI agents date on behalf of real people, based exclusively on their public LinkedIn and Instagram profiles."
  },
  {
    id: 2,
    startSec: 14.0,
    text: "Here is our cohort of twenty-five verified public figures. Each agent reads their person's career background and social posts to model their authentic personality."
  },
  {
    id: 3,
    startSec: 26.0,
    text: "Looking at Pieter Levels' profile, the agent extracted his core needs, hobbies, and interests. Each trait features collapsible evidence drawers citing exact quotes with confidence levels, alongside his voice profile and conversation starters."
  },
  {
    id: 4,
    startSec: 44.0,
    text: "In the Date Arena, Pieter Levels and Whitney Wolfe Herd go on a coffee chat date. Spoken dialogue is paired with private inner monologues, a dynamic chemistry meter, and a Neutral Judge assessment with full evidence citations."
  },
  {
    id: 5,
    startSec: 68.0,
    text: "Every person gets a ranked list from number one to twenty-four with sub-score breakdowns. We also built an interactive twenty-five by twenty-five compatibility heatmap matrix with transcript drawers."
  },
  {
    id: 6,
    startSec: 86.0,
    text: "Finally, the platform supports real-time ingestion. Paste any public LinkedIn and Instagram URL to synthesize a new agent with live terminal progress."
  }
];

async function generateSegmentAudio(seg) {
  console.log(`🎙️ Generating Sarvam AI voice for Segment ${seg.id}...`);
  const res = await fetch(SARVAM_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-subscription-key': SARVAM_API_KEY
    },
    body: JSON.stringify({
      inputs: [seg.text],
      target_language_code: 'en-IN',
      speaker: SPEAKER,
      pace: 1.0,
      model: MODEL
    })
  });

  const data = await res.json();
  if (!data.audios || data.audios.length === 0) {
    throw new Error(`Failed to generate audio for segment ${seg.id}: ` + JSON.stringify(data));
  }

  const outPath = path.join(rootDir, `sarvam_seg_${seg.id}.wav`);
  fs.writeFileSync(outPath, Buffer.from(data.audios[0], 'base64'));
  console.log(`✅ Saved ${outPath} (${data.audios[0].length} bytes)`);
  return outPath;
}

async function main() {
  console.log('🚀 Starting Sarvam AI Indian Male Voiceover Generation with Speaker: ' + SPEAKER);

  const audioFiles = [];
  for (const seg of segments) {
    const audioPath = await generateSegmentAudio(seg);
    audioFiles.push({ ...seg, audioPath });
  }

  console.log('🎬 Mixing audio with video using FFmpeg...');
  const inputVideo = path.join(rootDir, 'agentic-dating-demo.webm');

  // Build FFmpeg complex filter with adelay and amix
  const ffmpegArgs = ['-y', '-i', inputVideo];
  for (const s of audioFiles) {
    ffmpegArgs.push('-i', s.audioPath);
  }

  const filterChains = [];
  const mixInputs = [];
  audioFiles.forEach((s, idx) => {
    const inputIdx = idx + 1;
    const delayMs = Math.round(s.startSec * 1000);
    filterChains.push(`[${inputIdx}]adelay=${delayMs}|${delayMs},volume=3.5[a${idx}]`);
    mixInputs.push(`[a${idx}]`);
  });

  const fullFilter = `${filterChains.join(';')};${mixInputs.join('')}amix=inputs=${audioFiles.length}:dropout_transition=0[aout]`;

  ffmpegArgs.push(
    '-filter_complex', fullFilter,
    '-map', '0:v',
    '-map', '[aout]',
    '-c:v', 'copy',
    '-c:a', 'libopus',
    '-shortest',
    path.join(rootDir, 'agentic-dating-demo-sarvam.webm')
  );

  console.log('Running FFmpeg WebM merge...');
  execFileSync(ffmpeg, ffmpegArgs);
  console.log('✅ Generated agentic-dating-demo-sarvam.webm');

  // Convert to high-compatibility MP4
  console.log('Converting to universal MP4 format...');
  const mp4Args = [
    '-y',
    '-i', path.join(rootDir, 'agentic-dating-demo-sarvam.webm'),
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '128k',
    path.join(rootDir, 'agentic-dating-demo-sarvam.mp4')
  ];
  execFileSync(ffmpeg, mp4Args);
  console.log('✅ Generated agentic-dating-demo-sarvam.mp4');

  // Clean up temporary segment wavs
  for (const s of audioFiles) {
    try { fs.unlinkSync(s.audioPath); } catch (e) {}
  }

  console.log('\n🎉 ALL DONE! Your video with realistic Indian male voiceover is ready:');
  console.log('1. ' + path.join(rootDir, 'agentic-dating-demo-sarvam.mp4'));
  console.log('2. ' + path.join(rootDir, 'agentic-dating-demo-sarvam.webm'));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
