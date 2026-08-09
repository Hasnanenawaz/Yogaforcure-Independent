"use client";

import { Star } from "lucide-react";

export function StarRatingDisplay({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "lg";
}) {
  const dimension = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${dimension} ${n <= Math.round(rating) ? "fill-[#c9a227] text-[#c9a227]" : "text-[#d8d2c4]"}`}
        />
      ))}
    </div>
  );
}

export function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="p-0.5"
          aria-label={`Rate ${n} out of 5`}
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              n <= value ? "fill-[#c9a227] text-[#c9a227]" : "text-[#d8d2c4] hover:text-[#c9a227]"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
