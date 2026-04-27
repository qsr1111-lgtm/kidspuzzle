import { PUZZLES } from "./puzzles.js";

function getPuzzle(index) {
  return PUZZLES[index] || PUZZLES[0];
}

export const FIND_DIFF_LEVELS = [
  {
    id: "diff-1",
    title: getPuzzle(0).title,
    image: getPuzzle(0).image,
    differences: [
      {
        id: "star",
        x: 22,
        y: 18,
        size: 13,
        type: "star",
        color: "#ffcf5a"
      },
      {
        id: "heart",
        x: 74,
        y: 30,
        size: 13,
        type: "heart",
        color: "#ff5c8a"
      },
      {
        id: "circle",
        x: 70,
        y: 76,
        size: 12,
        type: "circle",
        color: "#6ecbff"
      }
    ]
  },
  {
    id: "diff-2",
    title: getPuzzle(1).title,
    image: getPuzzle(1).image,
    differences: [
      {
        id: "flower",
        x: 18,
        y: 72,
        size: 13,
        type: "flower",
        color: "#ff8a8a"
      },
      {
        id: "star",
        x: 82,
        y: 20,
        size: 12,
        type: "star",
        color: "#fff35a"
      },
      {
        id: "circle",
        x: 58,
        y: 54,
        size: 11,
        type: "circle",
        color: "#8ee06e"
      }
    ]
  },
  {
    id: "diff-3",
    title: getPuzzle(2).title,
    image: getPuzzle(2).image,
    differences: [
      {
        id: "heart",
        x: 68,
        y: 63,
        size: 13,
        type: "heart",
        color: "#ff5c8a"
      },
      {
        id: "square",
        x: 35,
        y: 42,
        size: 11,
        type: "square",
        color: "#8f7aff"
      },
      {
        id: "circle",
        x: 82,
        y: 22,
        size: 10,
        type: "circle",
        color: "#ffcf5a"
      }
    ]
  },
  {
    id: "diff-4",
    title: getPuzzle(3).title,
    image: getPuzzle(3).image,
    differences: [
      {
        id: "star",
        x: 21,
        y: 74,
        size: 12,
        type: "star",
        color: "#fff35a"
      },
      {
        id: "flower",
        x: 47,
        y: 24,
        size: 12,
        type: "flower",
        color: "#ff8a8a"
      },
      {
        id: "circle",
        x: 66,
        y: 38,
        size: 11,
        type: "circle",
        color: "#6ecbff"
      }
    ]
  }
];