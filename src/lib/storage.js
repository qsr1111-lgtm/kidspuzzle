const KEY = "kids_puzzles_progress_v1";

const DEFAULT_PROGRESS = {
  stars: 0,
  solved: {},
  sound: true,
  voice: true,
  lastPuzzleId: "home"
};

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress) {
  localStorage.setItem(KEY, JSON.stringify(progress));
}

export function addSolved(progress, puzzleId, levelKey) {
  const solveKey = `${puzzleId}_${levelKey}`;
  if (progress.solved[solveKey]) return progress;

  return {
    ...progress,
    stars: progress.stars + 1,
    solved: {
      ...progress.solved,
      [solveKey]: true
    }
  };
}
