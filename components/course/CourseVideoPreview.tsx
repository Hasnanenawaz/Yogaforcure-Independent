"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export default function CourseVideoPreview({
  gradient,
  instructorLine,
  lengthLabel,
}: {
  gradient: string;
  instructorLine: string;
  lengthLabel: string;
}) {
  const [played, setPlayed] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setPlayed(true)}
      aria-label="Play the course introduction video"
      className="group relative flex w-full aspect-video items-center justify-center overflow-hidden rounded-[20px] border border-[#ede8e0] shadow-[0_12px_34px_rgba(27,67,50,0.10)] transition-transform duration-300 hover:-translate-y-1"
      style={{ background: gradient }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.12),transparent_55%)]" />

      {played ? (
        <div className="relative z-10 flex flex-col items-center gap-2 px-6 text-center text-white">
          <p className="font-[family-name:var(--font-poppins)] font-semibold">
            Preview coming soon
          </p>
          <p className="max-w-xs text-sm text-white/75">
            We&apos;re putting the finishing touches on this video. Message us
            on WhatsApp if you&apos;d like a sneak peek in the meantime.
          </p>
        </div>
      ) : (
        <>
          <span className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-[#e8745b] text-white shadow-[0_14px_40px_rgba(232,116,91,0.5)] transition-transform duration-300 group-hover:scale-105">
            <Play className="ml-1 h-7 w-7 fill-current" />
          </span>
          <div className="absolute bottom-6 left-6 z-10 text-left text-white/90">
            <div className="font-[family-name:var(--font-poppins)] font-semibold">
              {instructorLine}
            </div>
            <div className="text-sm text-white/70">{lengthLabel}</div>
          </div>
        </>
      )}
    </button>
  );
}
