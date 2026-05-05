const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { hasEnv } = require('../config/env');

function normalizeTtsProvider(raw) {
  const value = String(raw || '').trim().toLowerCase();
  if (!value || value === 'auto') return null;
  if (value === 'chatterbox' || value === 'chatterbox_vc') return 'chatterbox-vc';
  if (value === 'openai-tts') return 'openai';
  if (value === 'fish') return 'fish';
  return value;
}

function hasConfiguredTtsProvider(provider) {
  switch (normalizeTtsProvider(provider)) {
    case 'chatterbox-vc':
      return true;
    case 'local-piper':
      return true;
    case 'elevenlabs':
      return hasEnv('ELEVENLABS_API_KEY');
    case 'minimax':
      return hasEnv('MINIMAX_API_KEY') && hasEnv('MINIMAX_GROUP_ID');
    case 'openai':
      return false;
    case 'fish':
      return hasEnv('FISH_AUDIO_API_KEY');
    default:
      return false;
  }
}

function hasAnyTtsProvider() {
  return ['chatterbox-vc', 'fish', 'elevenlabs', 'minimax'].some((provider) => hasConfiguredTtsProvider(provider));
}

function canProduceNarration(ttsProvider) {
  const selectedProvider = normalizeTtsProvider(ttsProvider);
  return selectedProvider ? hasConfiguredTtsProvider(selectedProvider) : hasAnyTtsProvider();
}

function isAudioEffectivelySilent(audioPath) {
  try {
    const stderr = execFileSync('ffmpeg', [
      '-i', audioPath,
      '-af', 'volumedetect',
      '-f', 'null',
      '-',
    ], {
      encoding: 'utf-8',
      stdio: ['ignore', 'ignore', 'pipe'],
      timeout: 30000,
    });

    const meanMatch = stderr.match(/mean_volume:\s*(-?\d+(?:\.\d+)?)\s*dB/i);
    const maxMatch = stderr.match(/max_volume:\s*(-?\d+(?:\.\d+)?)\s*dB/i);
    const meanVolume = meanMatch ? Number(meanMatch[1]) : null;
    const maxVolume = maxMatch ? Number(maxMatch[1]) : null;

    if (maxVolume != null && maxVolume <= -80) return true;
    if (meanVolume != null && meanVolume <= -85) return true;
    return false;
  } catch {
    return false;
  }
}

function validateNarrationFile(audioPath) {
  if (!audioPath) return { ok: false, reason: 'audio_path_missing' };
  if (isAudioEffectivelySilent(audioPath)) {
    return { ok: false, reason: 'audio_silent_placeholder' };
  }
  return { ok: true };
}

function markAudioMissing(projectRoot, outputDir, reason) {
  if (!outputDir) return;
  const file = path.resolve(projectRoot, outputDir, 'video', 'audio_missing.json');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ reason, ts: new Date().toISOString() }));
}

module.exports = {
  normalizeTtsProvider,
  hasConfiguredTtsProvider,
  hasAnyTtsProvider,
  canProduceNarration,
  isAudioEffectivelySilent,
  validateNarrationFile,
  markAudioMissing,
};
