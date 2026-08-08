"use client";

import { useState, type FormEvent } from "react";
import { Plus, Loader2 } from "lucide-react";
import RowControls from "./RowControls";

type LessonRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  bunnyVideoId: string;
  duration: string | null;
  orderNumber: number;
  isFreePreview: boolean;
};

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-[#ede8e0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5a2d]/30 text-sm";
const labelClass = "block text-xs font-medium text-[#1a3a1a] mb-1";

function emptyDraft() {
  return { title: "", slug: "", description: "", bunnyVideoId: "", duration: "", isFreePreview: false };
}

export default function LessonListAdmin({
  courseId,
  initialLessons,
}: {
  courseId: string;
  initialLessons: LessonRow[];
}) {
  const [lessons, setLessons] = useState<LessonRow[]>(initialLessons);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(emptyDraft());
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const res = await fetch(`/api/admin/courses/${courseId}/lessons`);
    if (res.ok) {
      const data = await res.json();
      setLessons(data.lessons);
    }
  }

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add lesson");
        return;
      }
      setDraft(emptyDraft());
      setAdding(false);
      await refresh();
    } catch {
      setError("Failed to add lesson");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(lesson: LessonRow) {
    if (!confirm(`Delete "${lesson.title}"? This cannot be undone.`)) return;
    setBusyId(lesson.id);
    const res = await fetch(`/api/admin/courses/${courseId}/lessons/${lesson.id}`, {
      method: "DELETE",
    });
    if (res.ok) setLessons((list) => list.filter((l) => l.id !== lesson.id));
    setBusyId(null);
  }

  async function handleMove(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= lessons.length) return;
    const copy = [...lessons];
    [copy[index], copy[j]] = [copy[j], copy[index]];
    setLessons(copy);

    setBusyId(copy[index].id);
    await fetch(`/api/admin/courses/${courseId}/lessons/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: copy.map((l) => l.id) }),
    });
    setBusyId(null);
  }

  async function handleTogglePreview(lesson: LessonRow) {
    setBusyId(lesson.id);
    const res = await fetch(`/api/admin/courses/${courseId}/lessons/${lesson.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFreePreview: !lesson.isFreePreview }),
    });
    if (res.ok) {
      setLessons((list) =>
        list.map((l) => (l.id === lesson.id ? { ...l, isFreePreview: !l.isFreePreview } : l)),
      );
    }
    setBusyId(null);
  }

  return (
    <section className="bg-[#faf8f5] rounded-2xl border border-[#ede8e0]/80 p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#1a3a1a]">Lessons</h2>
        <button
          type="button"
          onClick={() => setAdding((a) => !a)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2d5a2d] hover:text-[#1a3a1a]"
        >
          <Plus className="w-4 h-4" />
          Add lesson
        </button>
      </div>

      {lessons.length === 0 && !adding && (
        <p className="text-sm text-[#6b6b6b]">No lessons yet.</p>
      )}

      <div className="space-y-3">
        {lessons.map((lesson, i) => (
          <div key={lesson.id} className="bg-white border border-[#ede8e0] rounded-xl p-4 space-y-2">
            <RowControls
              onMoveUp={() => handleMove(i, -1)}
              onMoveDown={() => handleMove(i, 1)}
              onRemove={() => handleDelete(lesson)}
              canMoveUp={i > 0}
              canMoveDown={i < lessons.length - 1}
            />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-[#1a3a1a] truncate">{lesson.title}</p>
                <p className="text-xs text-[#6b6b6b] mt-0.5">
                  {lesson.duration || "—"} · video: {lesson.bunnyVideoId.slice(0, 24)}
                  {lesson.bunnyVideoId.length > 24 ? "…" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePreview(lesson)}
                disabled={busyId === lesson.id}
                className={`shrink-0 inline-flex items-center text-xs px-2.5 py-1 rounded-full border transition-colors disabled:opacity-60 ${
                  lesson.isFreePreview
                    ? "text-[#2d5a2d] bg-green-50 border-green-200"
                    : "text-[#6b6b6b] bg-[#f5f1eb] border-[#ede8e0]"
                }`}
              >
                {lesson.isFreePreview ? "Free preview" : "Locked"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {adding && (
        <form
          onSubmit={handleAdd}
          className="bg-white border border-[#ede8e0] rounded-xl p-4 space-y-3"
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Title</label>
              <input
                required
                autoFocus
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Slug (optional)</label>
              <input
                value={draft.slug}
                onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
                placeholder="auto-generated from title"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={2}
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              className={`${inputClass} resize-y`}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Bunny video ID</label>
              <input
                required
                value={draft.bunnyVideoId}
                onChange={(e) => setDraft((d) => ({ ...d, bunnyVideoId: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Duration</label>
              <input
                value={draft.duration}
                onChange={(e) => setDraft((d) => ({ ...d, duration: e.target.value }))}
                placeholder="6 min"
                className={inputClass}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-[#2d2d2d]">
            <input
              type="checkbox"
              checked={draft.isFreePreview}
              onChange={(e) => setDraft((d) => ({ ...d, isFreePreview: e.target.checked }))}
            />
            Free preview (visible without enrollment)
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2d5a2d] text-white text-sm font-medium hover:bg-[#1a3a1a] disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Add lesson
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-4 py-2 rounded-lg text-sm text-[#6b6b6b] hover:bg-[#f5f1eb]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
