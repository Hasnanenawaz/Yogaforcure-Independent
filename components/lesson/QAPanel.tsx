"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type QAReply = {
  id: string;
  text: string;
  createdAt: string;
};

export type QAQuestion = {
  id: string;
  text: string;
  createdAt: string;
  studentName: string;
  reply: QAReply | null;
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

export default function QAPanel({
  lessonId,
  questions,
  canPost,
}: {
  lessonId: string;
  questions: QAQuestion[];
  canPost: boolean;
}) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!text.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/student/lessons/${lessonId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to post question");
        return;
      }
      setText("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {canPost ? (
        <div className="bg-white border border-[#ede8e0] rounded-2xl p-5 sm:p-6 mb-7">
          <h3 className="text-sm font-semibold text-[#1a3a1a] mb-3">Ask a question about this lesson</h3>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Something unclear? Ask here and Neha or a student will answer."
            className="w-full border border-[#ede8e0] rounded-xl px-4 py-3 text-sm text-[#2d2d2d] bg-[#faf8f5] resize-y min-h-[90px] focus:outline-none focus:border-[#2d5a2d]"
          />
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            <span className="text-xs text-[#6b6b6b]">
              Questions are visible to all enrolled students and to Neha.
            </span>
            <button
              type="button"
              onClick={submit}
              disabled={busy || !text.trim()}
              className="inline-flex px-5 py-2.5 rounded-full bg-[#2d5a2d] text-white text-sm font-medium hover:bg-[#1a3a1a] transition-colors disabled:opacity-60"
            >
              {busy ? "Posting..." : "Post question"}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#faf8f5] border border-[#ede8e0] rounded-2xl p-5 text-sm text-[#6b6b6b] mb-7">
          Enroll in this course to ask a question.
        </div>
      )}

      {questions.length === 0 ? (
        <p className="text-sm text-[#6b6b6b]">No questions yet on this lesson.</p>
      ) : (
        <div className="divide-y divide-[#ede8e0]">
          {questions.map((q) => (
            <div key={q.id} className="py-5 first:pt-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-[#e8ede8] text-[#2d5a2d] flex items-center justify-center text-xs font-semibold shrink-0">
                  {initials(q.studentName)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a3a1a]">{q.studentName}</p>
                  <p className="text-xs text-[#6b6b6b]">{timeAgo(q.createdAt)}</p>
                </div>
              </div>
              <p className="text-sm text-[#2d2d2d] leading-relaxed pl-12">{q.text}</p>

              {q.reply && (
                <div className="ml-12 mt-3 border-l-2 border-[#9caf88] pl-4">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-8 h-8 rounded-full bg-[#1a3a1a] text-white flex items-center justify-center text-xs font-semibold shrink-0">
                      N
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2d5a2d]">Neha (Instructor)</p>
                      <p className="text-xs text-[#6b6b6b]">{timeAgo(q.reply.createdAt)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#2d2d2d] leading-relaxed">{q.reply.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
