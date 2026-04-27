import { motion } from "motion/react";
import { playClick, speak } from "../lib/audio.js";

const LEVEL_STYLES = {
  easy: "bg-[#8ee06e] text-[#234018]",
  medium: "bg-[#ffcf5a] text-[#4a2a16]",
  hard: "bg-[#ff8a8a] text-[#4a1e1e]"
};

export default function LevelSelect({ puzzles, levels, progress, onBack, onChoose }) {
  function choose(puzzle, level) {
    playClick(progress.sound);
    speak(level.title, progress.voice);
    onChoose(puzzle, level);
  }

  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 md:px-10">
      <header className="mb-5 flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="min-h-[64px] min-w-[64px] rounded-[24px] bg-white px-5 text-3xl font-black shadow-lg active:scale-95"
        >
          ←
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-black md:text-5xl">Выбери пазл</h2>
          <p className="text-lg font-bold text-[#8a5a2c] md:text-2xl">
            ⭐ {progress.stars}
          </p>
        </div>

        <div className="w-[64px]" />
      </header>

      <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-4 pb-8 md:grid-cols-3 lg:grid-cols-4">
        {puzzles.map((puzzle, index) => (
          <motion.div
            key={puzzle.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="overflow-hidden rounded-[30px] bg-white/85 p-3 shadow-xl md:rounded-[36px] md:p-4"
          >
            <img
              src={puzzle.image}
              alt={puzzle.title}
              className="mb-3 aspect-square w-full rounded-[24px] object-cover shadow-inner md:rounded-[30px]"
              draggable="false"
            />

            <div className="mb-3 text-center text-lg font-black leading-tight md:text-2xl">
              {puzzle.title}
            </div>

            <div className="grid gap-2 md:gap-3">
              {levels.map((level) => {
                const solved = progress.solved[`${puzzle.id}_${level.key}`];

                return (
                  <button
                    key={level.key}
                    onClick={() => choose(puzzle, level)}
                    className={[
                      "min-h-[62px] rounded-[24px] px-2 text-xl font-black shadow-md active:scale-95 md:min-h-[76px] md:text-2xl",
                      LEVEL_STYLES[level.key] || "bg-[#fff1b8] text-[#4a2a16]"
                    ].join(" ")}
                  >
                    {level.title} {solved ? "⭐" : ""}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}