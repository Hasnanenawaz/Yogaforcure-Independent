import Link from "next/link";
import { CircleDot, CheckCircle2, Clock } from "lucide-react";
import { getStudentSession } from "@/lib/studentAuth";
import { prisma } from "@/lib/prisma";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { courseDisplayTitle, parseDurationMinutes, instructor } from "@/lib/courses";

export default async function LearnDashboardPage() {
  const session = await getStudentSession();
  if (!session) return null;

  const [enrollments, completedProgress] = await Promise.all([
    prisma.enrollment.findMany({
      where: { studentId: session.studentId },
      orderBy: { createdAt: "desc" },
      include: { course: { include: { lessons: { orderBy: { orderNumber: "asc" } } } } },
    }),
    prisma.lessonProgress.findMany({
      where: { studentId: session.studentId, isCompleted: true },
      select: { lessonId: true },
    }),
  ]);
  const completedLessonIds = new Set(completedProgress.map((p) => p.lessonId));

  const allLessons = enrollments.flatMap((e) => e.course.lessons);
  const totalMinutes = allLessons
    .filter((l) => completedLessonIds.has(l.id))
    .reduce((sum, l) => sum + parseDurationMinutes(l.duration), 0);

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a3a1a] mb-2">
        Welcome, {session.name.split(" ")[0]}
      </h1>
      <p className="text-[#6b6b6b] mb-8">Pick up where you left off.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-2xl border border-[#ede8e0] p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#e8ede8] flex items-center justify-center shrink-0">
            <CircleDot className="w-5 h-5 text-[#2d5a2d]" />
          </div>
          <div>
            <p className="text-xl font-semibold text-[#1a3a1a]">{enrollments.length}</p>
            <p className="text-xs text-[#6b6b6b]">
              Course{enrollments.length === 1 ? "" : "s"} enrolled
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#ede8e0] p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#fbe3dc] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-[#e8745b]" />
          </div>
          <div>
            <p className="text-xl font-semibold text-[#1a3a1a]">{completedLessonIds.size}</p>
            <p className="text-xs text-[#6b6b6b]">Lessons complete</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#ede8e0] p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#f6edcf] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-[#c9a227]" />
          </div>
          <div>
            <p className="text-xl font-semibold text-[#1a3a1a]">{totalMinutes} min</p>
            <p className="text-xs text-[#6b6b6b]">Total practice time</p>
          </div>
        </div>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-14 sm:py-20 bg-[#faf8f5] rounded-2xl border border-[#ede8e0] px-4">
          <p className="text-[#1a3a1a] font-medium mb-2">You&apos;re not enrolled in any courses yet.</p>
          <p className="text-sm text-[#6b6b6b] mb-6">
            Reach out and we&apos;ll get you set up.
          </p>
          <Link
            href={getWhatsAppUrl("Hi, I'd like to enroll in a course.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-6 py-3 rounded-full bg-[#e8745b] text-white font-medium hover:opacity-90"
          >
            Ask us on WhatsApp
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {enrollments.map((enrollment) => {
            const course = enrollment.course;
            const lessons = course.lessons;
            const total = lessons.length;
            const completed = lessons.filter((l) => completedLessonIds.has(l.id)).length;
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
            const targetLesson =
              lessons.find((l) => !completedLessonIds.has(l.id)) ?? lessons[lessons.length - 1];

            return (
              <article
                key={enrollment.id}
                className="bg-[#faf8f5] rounded-2xl border border-[#ede8e0]/80 p-4 sm:p-5 flex flex-col gap-3"
              >
                <div className="flex items-center gap-4">
                  {course.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.thumbnailUrl}
                      alt=""
                      className="w-16 h-16 rounded-xl object-cover border border-[#ede8e0] shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-[#ede8e0] shrink-0" />
                  )}
                  <div className="min-w-0">
                    <h2 className="font-semibold text-[#1a3a1a] truncate">
                      {courseDisplayTitle(course)}
                    </h2>
                    <p className="text-xs text-[#6b6b6b] mt-1">
                      {total > 0 ? `${completed} of ${total} lessons complete` : "No lessons yet"}
                    </p>
                  </div>
                </div>

                {total > 0 && (
                  <div className="h-2 rounded-full bg-[#ede8e0] overflow-hidden">
                    <div
                      className="h-full bg-[#2d5a2d] rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                )}

                <Link
                  href={
                    targetLesson
                      ? `/learn/${course.slug}/${targetLesson.slug}`
                      : `/courses/${course.slug}`
                  }
                  className="mt-1 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#2d5a2d] text-white text-sm font-medium hover:bg-[#1a3a1a] transition-colors"
                >
                  Continue
                </Link>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-12 bg-gradient-to-br from-[#1a3a1a] via-[#2d5a2d] to-[#40916c] rounded-3xl p-7 sm:p-10 grid sm:grid-cols-[auto_1fr] gap-6 sm:gap-9 items-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#9caf88] to-[#f6edcf] border-2 border-white/25 flex items-center justify-center text-3xl font-bold text-[#1a3a1a] shrink-0 mx-auto sm:mx-0">
          {instructor.initial}
        </div>
        <div>
          <span className="inline-block bg-white/15 text-[#c9e4d4] text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full mb-3">
            Lead instructor
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">{instructor.name}</h2>
          <p className="text-white/80 text-sm leading-relaxed">{instructor.bio}</p>
        </div>
      </div>
    </div>
  );
}
