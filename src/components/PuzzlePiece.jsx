import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function PuzzlePiece({ id, piece, grid, image, correct }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const row = Math.floor(piece.originalIndex / grid);
  const col = piece.originalIndex % grid;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundImage: `url("${image}")`,
    backgroundSize: `${grid * 100}% ${grid * 100}%`,
    backgroundPosition: `${grid === 1 ? 0 : (col / (grid - 1)) * 100}% ${grid === 1 ? 0 : (row / (grid - 1)) * 100}%`
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "puzzle-piece block aspect-square w-full rounded-[18px] border-[6px] bg-cover bg-no-repeat shadow-xl transition-all",
        correct ? "border-green-400 ring-4 ring-green-200" : "border-white",
        isDragging ? "z-50 scale-110 opacity-90 shadow-2xl" : "z-10"
      ].join(" ")}
      {...attributes}
      {...listeners}
    />
  );
}
