const SOUND_CUES = {
  click: [{ frequency: 440, duration: 0.06, delay: 0 }],
  success: [
    { frequency: 523.25, duration: 0.08, delay: 0 },
    { frequency: 659.25, duration: 0.08, delay: 0.09 },
    { frequency: 783.99, duration: 0.11, delay: 0.18 },
  ],
  alert: [
    { frequency: 392, duration: 0.08, delay: 0 },
    { frequency: 523.25, duration: 0.11, delay: 0.1 },
  ],
  error: [
    { frequency: 220, duration: 0.09, delay: 0 },
    { frequency: 174.61, duration: 0.12, delay: 0.12 },
  ],
};

let sharedAudioContext = null;

function getAudioContext() {
  if (typeof window === 'undefined') {
    return null;
  }

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    return null;
  }

  if (!sharedAudioContext) {
    sharedAudioContext = new AudioContext();
  }

  return sharedAudioContext;
}

function playTone(context, { frequency, duration, delay }) {
  const startAt = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, startAt);

  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(0.035, startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.02);
}

export async function playBrewSound(cue = 'success') {
  const context = getAudioContext();
  const sequence = SOUND_CUES[cue] || SOUND_CUES.success;

  if (!context) {
    return false;
  }

  if (context.state === 'suspended') {
    try {
      await context.resume();
    } catch {
      return false;
    }
  }

  for (const tone of sequence) {
    playTone(context, tone);
  }

  return true;
}
