import { useEffect, useState } from "react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { motion } from "motion/react";
import { playClick, playSnap, speak } from "../lib/audio.js";

function shuffle(items) {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function getTrayColumns(grid) {
  if (grid === 2) return "repeat(4, minmax(0, 1fr))";
  if (grid === 3) return "repeat(5, minmax(0, 1fr))";
  return "repeat(8, minmax(0, 1fr))";
}

function getBoardSize(grid) {
  if (grid === 2) return "min(62vh, 74vw, 560px)";
  if (grid === 3) return "min(58vh, 72vw, 560px)";
  return "min(54vh, 70vw, 560px)";
}

export default function PuzzleBoard({ puzzle, level, progress, onBack, onComplete }) {
  const [showHint, setShowHint] = useState(false);
  const [trayPieces, setTrayPieces] = useState([]);
  const [placedPieces, setPlacedPieces] = useState({});
  const [wrongCell, setWrongCell] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 80,
        tolerance: 10
      }
    })
  );

  useEffect(() => {
    createNewGame();
  }, [puzzle.id, level.key, level.pieces]);

  const solvedCount = Object.keys(placedPieces).length;
  const isSolved = solvedCount === level.pieces;

  useEffect(() => {
    if (isSolved) {
      const timer = setTimeout(() => {
        onComplete();
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [isSolved, onComplete]);

  function createNewGame() {
    const pieces = Array.from({ length: level.pieces }, (_, index) => ({
      id: `${puzzle.id}_${level.key}_${index}_${Date.now()}`,
      originalIndex: index
    }));

    setTrayPieces(shuffle(pieces));
    setPlacedPieces({});
    setWrongCell(null);
    setShowHint(false);
  }

  function handleDragStart() {
    playClick(progress.sound);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    const piece = trayPieces.find((item) => item.id === active.id);
    if (!piece) return;

    const cellIndex = Number(String(over.id).replace("cell-", ""));

    if (piece.originalIndex === cellIndex) {
      setPlacedPieces((prev) => ({
        ...prev,
        [cellIndex]: piece
      }));

      setTrayPieces((prev) => prev.filter((item) => item.id !== piece.id));

      playSnap(progress.sound);
      speak("Отлично", progress.voice);
    } else {
      setWrongCell(cellIndex);
      playClick(progress.sound);
      speak("Попробуй сюда", progress.voice);

      setTimeout(() => {
        setWrongCell(null);
      }, 500);
    }
  }

  function restartGame() {
    createNewGame();
    playClick(progress.sound);
  }

  return (
    <div className="flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden px-3 py-3 sm:px-5 md:px-8">
      <header className="mb-2 flex shrink-0 items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="min-h-[54px] min-w-[54px] rounded-[20px] bg-white px-4 text-2xl font-black shadow-lg active:scale-95 md:min-h-[66px] md:min-w-[66px] md:text-3xl"
        >
          ←
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-black leading-tight md:text-4xl">
            {puzzle.title}
          </h2>
          <p className="text-base font-bold text-[#8a5a2c] md:text-xl">
            {level.title}
          </p>
        </div>

        <button
          onPointerDown={() => setShowHint(true)}
          onPointerUp={() => setShowHint(false)}
          onPointerLeave={() => setShowHint(false)}
          onTouchStart={() => setShowHint(true)}
          onTouchEnd={() => setShowHint(false)}
          className="min-h-[54px] min-w-[54px] rounded-[20px] bg-white px-4 text-xl font-black shadow-lg active:scale-95 md:min-h-[66px] md:min-w-[66px] md:text-2xl"
        >
          👀
        </button>
      </header>

      <div className="mb-2 shrink-0 text-center text-base font-black text-[#7b4a24] md:text-xl">
        Перетащи кусочки в пустые места
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <section className="flex min-h-0 flex-1 flex-col items-center justify-between gap-3">
          <div
            className="rounded-[30px] bg-white/80 p-2 shadow-2xl md:p-3"
            style={{
              width: getBoardSize(level.grid),
              height: getBoardSize(level.grid)
            }}
          >
            <div
              className="grid h-full w-full gap-2 md:gap-3"
              style={{
                gridTemplateColumns: `repeat(${level.grid}, minmax(0, 1fr))`
              }}
            >
              {Array.from({ length: level.pieces }, (_, index) => (
                <PuzzleCell
                  key={index}
                  id={`cell-${index}`}
                  index={index}
                  grid={level.grid}
                  image={puzzle.image}
                  piece={placedPieces[index]}
                  showHint={showHint}
                  wrong={wrongCell === index}
                />
              ))}
            </div>
          </div>

          <div className="w-full max-w-[960px] shrink-0 rounded-[28px] bg-white/70 p-3 shadow-xl md:p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <button
                onClick={restartGame}
                className="min-h-[50px] rounded-[20px] bg-[#ffcf5a] px-4 text-base font-black shadow-md active:scale-95 md:min-h-[58px] md:text-xl"
              >
                🔄 Сначала
              </button>

              <div className="text-center text-base font-black text-[#8a5a2c] md:text-xl">
                {solvedCount} / {level.pieces}
              </div>

              <button
                onClick={() => {
                  setShowHint((prev) => !prev);
                  playClick(progress.sound);
                }}
                className="min-h-[50px] rounded-[20px] bg-[#8ee06e] px-4 text-base font-black shadow-md active:scale-95 md:min-h-[58px] md:text-xl"
              >
                👀 Подсказка
              </button>
            </div>

            <div
              className="grid gap-2 md:gap-3"
              style={{
                gridTemplateColumns: getTrayColumns(level.grid)
              }}
            >
              {trayPieces.map((piece) => (
                <DraggablePiece
                  key={piece.id}
                  piece={piece}
                  grid={level.grid}
                  image={puzzle.image}
                />
              ))}
            </div>
          </div>
        </section>
      </DndContext>
    </div>
  );
}

function PuzzleCell({ id, index, grid, image, piece, showHint, wrong }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const row = Math.floor(index / grid);
  const col = index % grid;

  const backgroundStyle = {
    backgroundImage: `url("${image}")`,
    backgroundSize: `${grid * 100}% ${grid * 100}%`,
    backgroundPosition: `${grid === 1 ? 0 : (col / (grid - 1)) * 100}% ${
      grid === 1 ? 0 : (row / (grid - 1)) * 100
    }%`
  };

  return (
    <div
      ref={setNodeRef}
      className={[
        "relative aspect-square overflow-hidden rounded-[16px] border-[4px] transition-all md:rounded-[22px] md:border-[6px]",
        piece
          ? "border-green-400 bg-white shadow-lg"
          : "border-dashed border-[#d9bd7c] bg-[#fff8dc]",
        isOver && !piece ? "scale-[1.04] border-[#ff8a3d] bg-[#fff0b8]" : "",
        wrong ? "animate-pulse border-red-400 bg-red-100" : ""
      ].join(" ")}
    >
      {showHint && !piece && (
        <div
          className="absolute inset-0 bg-cover bg-no-repeat opacity-25"
          style={backgroundStyle}
        />
      )}

      {!piece && (
        <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-25 md:text-4xl">
          🧩
        </div>
      )}

      {piece && (
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={backgroundStyle}
        />
      )}
    </div>
  );
}

function DraggablePiece({ piece, grid, image }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: piece.id
  });

  const row = Math.floor(piece.originalIndex / grid);
  const col = piece.originalIndex % grid;

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${
          isDragging ? 1.15 : 1
        })`
      : undefined,
    backgroundImage: `url("${image}")`,
    backgroundSize: `${grid * 100}% ${grid * 100}%`,
    backgroundPosition: `${grid === 1 ? 0 : (col / (grid - 1)) * 100}% ${
      grid === 1 ? 0 : (row / (grid - 1)) * 100
    }%`
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      className={[
        "puzzle-piece aspect-square w-full rounded-[14px] border-[4px] border-white bg-cover bg-no-repeat shadow-lg transition-shadow md:rounded-[20px] md:border-[6px]",
        isDragging ? "z-50 opacity-90 shadow-2xl" : "z-10"
      ].join(" ")}
      {...listeners}
      {...attributes}
      aria-label="Кусочек пазла"
    />
  );
}