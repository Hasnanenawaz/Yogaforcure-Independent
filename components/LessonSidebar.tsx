import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";

type SidebarLesson = {
  slug: string;
  title: string;
  duration: string | null;
  isFreePreview: boolean;
  isCompleted: boolean;
};

export default function LessonSidebar({
  courseSlug,
  lessons,
  currentSlug,
  isEnrolled,
}: {
  courseSlug: string;
  lessons: SidebarLesson[];
  currentSlug: string;
  isEnrolled: boolean;
}) {
  return (
    <aside className="bg-[#faf8f5] rounded-2xl border border-[#ede8e0]/80 p-3 sm:p-4 space-y-1 h-fit">
      <h2 className="text-sm font-semibold text-[#1a3a1a] px-2 py-1.5">Lessons</h2>
      {lessons.map((lesson) => {
        const unlocked = isEnrolled || lesson.isFreePreview;
        const isCurrent = lesson.slug === currentSlug;

        if (!unlocked) {
          return (
            <div
              key={lesson.slug}
              className="flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-[#9a9a9a]"
            >
              <Lock className="w-4 h-4 shrink-0" />
              <span className="text-sm truncate">{lesson.title}</span>
            </div>
          );
        }

        return (
          <Link
            key={lesson.slug}
            href={`/learn/${courseSlug}/${lesson.slug}`}
            className={`flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-sm transition-colors ${
              isCurrent
                ? "bg-[#2d5a2d] text-white"
                : "text-[#2d2d2d] hover:bg-[#e8ede8]/60"
            }`}
          >
            {lesson.isCompleted ? (
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${isCurrent ? "text-white" : "text-[#2d5a2d]"}`}
              />
            ) : (
              <PlayCircle
                className={`w-4 h-4 shrink-0 ${isCurrent ? "text-white" : "text-[#9caf88]"}`}
              />
            )}
            <span className="truncate flex-1">{lesson.title}</span>
            {lesson.duration && (
              <span className={`text-xs shrink-0 ${isCurrent ? "text-white/80" : "text-[#6b6b6b]"}`}>
                {lesson.duration}
              </span>
            )}
          </Link>
        );
      })}
    </aside>
  );
}
