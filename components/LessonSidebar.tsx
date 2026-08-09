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
  const total = lessons.length;
  const completed = lessons.filter((l) => l.isCompleted).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <aside className="bg-[#faf8f5] rounded-2xl border border-[#ede8e0]/80 h-fit overflow-hidden">
      <div className="p-4 border-b border-[#ede8e0]">
        <h2 className="text-sm font-semibold text-[#1a3a1a] mb-3">Course content</h2>
        <div className="flex items-center gap-2.5">
          <div className="flex-1 h-1.5 rounded-full bg-[#ede8e0] overflow-hidden">
            <div
              className="h-full bg-[#2d5a2d] rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-[#2d5a2d] shrink-0">
            {completed}/{total} done
          </span>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-1">
        {lessons.map((lesson, index) => {
          const unlocked = isEnrolled || lesson.isFreePreview;
          const isCurrent = lesson.slug === currentSlug;
          const lessonLabel = `Lesson ${index + 1}`;

          if (!unlocked) {
            return (
              <div
                key={lesson.slug}
                className="flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-[#9a9a9a]"
              >
                <Lock className="w-4 h-4 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-[#b3b3b3]">{lessonLabel}</p>
                  <p className="text-sm truncate">{lesson.title}</p>
                </div>
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
              <div className="min-w-0 flex-1">
                <p className={`text-xs ${isCurrent ? "text-white/70" : "text-[#9a9a9a]"}`}>
                  {lessonLabel}
                </p>
                <p className="truncate">{lesson.title}</p>
              </div>
              {lesson.duration && (
                <span className={`text-xs shrink-0 ${isCurrent ? "text-white/80" : "text-[#6b6b6b]"}`}>
                  {lesson.duration}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
