import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { playClick, playSnap, playVictory, speak } from "../lib/audio.js";

const MAZE_LEVELS = [
  {
    id: "maze-1",
    title: "К звёздочке",
    grid: [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1]
    ],
    start: { x: 1, y: 1 },
    goal: { x: 3, y: 4 }
  },
  {
    id: "maze-2",
    title: "К конфетке",
    grid: [
      [1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 1],
      [1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 1, 1],
      [1, 0, 1, 0, 0, 1],
      [1, 0, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    start: { x: 1, y: 1 },
    goal: { x: 4, y: 5 }
  },
  {
    id: "maze-3",
    title: "К подарку",
    grid: [
      [1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 0, 1],
      [1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    start: { x: 1, y: 1 },
    goal: { x: 4, y: 5 }
  },
  {
    id: "maze-4",
    title: "К сердечку",
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1]
    ],
    start: { x: 1, y: 1 },
    goal: { x: 5, y: 1 }
  }
];

const GOAL_ICONS = ["⭐", "🍭", "🎁", "❤️"];

export default function MazeGame({ progress, onBack }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [player, setPlayer] = useState(MAZE_LEVELS[0].start);
  const [completed, setCompleted] = useState(false);
  const [bump, setBump] = useState(false);
  const touchStartRef = useRef(null);

  const level = MAZE_LEVELS[levelIndex];
  const goalIcon = GOAL_ICONS[levelIndex % GOAL_ICONS.length];

  const rows = level.grid.length;
  const cols = level.grid[0].length;

  const cellSize = useMemo(() => {
    const maxCols = Math.max(cols, rows);
    if (maxCols <= 5) return "min(13.5vw, 13.5vh, 86px)";
    if (maxCols === 6) return "min(12vw, 12vh, 76px)";
    return "min(10.5vw, 10.5vh, 68px)";
  }, [cols, rows]);

  useEffect(() => {
    resetLevel();
  }, [levelIndex]);

  function resetLevel() {
    const nextLevel = MAZE_LEVELS[levelIndex];
    setPlayer(nextLevel.start);
    setCompleted(false);
    setBump(false);
  }

  function isWall(x, y) {
    if (!level.grid[y]) return true;
    return level.grid[y][x] === 1 || level.grid[y][x] === undefined;
  }

  function move(dx, dy) {
    if (completed) return;

    const nextX = player.x + dx;
    const nextY = player.y + dy;

    if (isWall(nextX, nextY)) {
      setBump(true);
      playClick(progress.sound);
      speak("Там стенка", progress.voice);

      setTimeout(() => {
        setBump(false);
      }, 350);

      return;
    }

    const nextPlayer = { x: nextX, y: nextY };
    setPlayer(nextPlayer);
    playSnap(progress.sound);

    if (nextX === level.goal.x && nextY === level.goal.y) {
      setCompleted(true);

      setTimeout(() => {
        playVictory(progress.sound);
        speak("Молодец! Ты дошла!", progress.voice);
      }, 250);
    }
  }

  function nextLevel() {
    setLevelIndex((prev) => (prev + 1) % MAZE_LEVELS.length);
    playClick(progress.sound);
    speak("Следующий лабиринт", progress.voice);
  }

  function previousLevel() {
    setLevelIndex((prev) =>
      prev === 0 ? MAZE_LEVELS.length - 1 : prev - 1
    );
    playClick(progress.sound);
  }

  function handleTouchStart(event) {
    const touch = event.touches[0];

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY
    };
  }

  function handleTouchEnd(event) {
    if (!touchStartRef.current) return;

    const touch = event.changedTouches[0];

    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    touchStartRef.current = null;

    if (Math.max(absX, absY) < 24) return;

    if (absX > absY) {
      if (dx > 0) move(1, 0);
      else move(-1, 0);
    } else {
      if (dy > 0) move(0, 1);
      else move(0, -1);
    }
  }

  return (
    <div className="flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden px-3 py-3 sm:px-5">
      <header className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex h-[56px] w-[56px] items-center justify-center rounded-[20px] bg-white text-2xl font-black shadow-lg active:scale-95 md:h-[68px] md:w-[68px] md:text-3xl"
        >
          ←
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-black leading-none md:text-4xl">
            Лабиринт
          </h1>
          <p className="mt-1 text-base font-black text-[#8a5a2c] md:text-xl">
            {level.title}
          </p>
        </div>

        <button
          onClick={resetLevel}
          className="flex h-[56px] w-[56px] items-center justify-center rounded-[20px] bg-white text-xl font-black shadow-lg active:scale-95 md:h-[68px] md:w-[68px] md:text-2xl"
        >
          🔄
        </button>
      </header>

      <div className="mb-2 shrink-0 text-center text-base font-black text-[#7b4a24] md:text-xl">
        Проведи пальцем: вверх, вниз, вправо или влево
      </div>

      <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3">
        <motion.div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          animate={bump ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-[34px] bg-white/80 p-3 shadow-2xl md:p-4"
        >
          <div
            className="grid gap-2 md:gap-3"
            style={{
              gridTemplateColumns: `repeat(${cols}, ${cellSize})`
            }}
          >
            {level.grid.map((row, y) =>
              row.map((cell, x) => {
                const isPlayer = player.x === x && player.y === y;
                const isGoal = level.goal.x === x && level.goal.y === y;

                return (
                  <MazeCell
                    key={`${x}-${y}`}
                    wall={cell === 1}
                    player={isPlayer}
                    goal={isGoal}
                    goalIcon={goalIcon}
                    completed={completed}
                  />
                );
              })
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-3">
          <div />

          <MoveButton onClick={() => move(0, -1)}>
            ⬆️
          </MoveButton>

          <div />

          <MoveButton onClick={() => move(-1, 0)}>
            ⬅️
          </MoveButton>

          <div className="flex h-[64px] w-[64px] items-center justify-center rounded-[22px] bg-white/70 text-2xl font-black shadow-md md:h-[76px] md:w-[76px]">
            🐾
          </div>

          <MoveButton onClick={() => move(1, 0)}>
            ➡️
          </MoveButton>

          <div />

          <MoveButton onClick={() => move(0, 1)}>
            ⬇️
          </MoveButton>

          <div />
        </div>
      </section>

      <footer className="mt-3 grid shrink-0 grid-cols-2 gap-3">
        <button
          onClick={previousLevel}
          className="min-h-[58px] rounded-[24px] bg-white text-xl font-black shadow-lg active:scale-95 md:min-h-[72px] md:text-2xl"
        >
          ← Назад
        </button>

        <button
          onClick={nextLevel}
          className="min-h-[58px] rounded-[24px] bg-[#8ee06e] text-xl font-black text-[#234018] shadow-lg active:scale-95 md:min-h-[72px] md:text-2xl"
        >
          Дальше →
        </button>
      </footer>

      {completed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="pointer-events-none fixed inset-x-4 bottom-24 z-50 rounded-[34px] bg-white/95 px-6 py-5 text-center shadow-2xl md:bottom-28 md:left-1/2 md:w-[520px] md:-translate-x-1/2"
        >
          <div className="text-5xl">🎉</div>
          <div className="mt-2 text-3xl font-black text-[#ff7a2f]">
            Молодец!
          </div>
          <div className="text-xl font-bold text-[#8a5a2c]">
            Котик дошёл до цели
          </div>
        </motion.div>
      )}
    </div>
  );
}

function MazeCell({ wall, player, goal, goalIcon, completed }) {
  return (
    <div
      className={[
        "relative flex aspect-square items-center justify-center rounded-[18px] border-[4px] shadow-md md:rounded-[24px] md:border-[5px]",
        wall
          ? "border-[#6b3b1d] bg-[#8a5a2c]"
          : "border-[#f1d993] bg-[#fff5c7]"
      ].join(" ")}
    >
      {!wall && (
        <div className="absolute inset-1 rounded-[14px] bg-white/25 md:rounded-[18px]" />
      )}

      {goal && (
        <motion.div
          animate={completed ? { scale: [1, 1.35, 1] } : { scale: [1, 1.12, 1] }}
          transition={{
            repeat: Infinity,
            duration: completed ? 0.55 : 1.2
          }}
          className="relative z-10 text-3xl md:text-5xl"
        >
          {goalIcon}
        </motion.div>
      )}

      {player && (
        <motion.div
          layout
          initial={{ scale: 0.8 }}
          animate={{ scale: completed ? [1, 1.25, 1] : 1 }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 20
          }}
          className="relative z-20 text-3xl md:text-5xl"
        >
          🐱
        </motion.div>
      )}
    </div>
  );
}

function MoveButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="flex h-[64px] w-[64px] items-center justify-center rounded-[22px] bg-white text-2xl font-black shadow-xl active:scale-95 md:h-[76px] md:w-[76px] md:text-3xl"
    >
      {children}
    </button>
  );
}