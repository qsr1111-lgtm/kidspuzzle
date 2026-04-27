import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FIND_DIFF_LEVELS } from "../data/findDiffs.js";
import { playClick, playSnap, playVictory, speak } from "../lib/audio.js";

export default function FindDiffGame({ progress, onBack }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [found, setFound] = useState([]);
  const [wrongTap, setWrongTap] = useState(false);
  const [showWin, setShowWin] = useState(false);

  const level = FIND_DIFF_LEVELS[levelIndex];
  const total = level.differences.length;

  useEffect(() => {
    setFound([]);
    setWrongTap(false);
    setShowWin(false);
  }, [levelIndex]);

  useEffect(() => {
    if (found.length === total && total > 0) {
      playVictory(progress.sound);
      speak("Молодец! Все отличия найдены!", progress.voice);

      const timer = setTimeout(() => {
        setShowWin(true);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [found, total, progress.sound, progress.voice]);

  function handleCorrect(diff) {
    if (found.includes(diff.id)) return;

    setFound((prev) => [...prev, diff.id]);
    playSnap(progress.sound);
    speak("Отлично!", progress.voice);
  }

  function handleWrongTap() {
    setWrongTap(true);
    playClick(progress.sound);
    speak("Посмотри внимательнее", progress.voice);

    setTimeout(() => {
      setWrongTap(false);
    }, 450);
  }

  function nextLevel() {
    setLevelIndex((prev) => (prev + 1) % FIND_DIFF_LEVELS.length);
  }

  function prevLevel() {
    setLevelIndex((prev) =>
      prev === 0 ? FIND_DIFF_LEVELS.length - 1 : prev - 1
    );
  }

  function restartLevel() {
    setFound([]);
    setWrongTap(false);
    setShowWin(false);
    playClick(progress.sound);
  }

  if (showWin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-5 py-8 text-center">
        <motion.div
          initial={{ scale: 0.7, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
          className="mb-6 rounded-[44px] bg-white/85 p-5 shadow-2xl"
        >
          <img
            src={level.image}
            alt={level.title}
            className="h-56 w-56 rounded-[34px] object-cover shadow-xl md:h-80 md:w-80"
            draggable="false"
          />
        </motion.div>

        <h1 className="mb-3 text-6xl font-black text-[#ff7a2f]">
          Молодец!
        </h1>

        <p className="mb-7 text-2xl font-black text-[#4a2a16]">
          Все отличия найдены
        </p>

        <div className="grid w-full max-w-sm gap-3">
          <button
            onClick={nextLevel}
            className="min-h-[78px] rounded-[32px] bg-[#ff8a3d] text-3xl font-black text-white shadow-xl active:scale-95"
          >
            Дальше
          </button>

          <button
            onClick={restartLevel}
            className="min-h-[72px] rounded-[30px] bg-[#ffcf5a] text-2xl font-black text-[#4a2a16] shadow-xl active:scale-95"
          >
            Ещё раз
          </button>

          <button
            onClick={onBack}
            className="min-h-[64px] rounded-[26px] bg-white text-xl font-black shadow-lg active:scale-95"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col px-3 py-3 sm:px-5 md:h-[100dvh] md:max-h-[100dvh] md:overflow-hidden">
      <header className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex h-[56px] w-[56px] items-center justify-center rounded-[20px] bg-white text-2xl font-black shadow-lg active:scale-95 md:h-[68px] md:w-[68px] md:text-3xl"
        >
          ←
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-black leading-none md:text-4xl">
            Найди отличия
          </h1>
          <p className="mt-1 text-base font-black text-[#8a5a2c] md:text-xl">
            {found.length} / {total}
          </p>
        </div>

        <button
          onClick={restartLevel}
          className="flex h-[56px] w-[56px] items-center justify-center rounded-[20px] bg-white text-xl font-black shadow-lg active:scale-95 md:h-[68px] md:w-[68px] md:text-2xl"
        >
          🔄
        </button>
      </header>

      <div className="mb-3 shrink-0 text-center text-base font-black text-[#7b4a24] md:text-xl">
        Нажми на отличие
      </div>

      <section className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-4 md:min-h-0 md:flex-1 md:grid-cols-2">
        <PictureCard
          title="Картинка 1"
          image={level.image}
          differences={level.differences}
          found={found}
          isChanged={false}
          wrongTap={wrongTap}
          onCorrect={handleCorrect}
          onWrongTap={handleWrongTap}
        />

        <PictureCard
          title="Картинка 2"
          image={level.image}
          differences={level.differences}
          found={found}
          isChanged={true}
          wrongTap={wrongTap}
          onCorrect={handleCorrect}
          onWrongTap={handleWrongTap}
        />
      </section>

      <div className="mx-auto mt-4 grid w-full max-w-[760px] shrink-0 grid-cols-2 gap-3">
        <button
          onClick={() => {
            prevLevel();
            playClick(progress.sound);
          }}
          className="min-h-[62px] rounded-[24px] bg-white text-xl font-black shadow-lg active:scale-95 md:min-h-[72px]"
        >
          ← Назад
        </button>

        <button
          onClick={() => {
            nextLevel();
            playClick(progress.sound);
          }}
          className="min-h-[62px] rounded-[24px] bg-[#8ee06e] text-xl font-black shadow-lg active:scale-95 md:min-h-[72px]"
        >
          Дальше →
        </button>
      </div>
    </div>
  );
}

function PictureCard({
  title,
  image,
  differences,
  found,
  isChanged,
  wrongTap,
  onCorrect,
  onWrongTap
}) {
  return (
    <div
      className={[
        "rounded-[30px] bg-white/80 p-3 shadow-2xl transition-all md:flex md:min-h-0 md:flex-col md:p-4",
        wrongTap ? "ring-4 ring-red-300" : ""
      ].join(" ")}
    >
      <div className="mb-2 shrink-0 text-center text-lg font-black text-[#4a2a16] md:text-2xl">
        {title}
      </div>

      <div
        onClick={onWrongTap}
        className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-[26px] bg-[#fff8dc] shadow-inner md:max-h-[calc(100dvh-250px)] md:max-w-full"
      >
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
          draggable="false"
        />

        {isChanged &&
          differences.map((diff) => (
            <DifferenceVisual key={diff.id} diff={diff} />
          ))}

        {differences.map((diff) => (
          <DifferenceTapZone
            key={diff.id}
            diff={diff}
            found={found.includes(diff.id)}
            onCorrect={onCorrect}
          />
        ))}
      </div>
    </div>
  );
}

function DifferenceTapZone({ diff, found, onCorrect }) {
  return (
    <button
      onClick={(event) => {
        event.stopPropagation();
        onCorrect(diff);
      }}
      className="absolute z-30 rounded-full"
      style={{
        left: `${diff.x}%`,
        top: `${diff.y}%`,
        width: `${diff.size + 12}%`,
        height: `${diff.size + 12}%`,
        transform: "translate(-50%, -50%)"
      }}
      aria-label="Отличие"
    >
      {found && (
        <motion.div
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="h-full w-full rounded-full border-[6px] border-green-400 bg-green-200/35 shadow-xl"
        />
      )}
    </button>
  );
}

function DifferenceVisual({ diff }) {
  const commonStyle = {
    left: `${diff.x}%`,
    top: `${diff.y}%`,
    width: `${diff.size}%`,
    height: `${diff.size}%`,
    transform: "translate(-50%, -50%)"
  };

  if (diff.type === "star") {
    return (
      <div
        className="absolute z-20 flex items-center justify-center text-4xl drop-shadow-lg md:text-6xl"
        style={{
          left: `${diff.x}%`,
          top: `${diff.y}%`,
          transform: "translate(-50%, -50%)"
        }}
      >
        ⭐
      </div>
    );
  }

  if (diff.type === "heart") {
    return (
      <div
        className="absolute z-20 flex items-center justify-center text-4xl drop-shadow-lg md:text-6xl"
        style={{
          left: `${diff.x}%`,
          top: `${diff.y}%`,
          transform: "translate(-50%, -50%)"
        }}
      >
        ❤️
      </div>
    );
  }

  if (diff.type === "flower") {
    return (
      <div
        className="absolute z-20 flex items-center justify-center text-4xl drop-shadow-lg md:text-6xl"
        style={{
          left: `${diff.x}%`,
          top: `${diff.y}%`,
          transform: "translate(-50%, -50%)"
        }}
      >
        🌸
      </div>
    );
  }

  if (diff.type === "square") {
    return (
      <div
        className="absolute z-20 rounded-[18px] border-[5px] border-white shadow-xl"
        style={{
          ...commonStyle,
          backgroundColor: diff.color
        }}
      />
    );
  }

  return (
    <div
      className="absolute z-20 rounded-full border-[5px] border-white shadow-xl"
      style={{
        ...commonStyle,
        backgroundColor: diff.color
      }}
    />
  );
}