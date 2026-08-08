"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Trash2 } from "lucide-react";

type Enrollment = {
  id: string;
  email: string;
  studentName: string;
  courseTitle: string;
  createdAt: string;
};

export default function EnrollmentListAdmin() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/enrollments");
    if (res.ok) {
      const data = await res.json();
      setEnrollments(data.enrollments);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(enrollment: Enrollment) {
    if (!confirm(`Remove ${enrollment.email}'s access to this course? This cannot be undone.`)) {
      return;
    }
    setBusyId(enrollment.id);
    const res = await fetch(`/api/admin/enrollments/${enrollment.id}`, { method: "DELETE" });
    if (res.ok) setEnrollments((list) => list.filter((x) => x.id !== enrollment.id));
    setBusyId(null);
  }

  if (loading) {
    return <p className="text-[#2d2d2d]">Loading enrollments…</p>;
  }

  if (enrollments.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 bg-[#faf8f5] rounded-2xl border border-[#ede8e0] px-4">
        <p className="text-[#2d2d2d] mb-4">No enrollments granted yet.</p>
        <Link
          href="/admin/dashboard/enrollments/new"
          className="inline-flex px-6 py-3 rounded-full bg-[#e8745b] text-white font-medium hover:opacity-90"
        >
          Grant your first access
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {enrollments.map((enrollment) => (
        <article
          key={enrollment.id}
          className="bg-[#faf8f5] rounded-2xl border border-[#ede8e0]/80 p-4 sm:p-6 flex flex-col gap-3"
        >
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[#1a3a1a] break-all">
              {enrollment.studentName}
            </h2>
            <p className="text-sm text-[#6b6b6b] break-all">{enrollment.email}</p>
            <p className="text-sm text-[#2d2d2d] mt-1">{enrollment.courseTitle}</p>
            <p className="text-xs text-[#9caf88] mt-2">
              Granted {new Date(enrollment.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-2 border-t border-[#ede8e0]/80">
            <button
              type="button"
              onClick={() => handleDelete(enrollment)}
              disabled={busyId === enrollment.id}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              {busyId === enrollment.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" /> Remove access
                </>
              )}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
