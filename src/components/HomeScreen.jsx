import { motion } from "motion/react";
import { playClick, speak, startMusic, stopMusic } from "../lib/audio.js";

export default function HomeScreen({ progress, onProgress, onPlay }) {
  function toggleSound() {
    const nextSound = !progress.sound;
    onProgress({ ...progress, sound: nextSound });
    if (nextSound) startMusic(true);
    else stopMusic();
    playClick(true);
  }

  function toggleVoice() {
    const nextVoice = !progress.voice;
    onProgress({ ...progress, voice: nextVoice });
    playClick(progress.sound);
    if (nextVoice) speak("Голос включён", true);
  }

  function handlePlay() {
    playClick(progress.sound);
    speak("Выбери картинку", progress.voice);
    onPlay();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-8 text-center">
      <motion.div initial={{ rotate: -4, scale: 0.9 }} animate={{ rotate: [0, -2, 2, 0], scale: 1 }} transition={{ repeat: Infinity, repeatDelay: 2.5, duration: 1.4 }} className="mb-5 flex h-40 w-40 items-center justify-center rounded-[48px] bg-orange-300 shadow-2xl">
        <div className="text-8xl">🐱</div>
      </motion.div>
      <h1 className="mb-3 text-5xl font-black leading-none text-[#4a2a16]">Котики<br />Пазлы</h1>
      <p className="mb-6 max-w-xs text-xl font-bold text-[#7b4a24]">Собирай картинки и получай звёздочки</p>
      <div className="mb-6 rounded-[32px] bg-white/75 px-6 py-4 shadow-xl">
        <div className="text-3xl font-black">⭐ {progress.stars}</div>
        <div className="text-base font-bold text-[#8a5a2c]">твоих звёздочек</div>
      </div>
      <button onClick={handlePlay} className="mb-4 min-h-[88px] w-full max-w-sm rounded-[36px] bg-[#ff8a3d] px-8 text-4xl font-black text-white shadow-2xl active:scale-95">Играть</button>
      <div className="grid w-full max-w-sm grid-cols-2 gap-3">
        <button onClick={toggleSound} className="min-h-[72px] rounded-[28px] bg-white px-4 text-xl font-black shadow-xl active:scale-95">{progress.sound ? "🔊 Музыка" : "🔇 Тихо"}</button>
        <button onClick={toggleVoice} className="min-h-[72px] rounded-[28px] bg-white px-4 text-xl font-black shadow-xl active:scale-95">{progress.voice ? "🗣 Голос" : "🤫 Без голоса"}</button>
      </div>
    </div>
  );
}
