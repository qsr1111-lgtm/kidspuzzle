let audioContext = null;
let musicTimer = null;
let musicOn = false;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function tone(freq = 440, duration = 0.12, type = "sine", volume = 0.025) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.value = freq;
    osc.type = type;
    gain.gain.value = volume;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export function playClick(enabled = true) {
  if (!enabled) return;
  tone(660, 0.07, "sine", 0.018);
}

export function playSnap(enabled = true) {
  if (!enabled) return;
  tone(784, 0.08, "triangle", 0.024);
  setTimeout(() => tone(988, 0.08, "triangle", 0.02), 80);
}

export function playVictory(enabled = true) {
  if (!enabled) return;

  const notes = [523, 659, 784, 1046, 880, 1046];

  notes.forEach((note, index) => {
    setTimeout(() => {
      tone(note, 0.12, "triangle", 0.028);
    }, index * 110);
  });
}

function findSoftRussianVoice() {
  const voices = window.speechSynthesis?.getVoices?.() || [];

  return (
    voices.find((v) => v.lang === "ru-RU" && /female|жен|anna|milena|oksana|alena/i.test(v.name)) ||
    voices.find((v) => v.lang === "ru-RU") ||
    voices.find((v) => v.lang.startsWith("ru")) ||
    null
  );
}

export function speak(text, enabled = true) {
  if (!enabled) return;

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = findSoftRussianVoice();

    if (voice) utterance.voice = voice;

    utterance.lang = "ru-RU";
    utterance.rate = 0.78;
    utterance.pitch = 1.18;
    utterance.volume = 0.9;

    window.speechSynthesis.speak(utterance);
  } catch {}
}

export function startMusic(enabled = true) {
  if (!enabled || musicOn) return;

  musicOn = true;

  const melody = [
    523, 659, 784, 659,
    587, 698, 880, 698,
    523, 659, 784, 1046
  ];

  let index = 0;

  const loop = () => {
    if (!musicOn) return;

    const note = melody[index % melody.length];
    tone(note, 0.16, "sine", 0.012);

    index += 1;
    musicTimer = setTimeout(loop, 420);
  };

  loop();
}

export function stopMusic() {
  musicOn = false;

  if (musicTimer) {
    clearTimeout(musicTimer);
  }

  musicTimer = null;
}