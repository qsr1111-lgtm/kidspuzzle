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
  if (grid === 2) return "repeat(4, minmax(76px, 1fr))";
  if (grid === 3) return "repeat(3, minmax(86px, 1fr))";
  return "repeat(4, minmax(72px, 1fr))";
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
    <div className="flex min-h-screen flex-col px-4 py-4 sm:px-6 md:px-10">
      <header className="mb-3 flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="min-h-[62px] min-w-[62px] rounded-[22px] bg-white px-5 text-3xl font-black shadow-lg active:scale-95 md:min-h-[78px] md:min-w-[78px]"
        >
          ←
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-black leading-tight md:text-5xl">
            {puzzle.title}
          </h2>
          <p className="text-base font-bold text-[#8a5a2c] md:text-2xl">
            {level.title}
          </p>
        </div>

        <button
          onPointerDown={() => setShowHint(true)}
          onPointerUp={() => setShowHint(false)}
          onPointerLeave={() => setShowHint(false)}
          onTouchStart={() => setShowHint(true)}
          onTouchEnd={() => setShowHint(false)}
          className="min-h-[62px] min-w-[62px] rounded-[22px] bg-white px-4 text-2xl font-black shadow-lg active:scale-95 md:min-h-[78px] md:min-w-[78px]"
        >
          👀
        </button>
      </header>

      <div className="mb-3 text-center text-lg font-black text-[#7b4a24] md:text-2xl">
        Перетащи кусочки в пустые места
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="mx-auto w-full max-w-[min(92vw,720px)] rounded-[34px] bg-white/80 p-3 shadow-2xl md:p-5">
          <div
            className="relative grid gap-2 md:gap-3"
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

        <div className="mx-auto mt-5 w-full max-w-[min(94vw,840px)] rounded-[34px] bg-white/70 p-4 shadow-xl md:p-5">
          <div className="mb-3 text-center text-xl font-black text-[#4a2a16] md:text-3xl">
            Кусочки пазла
          </div>

          <div
            className="grid gap-3 md:gap-4"
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
      </DndContext>

      <div className="mx-auto mt-4 grid w-full max-w-[720px] grid-cols-2 gap-3">
        <button
          onClick={restartGame}
          className="min-h-[72px] rounded-[28px] bg-[#ffcf5a] text-xl font-black shadow-xl active:scale-95 md:min-h-[88px] md:text-3xl"
        >
          🔄 Сначала
        </button>

        <button
          onClick={() => {
            setShowHint((prev) => !prev);
            playClick(progress.sound);
          }}
          className="min-h-[72px] rounded-[28px] bg-[#8ee06e] text-xl font-black shadow-xl active:scale-95 md:min-h-[88px] md:text-3xl"
        >
          👀 Подсказка
        </button>
      </div>

      <div className="mt-3 text-center text-lg font-black text-[#8a5a2c] md:text-2xl">
        Собрано: {solvedCount} / {level.pieces}
      </div>
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
        "relative aspect-square overflow-hidden rounded-[18px] border-[5px] transition-all md:rounded-[24px] md:border-[7px]",
        piece
          ? "border-green-400 bg-white shadow-lg"
          : "border-dashed border-[#e5c989] bg-[#fff8dc]",
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
        <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-25 md:text-5xl">
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
          isDragging ? 1.18 : 1
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
        "puzzle-piece aspect-square w-full min-w-[72px] rounded-[18px] border-[5px] border-white bg-cover bg-no-repeat shadow-xl transition-shadow md:min-w-[96px] md:rounded-[24px] md:border-[7px]",
        isDragging ? "z-50 opacity-90 shadow-2xl" : "z-10"
      ].join(" ")}
      {...listeners}
      {...attributes}
      aria-label="Кусочек пазла"
    />
  );
}