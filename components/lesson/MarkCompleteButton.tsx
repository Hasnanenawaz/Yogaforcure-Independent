"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function MarkCompleteButton({
  lessonId,
  initialCompleted,
}: {
  lessonId: string;
  initialCompleted: boolean;
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const next = !completed;
    try {
      const res = await fetch(`/api/student/lessons/${lessonId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: next }),
      });
      if (res.ok) {
        setCompleted(next);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border transition-colors disabled:opacity-60 ${
        completed
          ? "bg-[#2d5a2d] border-[#2d5a2d] text-white"
          : "border-[#ede8e0] text-[#6b6b6b] hover:border-[#2d5a2d] hover:text-[#2d5a2d]"
      }`}
    >
      <Check className="w-4 h-4" />
      {completed ? "Completed" : "Mark complete"}
    </button>
  );
}
