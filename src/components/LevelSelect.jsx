import { motion } from "motion/react";

export default function LevelSelect({ puzzles, onSelectPuzzle }) {
  return (
    <div className="min-h-screen px-4 py-6">
      <h1 className="mb-6 text-center text-3xl font-black">
        Выбери картинку
      </h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {puzzles.map((puzzle) => (
          <motion.div
            key={puzzle.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectPuzzle(puzzle)}
            className="cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg"
          >
            <img
              src={puzzle.image}
              alt=""
              className="aspect-square w-full object-cover"
            />

            <div className="p-2 text-center font-bold">
              {puzzle.title}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}