"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";

type Reply = { id: string; text: string; createdAt: string; admin: { email: string } | null };

type CommentRow = {
  id: string;
  text: string;
  createdAt: string;
  student: { name: string; email: string } | null;
  lesson: { title: string; course: { slug: string; title: string | null; data: unknown } };
  replies: Reply[];
};

function courseTitle(course: CommentRow["lesson"]["course"]) {
  return course.title || (course.data as { title?: string } | null)?.title || course.slug;
}

export default function CommentsInbox() {
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [onlyUnanswered, setOnlyUnanswered] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/comments${onlyUnanswered ? "?answered=false" : ""}`);
    if (res.ok) {
      const data = await res.json();
      setComments(data.comments);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyUnanswered]);

  async function handleReply(comment: CommentRow) {
    const text = (replyDrafts[comment.id] || "").trim();
    if (!text) return;
    setBusyId(comment.id);
    const res = await fetch(`/api/admin/comments/${comment.id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      setReplyDrafts((d) => ({ ...d, [comment.id]: "" }));
      await load();
    }
    setBusyId(null);
  }

  async function handleDelete(comment: CommentRow) {
    if (!confirm("Delete this question and any reply? This cannot be undone.")) return;
    setBusyId(comment.id);
    const res = await fetch(`/api/admin/comments/${comment.id}`, { method: "DELETE" });
    if (res.ok) setComments((list) => list.filter((c) => c.id !== comment.id));
    setBusyId(null);
  }

  if (loading) return <p className="text-[#2d2d2d]">Loading questions…</p>;

  return (
    <div>
      <label className="inline-flex items-center gap-2 text-sm text-[#2d2d2d] mb-5">
        <input
          type="checkbox"
          checked={onlyUnanswered}
          onChange={(e) => setOnlyUnanswered(e.target.checked)}
        />
        Show unanswered only
      </label>

      {comments.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-[#faf8f5] rounded-2xl border border-[#ede8e0] px-4">
          <p className="text-[#2d2d2d]">No questions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <article
              key={c.id}
              className="bg-[#faf8f5] rounded-2xl border border-[#ede8e0]/80 p-4 sm:p-6 flex flex-col gap-3"
            >
              <div>
                <p className="text-xs text-[#9caf88] mb-1">
                  {courseTitle(c.lesson.course)} — {c.lesson.title}
                </p>
                <h2 className="text-sm font-semibold text-[#1a3a1a]">
                  {c.student?.name ?? "Student"}{" "}
                  <span className="font-normal text-[#6b6b6b]">
                    · {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </h2>
                <p className="text-sm text-[#2d2d2d] mt-1.5">{c.text}</p>
              </div>

              {c.replies.length > 0 && (
                <div className="border-l-2 border-[#9caf88] pl-4 ml-1">
                  {c.replies.map((r) => (
                    <p key={r.id} className="text-sm text-[#2d2d2d]">
                      <span className="font-semibold text-[#2d5a2d]">Neha (you): </span>
                      {r.text}
                    </p>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#ede8e0]/80">
                {c.replies.length === 0 && (
                  <>
                    <input
                      type="text"
                      value={replyDrafts[c.id] || ""}
                      onChange={(e) => setReplyDrafts((d) => ({ ...d, [c.id]: e.target.value }))}
                      placeholder="Write a reply…"
                      className="flex-1 border border-[#ede8e0] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2d5a2d]"
                    />
                    <button
                      type="button"
                      onClick={() => handleReply(c)}
                      disabled={busyId === c.id || !(replyDrafts[c.id] || "").trim()}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg bg-[#2d5a2d] text-white hover:bg-[#1a3a1a] disabled:opacity-60"
                    >
                      {busyId === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reply"}
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(c)}
                  disabled={busyId === c.id}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
