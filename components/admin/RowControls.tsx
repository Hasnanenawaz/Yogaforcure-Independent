"use client";

import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";

export default function RowControls({
  onMoveUp,
  onMoveDown,
  onRemove,
  canMoveUp,
  canMoveDown,
}: {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  return (
    <div className="flex justify-end gap-1.5">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={!canMoveUp}
        className="p-1.5 rounded-md border border-[#ede8e0] text-[#2d2d2d] disabled:opacity-30 hover:bg-white"
        aria-label="Move up"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={!canMoveDown}
        className="p-1.5 rounded-md border border-[#ede8e0] text-[#2d2d2d] disabled:opacity-30 hover:bg-white"
        aria-label="Move down"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Remove
      </button>
    </div>
  );
}
