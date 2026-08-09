"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StarRatingDisplay, StarRatingInput } from "@/components/StarRating";

export type ReviewItem = {
  id: string;
  rating: number;
  text: string | null;
  createdAt: string;
  studentName: string;
  isMine: boolean;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export default function ReviewsPanel({
  courseId,
  reviews,
  canReview,
}: {
  courseId: string;
  reviews: ReviewItem[];
  canReview: boolean;
}) {
  const router = useRouter();
  const mine = reviews.find((r) => r.isMine) || null;
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(mine?.rating ?? 0);
  const [text, setText] = useState(mine?.text ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const count = reviews.length;
  const average = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const n = reviews.filter((r) => r.rating === star).length;
    return { star, pct: count > 0 ? Math.round((n / count) * 100) : 0 };
  });

  async function submit() {
    if (rating < 1) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/student/courses/${courseId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save review");
        return;
      }
      setShowForm(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="grid sm:grid-cols-[auto_1fr] gap-6 sm:gap-8 items-center bg-[#f5f1eb] rounded-2xl p-6 mb-7">
        <div className="text-center">
          <div className="text-4xl font-bold text-[#1a3a1a] font-[family-name:var(--font-poppins)]">
            {count > 0 ? average.toFixed(1) : "—"}
          </div>
          <div className="my-1.5 flex justify-center">
            <StarRatingDisplay rating={average} size="lg" />
          </div>
          <div className="text-xs text-[#6b6b6b]">
            {count} review{count === 1 ? "" : "s"}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {breakdown.map(({ star, pct }) => (
            <div key={star} className="flex items-center gap-2.5 text-xs text-[#6b6b6b]">
              <span className="w-10 shrink-0">{star} star</span>
              <div className="flex-1 h-2 rounded-full bg-[#ede8e0] overflow-hidden">
                <div className="h-full bg-[#c9a227] rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-9 text-right shrink-0">{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {canReview && (
        <div className="bg-white border border-[#ede8e0] rounded-2xl p-5 sm:p-6 mb-7">
          {!showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex px-5 py-2.5 rounded-full bg-[#2d5a2d] text-white text-sm font-medium hover:bg-[#1a3a1a] transition-colors"
            >
              {mine ? "Update your review" : "Write a review"}
            </button>
          ) : (
            <div>
              <h3 className="text-sm font-semibold text-[#1a3a1a] mb-3">
                {mine ? "Update your review" : "Rate this course"}
              </h3>
              <StarRatingInput value={rating} onChange={setRating} />
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share how this course has helped you (optional)"
                className="w-full mt-3 border border-[#ede8e0] rounded-xl px-4 py-3 text-sm text-[#2d2d2d] bg-[#faf8f5] resize-y min-h-[80px] focus:outline-none focus:border-[#2d5a2d]"
              />
              {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
              <div className="flex items-center gap-3 mt-3">
                <button
                  type="button"
                  onClick={submit}
                  disabled={busy || rating < 1}
                  className="inline-flex px-5 py-2.5 rounded-full bg-[#2d5a2d] text-white text-sm font-medium hover:bg-[#1a3a1a] transition-colors disabled:opacity-60"
                >
                  {busy ? "Saving..." : "Submit review"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-sm text-[#6b6b6b] hover:text-[#1a3a1a]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-[#6b6b6b]">No reviews yet for this course.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white border border-[#ede8e0] rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#2d5a2d] text-white flex items-center justify-center text-xs font-semibold shrink-0">
                    {initials(r.studentName)}
                  </div>
                  <p className="text-sm font-semibold text-[#1a3a1a]">
                    {r.studentName}
                    {r.isMine && <span className="text-xs font-normal text-[#6b6b6b]"> (you)</span>}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <StarRatingDisplay rating={r.rating} />
                  <p className="text-xs text-[#6b6b6b] mt-1">{timeAgo(r.createdAt)}</p>
                </div>
              </div>
              {r.text && <p className="text-sm text-[#2d2d2d] leading-relaxed">{r.text}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
