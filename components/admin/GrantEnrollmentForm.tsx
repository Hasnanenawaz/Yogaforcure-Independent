"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

type CourseOption = { id: string; title: string };

export default function GrantEnrollmentForm({ courses }: { courses: CourseOption[] }) {
  const [email, setEmail] = useState("");
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ email: string; alreadyOwned: boolean } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !courseId) {
      setError("Email and course are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), courseId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to grant access.");
        return;
      }
      setResult({ email: email.trim(), alreadyOwned: Boolean(data.alreadyOwned) });
    } catch {
      setError("Failed to grant access.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setEmail("");
    setResult(null);
    setError(null);
  }

  if (result) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-[#2d5a2d] shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold text-[#1a3a1a] mb-1">Access recorded</h2>
            <p className="text-sm text-[#2d2d2d]">
              {result.alreadyOwned
                ? `${result.email} already had access to this course.`
                : `Access granted for ${result.email}. Let them know on WhatsApp that they're in.`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex px-5 py-2.5 rounded-full border border-[#2d5a2d] text-[#2d5a2d] text-sm font-medium hover:bg-[#2d5a2d] hover:text-white transition-colors"
        >
          Grant another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#ede8e0] rounded-2xl p-6 sm:p-8 flex flex-col gap-5"
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#1a3a1a] mb-1.5">
          Student email address
        </label>
        <input
          id="email"
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="buyer@example.com"
          className="w-full px-4 py-2.5 rounded-lg border border-[#ede8e0] focus:outline-none focus:ring-2 focus:ring-[#9caf88]"
        />
        <p className="text-xs text-[#6b6b6b] mt-1.5">
          The student account must already exist. Create it from Students first if it doesn&apos;t.
        </p>
      </div>

      <div>
        <label htmlFor="course" className="block text-sm font-medium text-[#1a3a1a] mb-1.5">
          Course
        </label>
        <select
          id="course"
          required
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-[#ede8e0] focus:outline-none focus:ring-2 focus:ring-[#9caf88] bg-white"
        >
          {courses.length === 0 && <option value="">No courses found</option>}
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting || courses.length === 0}
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#e8745b] text-white font-semibold shadow-[0_8px_20px_rgba(232,116,91,0.32)] hover:shadow-[0_14px_28px_rgba(232,116,91,0.4)] transition-all disabled:opacity-60"
      >
        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
        Grant access
      </button>
    </form>
  );
}
