import { useState } from "react";
import { motion } from "motion/react";
import { playClick, speak, startMusic, stopMusic } from "../lib/audio.js";

export default function HomeScreen({
  progress,
  onProgress,
  onPlay,
  onFindDiff,
  onMaze
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  function toggleSound() {
    const nextSound = !progress.sound;

    onProgress({
      ...progress,
      sound: nextSound
    });

    if (nextSound) {
      startMusic(true);
    } else {
      stopMusic();
    }

    playClick(true);
  }

  function toggleVoice() {
    const nextVoice = !progress.voice;

    onProgress({
      ...progress,
      voice: nextVoice
    });

    playClick(progress.sound);

    if (nextVoice) {
      speak("Голос включён", true);
    }
  }

  function handlePlay() {
    playClick(progress.sound);
    speak("Собираем пазл", progress.voice);
    onPlay();
  }

  function handleFindDiff() {
    playClick(progress.sound);
    speak("Найди отличия", progress.voice);
    onFindDiff();
  }

  function handleMaze() {
    playClick(progress.sound);
    speak("Лабиринт", progress.voice);
    onMaze();
  }

  function toggleSettings() {
    setSettingsOpen((prev) => !prev);
    playClick(progress.sound);
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-8 text-center">
      <button
        onClick={toggleSettings}
        className="absolute right-5 top-5 z-20 flex h-16 w-16 items-center justify-center rounded-[24px] bg-white text-3xl font-black shadow-xl active:scale-95 md:right-8 md:top-8 md:h-20 md:w-20 md:text-4xl"
        aria-label="Настройки"
      >
        ⚙️
      </button>

      {settingsOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute right-5 top-24 z-30 w-[270px] rounded-[32px] bg-white/95 p-4 shadow-2xl md:right-8 md:top-32"
        >
          <div className="mb-3 text-2xl font-black text-[#4a2a16]">
            Настройки
          </div>

          <div className="grid gap-3">
            <button
              onClick={toggleSound}
              className="min-h-[66px] rounded-[24px] bg-[#fff1b8] px-4 text-xl font-black shadow-md active:scale-95"
            >
              {progress.sound ? "🔊 Музыка включена" : "🔇 Музыка выключена"}
            </button>

            <button
              onClick={toggleVoice}
              className="min-h-[66px] rounded-[24px] bg-[#dff6ff] px-4 text-xl font-black shadow-md active:scale-95"
            >
              {progress.voice ? "🗣 Голос включён" : "🤫 Голос выключен"}
            </button>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ rotate: -4, scale: 0.9 }}
        animate={{ rotate: [0, -2, 2, 0], scale: 1 }}
        transition={{
          repeat: Infinity,
          repeatDelay: 2.5,
          duration: 1.4
        }}
        className="mb-5 flex h-36 w-36 items-center justify-center rounded-[44px] bg-orange-300 shadow-2xl md:h-52 md:w-52 md:rounded-[60px]"
      >
        <div className="text-7xl md:text-9xl">🐱</div>
      </motion.div>

      <h1 className="mb-2 text-5xl font-black leading-none text-[#4a2a16] md:text-7xl">
        Давай
        <br />
        играть!
      </h1>

      <p className="mb-5 max-w-xs text-xl font-bold text-[#7b4a24] md:max-w-xl md:text-3xl">
        Выбери игру
      </p>

      <div className="grid w-full max-w-sm gap-3 md:max-w-xl">
        <button
          onClick={handlePlay}
          className="flex min-h-[86px] items-center justify-center rounded-[34px] bg-[#ff8a3d] px-6 text-3xl font-black text-white shadow-2xl active:scale-95 md:min-h-[112px] md:text-5xl"
        >
          🧩 Собрать пазл
        </button>

        <button
          onClick={handleFindDiff}
          className="flex min-h-[86px] items-center justify-center rounded-[34px] bg-[#8ee06e] px-6 text-3xl font-black text-[#234018] shadow-2xl active:scale-95 md:min-h-[112px] md:text-5xl"
        >
          🔍 Найти отличия
        </button>

        <button
          onClick={handleMaze}
          className="flex min-h-[86px] items-center justify-center rounded-[34px] bg-[#6ecbff] px-6 text-3xl font-black text-[#1e3a5f] shadow-2xl active:scale-95 md:min-h-[112px] md:text-5xl"
        >
          🧭 Лабиринт
        </button>
      </div>

      <div className="mt-5 rounded-[32px] bg-white/75 px-6 py-4 shadow-xl">
        <div className="text-3xl font-black md:text-5xl">
          ⭐ {progress.stars}
        </div>
        <div className="text-base font-bold text-[#8a5a2c] md:text-xl">
          звёздочек собрано
        </div>
      </div>
    </div>
  );
}