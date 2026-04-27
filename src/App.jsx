import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import HomeScreen from "./components/HomeScreen.jsx";
import LevelSelect from "./components/LevelSelect.jsx";
import PuzzleBoard from "./components/PuzzleBoard.jsx";
import VictoryScreen from "./components/VictoryScreen.jsx";
import FindDiffGame from "./components/FindDiffGame.jsx";
import MazeGame from "./components/MazeGame.jsx";
import { PUZZLES, LEVELS } from "./data/puzzles.js";
import { addSolved, loadProgress, saveProgress } from "./lib/storage.js";
import { playVictory, speak, startMusic, stopMusic } from "./lib/audio.js";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [progress, setProgress] = useState(loadProgress);
  const [selectedPuzzle, setSelectedPuzzle] = useState(PUZZLES[0]);
  const [selectedLevel, setSelectedLevel] = useState(LEVELS[0]);

  useEffect(() => {
    saveProgress(progress);

    if (progress.sound) {
      startMusic(true);
    } else {
      stopMusic();
    }
  }, [progress]);

  const currentIndex = useMemo(() => {
    return PUZZLES.findIndex((puzzle) => puzzle.id === selectedPuzzle.id);
  }, [selectedPuzzle]);

  function startPuzzleMenu() {
    startMusic(progress.sound);
    setScreen("select");
  }

  function startFindDiffGame() {
    startMusic(progress.sound);
    setScreen("find-diff");
  }

  function startMazeGame() {
    startMusic(progress.sound);
    setScreen("maze");
  }

  function chooseGame(puzzle, level) {
    setSelectedPuzzle(puzzle);
    setSelectedLevel(level);

    setProgress((prev) => ({
      ...prev,
      lastPuzzleId: puzzle.id
    }));

    setScreen("game");
  }

  function completeGame() {
    const next = addSolved(progress, selectedPuzzle.id, selectedLevel.key);

    setProgress(next);
    playVictory(progress.sound);
    speak("Молодец!", progress.voice);
    setScreen("victory");
  }

  function playAgain() {
    setScreen("game");
  }

  function nextPuzzle() {
    const next = PUZZLES[(currentIndex + 1) % PUZZLES.length];

    setSelectedPuzzle(next);
    setScreen("select");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff7d6] text-[#442612]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-yellow-300/50 blur-3xl" />
        <div className="absolute -right-20 top-24 h-72 w-72 rounded-full bg-pink-300/40 blur-3xl" />
        <div className="absolute -bottom-20 left-24 h-72 w-72 rounded-full bg-sky-300/40 blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        {screen === "home" && (
          <Screen keyName="home">
            <HomeScreen
              progress={progress}
              onProgress={setProgress}
              onPlay={startPuzzleMenu}
              onFindDiff={startFindDiffGame}
              onMaze={startMazeGame}
            />
          </Screen>
        )}

        {screen === "select" && (
          <Screen keyName="select">
            <LevelSelect
              puzzles={PUZZLES}
              levels={LEVELS}
              progress={progress}
              onBack={() => setScreen("home")}
              onChoose={chooseGame}
            />
          </Screen>
        )}

        {screen === "game" && (
          <Screen keyName={`${selectedPuzzle.id}_${selectedLevel.key}`}>
            <PuzzleBoard
              puzzle={selectedPuzzle}
              level={selectedLevel}
              progress={progress}
              onBack={() => setScreen("select")}
              onComplete={completeGame}
            />
          </Screen>
        )}

        {screen === "victory" && (
          <Screen keyName="victory">
            <VictoryScreen
              puzzle={selectedPuzzle}
              level={selectedLevel}
              progress={progress}
              onAgain={playAgain}
              onNext={nextPuzzle}
              onHome={() => setScreen("select")}
            />
          </Screen>
        )}

        {screen === "find-diff" && (
          <Screen keyName="find-diff">
            <FindDiffGame
              progress={progress}
              onBack={() => setScreen("home")}
            />
          </Screen>
        )}

        {screen === "maze" && (
          <Screen keyName="maze">
            <MazeGame
              progress={progress}
              onBack={() => setScreen("home")}
            />
          </Screen>
        )}
      </AnimatePresence>
    </main>
  );
}

function Screen({ keyName, children }) {
  return (
    <motion.section
      key={keyName}
      initial={{ opacity: 0, scale: 0.98, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -18 }}
      transition={{ duration: 0.22 }}
      className="relative z-10 min-h-screen"
    >
      {children}
    </motion.section>
  );
}