import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { playClick, playSnap, playVictory, speak } from "../lib/audio.js";

const LEVELS = [
  {
    title: "К звёздочке",
    goal: "⭐",
    path: [
      { x: 16, y: 76 },
      { x: 28, y: 76 },
      { x: 28, y: 55 },
      { x: 48, y: 55 },
      { x: 48, y: 34 },
      { x: 72, y: 34 },
      { x: 82, y: 22 }
    ]
  },
  {
    title: "К конфетке",
    goal: "🍭",
    path: [
      { x: 15, y: 72 },
      { x: 35, y: 72 },
      { x: 35, y: 48 },
      { x: 58, y: 48 },
      { x: 58, y: 28 },
      { x: 82, y: 28 }
    ]
  },
  {
    title: "К подарку",
    goal: "🎁",
    path: [
      { x: 16, y: 80 },
      { x: 16, y: 58 },
      { x: 38, y: 58 },
      { x: 38, y: 38 },
      { x: 62, y: 38 },
      { x: 62, y: 62 },
      { x: 82, y: 62 }
    ]
  }
];

function distanceToSegment(point, a, b) {
  const px = point.x;
  const py = point.y;
  const ax = a.x;
  const ay = a.y;
  const bx = b.x;
  const by = b.y;

  const dx = bx - ax;
  const dy = by - ay;

  if (dx === 0 && dy === 0) {
    return Math.hypot(px - ax, py - ay);
  }

  const t = Math.max(
    0,
    Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy))
  );

  const closestX = ax + t * dx;
  const closestY = ay + t * dy;

  return Math.hypot(px - closestX, py - closestY);
}

function isNearPath(point, path, tolerance = 10) {
  for (let i = 0; i < path.length - 1; i += 1) {
    const distance = distanceToSegment(point, path[i], path[i + 1]);

    if (distance <= tolerance) {
      return true;
    }
  }

  return false;
}

function getNearestPathPoint(point, path) {
  let nearest = path[0];
  let bestDistance = Infinity;

  for (const pathPoint of path) {
    const distance = Math.hypot(point.x - pathPoint.x, point.y - pathPoint.y);

    if (distance < bestDistance) {
      bestDistance = distance;
      nearest = pathPoint;
    }
  }

  return nearest;
}

export default function MazeGame({ progress, onBack }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [catPosition, setCatPosition] = useState(LEVELS[0].path[0]);
  const [dragging, setDragging] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [warning, setWarning] = useState(false);

  const boardRef = useRef(null);
  const level = LEVELS[levelIndex];
  const start = level.path[0];
  const goal = level.path[level.path.length - 1];

  useEffect(() => {
    resetLevel();
  }, [levelIndex]);

  function resetLevel() {
    const nextLevel = LEVELS[levelIndex];

    setCatPosition(nextLevel.path[0]);
    setDragging(false);
    setCompleted(false);
    setWarning(false);
  }

  function getPointFromEvent(event) {
    const rect = boardRef.current.getBoundingClientRect();

    const clientX = event.touches?.[0]?.clientX ?? event.clientX;
    const clientY = event.touches?.[0]?.clientY ?? event.clientY;

    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100
    };
  }

  function handleDragStart(event) {
    if (completed) return;

    event.preventDefault();
    setDragging(true);
    playClick(progress.sound);
    speak("Веди котика", progress.voice);
  }

  function handleDragMove(event) {
    if (!dragging || completed) return;

    event.preventDefault();

    const point = getPointFromEvent(event);
    const nearPath = isNearPath(point, level.path, 11);

    if (nearPath) {
      setCatPosition(point);
      setWarning(false);
      return;
    }

    setWarning(true);

    const nearest = getNearestPathPoint(point, level.path);
    setCatPosition(nearest);
  }

  function handleDragEnd() {
    if (!dragging || completed) return;

    setDragging(false);

    const distanceToGoal = Math.hypot(
      catPosition.x - goal.x,
      catPosition.y - goal.y
    );

    if (distanceToGoal <= 11) {
      setCatPosition(goal);
      setCompleted(true);
      setWarning(false);

      playVictory(progress.sound);
      speak("Молодец! Котик дошёл!", progress.voice);
      return;
    }

    if (warning) {
      playClick(progress.sound);
      speak("Идём по дорожке", progress.voice);
    } else {
      playSnap(progress.sound);
    }
  }

  function nextLevel() {
    setLevelIndex((prev) => (prev + 1) % LEVELS.length);
    playClick(progress.sound);
    speak("Следующая дорожка", progress.voice);
  }

  function previousLevel() {
    setLevelIndex((prev) => (prev === 0 ? LEVELS.length - 1 : prev - 1));
    playClick(progress.sound);
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
            Дорожка
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

      <div className="mb-3 shrink-0 text-center text-base font-black text-[#7b4a24] md:text-xl">
        Возьми котика и веди по дорожке
      </div>

      <section className="flex min-h-0 flex-1 items-center justify-center">
        <motion.div
          animate={warning ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.25 }}
          ref={boardRef}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          className="relative aspect-square w-full max-w-[min(92vw,72vh,720px)] overflow-hidden rounded-[42px] bg-[#fff4c7] shadow-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#ffffff_0,#ffffff_10%,transparent_11%),radial-gradient(circle_at_75%_30%,#ffffff_0,#ffffff_8%,transparent_9%),radial-gradient(circle_at_35%_80%,#ffffff_0,#ffffff_7%,transparent_8%)] opacity-50" />

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polyline
              points={level.path.map((point) => `${point.x},${point.y}`).join(" ")}
              fill="none"
              stroke="#f0c05a"
              strokeWidth="15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <polyline
              points={level.path.map((point) => `${point.x},${point.y}`).join(" ")}
              fill="none"
              stroke="#fff4b8"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <polyline
              points={level.path.map((point) => `${point.x},${point.y}`).join(" ")}
              fill="none"
              stroke="#ffcf5a"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2 4"
            />
          </svg>

          <div
            className="absolute flex h-[82px] w-[82px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-4xl shadow-xl md:h-[108px] md:w-[108px] md:text-6xl"
            style={{
              left: `${start.x}%`,
              top: `${start.y}%`
            }}
          >
            🏠
          </div>

          <motion.div
            animate={completed ? { scale: [1, 1.25, 1] } : { scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: completed ? 0.6 : 1.2 }}
            className="absolute flex h-[82px] w-[82px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-4xl shadow-xl md:h-[108px] md:w-[108px] md:text-6xl"
            style={{
              left: `${goal.x}%`,
              top: `${goal.y}%`
            }}
          >
            {level.goal}
          </motion.div>

          <motion.button
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            animate={{
              left: `${catPosition.x}%`,
              top: `${catPosition.y}%`,
              scale: dragging ? 1.16 : 1
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 28
            }}
            className="absolute z-30 flex h-[86px] w-[86px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-orange-300 text-5xl shadow-2xl active:scale-110 md:h-[112px] md:w-[112px] md:text-7xl"
          >
            🐱
          </motion.button>

          {warning && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-[28px] bg-white/95 px-5 py-3 text-xl font-black text-[#8a5a2c] shadow-xl">
              По дорожке 😊
            </div>
          )}

          {completed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute inset-x-5 bottom-5 rounded-[34px] bg-white/95 px-5 py-4 text-center shadow-2xl"
            >
              <div className="text-5xl">🎉</div>
              <div className="text-3xl font-black text-[#ff7a2f]">
                Молодец!
              </div>
              <div className="text-lg font-bold text-[#8a5a2c]">
                Котик дошёл
              </div>
            </motion.div>
          )}
        </motion.div>
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
    </div>
  );
}