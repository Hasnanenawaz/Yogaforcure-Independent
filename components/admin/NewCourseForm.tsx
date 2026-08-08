"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NewCourseForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), slug: slug.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create course.");
        return;
      }
      router.push(`/courses/${data.course.slug}/admin`);
    } catch {
      setError("Failed to create course.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#ede8e0] rounded-2xl p-6 sm:p-8 flex flex-col gap-5"
    >
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-[#1a3a1a] mb-1.5">
          Course title
        </label>
        <input
          id="title"
          type="text"
          required
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Morning Flow: 14 days to a stronger back"
          className="w-full px-4 py-2.5 rounded-lg border border-[#ede8e0] focus:outline-none focus:ring-2 focus:ring-[#9caf88]"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-[#1a3a1a] mb-1.5">
          URL slug (optional)
        </label>
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="morning-flow"
          className="w-full px-4 py-2.5 rounded-lg border border-[#ede8e0] focus:outline-none focus:ring-2 focus:ring-[#9caf88]"
        />
        <p className="text-xs text-[#6b6b6b] mt-1.5">
          Leave blank to generate one from the title. This becomes /courses/&lt;slug&gt;.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#e8745b] text-white font-semibold shadow-[0_8px_20px_rgba(232,116,91,0.32)] hover:shadow-[0_14px_28px_rgba(232,116,91,0.4)] transition-all disabled:opacity-60"
      >
        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
        Create course
      </button>
    </form>
  );
}
