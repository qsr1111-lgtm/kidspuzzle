import { motion } from "motion/react";
import { playClick, speak } from "../lib/audio.js";

export default function VictoryScreen({ puzzle, level, progress, onAgain, onNext, onHome }) {
  function again() {
    playClick(progress.sound);
    speak("Давай ещё", progress.voice);
    onAgain();
  }

  function next() {
    playClick(progress.sound);
    speak("Выбери новый пазл", progress.voice);
    onNext();
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-8 text-center">
      <Confetti />
      <motion.div initial={{ scale: 0.6, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 14 }} className="mb-5 rounded-[44px] bg-white/85 p-5 shadow-2xl">
        <img src={puzzle.image} alt={puzzle.title} className="h-52 w-52 rounded-[34px] object-cover shadow-xl" draggable="false" />
      </motion.div>
      <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-3 text-6xl font-black text-[#ff7a2f]">Молодец!</motion.h1>
      <p className="mb-2 text-2xl font-black text-[#4a2a16]">Ты собрал пазл</p>
      <p className="mb-6 text-xl font-bold text-[#8a5a2c]">{puzzle.title} · {level.grid}x{level.grid}</p>
      <div className="mb-7 rounded-[30px] bg-white/80 px-7 py-4 shadow-xl">
        <div className="text-4xl font-black">⭐ {progress.stars}</div>
        <div className="text-base font-bold text-[#8a5a2c]">звёздочек</div>
      </div>
      <div className="grid w-full max-w-sm gap-3">
        <button onClick={again} className="min-h-[78px] rounded-[32px] bg-[#ffcf5a] text-3xl font-black text-[#4a2a16] shadow-xl active:scale-95">Играть ещё</button>
        <button onClick={next} className="min-h-[78px] rounded-[32px] bg-[#ff8a3d] text-3xl font-black text-white shadow-xl active:scale-95">Дальше</button>
        <button onClick={onHome} className="min-h-[62px] rounded-[26px] bg-white text-xl font-black shadow-lg active:scale-95">Выбрать пазл</button>
      </div>
    </div>
  );
}

function Confetti() {
  const items = Array.from({ length: 28 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0">
      {items.map((i) => (
        <motion.div
          key={i}
          initial={{ y: -80, x: `${Math.random() * 100}vw`, rotate: 0, opacity: 1 }}
          animate={{ y: "110vh", rotate: 360, opacity: [1, 1, 0.7] }}
          transition={{ duration: 2.4 + Math.random() * 1.5, delay: Math.random() * 0.8, repeat: Infinity, repeatDelay: 1.2 }}
          className="absolute h-5 w-5 rounded-md"
          style={{ background: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff8bd1"][i % 5] }}
        />
      ))}
    </div>
  );
}
