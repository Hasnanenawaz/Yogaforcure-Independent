import Link from "next/link";
import { CircleDot, CheckCircle2, Clock, Sparkles, ArrowRight } from "lucide-react";
import { getStudentSession } from "@/lib/studentAuth";
import { prisma } from "@/lib/prisma";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import {
  courseDisplayTitle,
  parseDurationMinutes,
  courseCoverGradient,
  instructor,
} from "@/lib/courses";

const RING_RADIUS = 52;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

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
  const completedCount = allLessons.filter((l) => completedLessonIds.has(l.id)).length;
  const totalMinutes = allLessons
    .filter((l) => completedLessonIds.has(l.id))
    .reduce((sum, l) => sum + parseDurationMinutes(l.duration), 0);
  const overallPercent =
    allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;
  const ringOffset = RING_CIRCUMFERENCE * (1 - overallPercent / 100);

  return (
    <div>
      <span className="inline-flex items-center gap-1.5 bg-[#e4eee7] text-[#2d5a2d] text-[11px] font-semibold tracking-[0.15em] uppercase px-3 py-1 rounded-full mb-3">
        <Sparkles className="w-3 h-3" />
        Your practice
      </span>
      <h1 className="text-3xl sm:text-4xl font-bold text-[#1a3a1a] mb-1.5">
        Welcome back, {session.name.split(" ")[0]}
      </h1>
      <p className="text-[#6b6b6b] mb-8 sm:mb-10">Pick up where you left off.</p>

      <div className="bg-white rounded-3xl border border-[#ede8e0] p-6 sm:p-8 mb-10 flex flex-col sm:flex-row items-center gap-8 sm:gap-10">
        <div className="relative w-28 h-28 shrink-0">
          <svg viewBox="0 0 120 120" className="w-28 h-28 -rotate-90">
            <circle cx="60" cy="60" r={RING_RADIUS} fill="none" stroke="#ede8e0" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r={RING_RADIUS}
              fill="none"
              stroke="#2d5a2d"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={ringOffset}
              className="transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-[#1a3a1a]">{overallPercent}%</span>
            <span className="text-[10px] text-[#6b6b6b] uppercase tracking-wide">overall</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 w-full sm:border-l sm:border-[#ede8e0] sm:pl-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e8ede8] flex items-center justify-center shrink-0">
              <CircleDot className="w-4 h-4 text-[#2d5a2d]" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#1a3a1a] leading-none">{enrollments.length}</p>
              <p className="text-xs text-[#6b6b6b] mt-1">
                Course{enrollments.length === 1 ? "" : "s"} enrolled
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fbe3dc] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-[#e8745b]" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#1a3a1a] leading-none">{completedLessonIds.size}</p>
              <p className="text-xs text-[#6b6b6b] mt-1">Lessons complete</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f6edcf] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-[#c9a227]" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#1a3a1a] leading-none">{totalMinutes} min</p>
              <p className="text-xs text-[#6b6b6b] mt-1">Total practice time</p>
            </div>
          </div>
        </div>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-14 sm:py-20 bg-[#faf8f5] rounded-3xl border border-[#ede8e0] px-4">
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
        <>
          <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#6b6b6b] mb-4">
            Continue practicing
          </h2>
          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
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
                  className="group bg-white rounded-3xl border border-[#ede8e0] overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div
                    className="relative h-28 sm:h-32 flex items-end p-4"
                    style={{ background: courseCoverGradient(course.slug) }}
                  >
                    {course.thumbnailUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={course.thumbnailUrl}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
                    <span className="relative z-10 inline-block bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full">
                      {course.category || "On-demand course"}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#1a3a1a] truncate">
                        {courseDisplayTitle(course)}
                      </h3>
                      <p className="text-xs text-[#6b6b6b] mt-1">
                        {total > 0 ? `${completed} of ${total} lessons complete` : "No lessons yet"}
                      </p>
                    </div>

                    {total > 0 && (
                      <div className="flex items-center gap-2.5">
                        <div className="h-1.5 flex-1 rounded-full bg-[#ede8e0] overflow-hidden">
                          <div
                            className="h-full bg-[#2d5a2d] rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-medium text-[#6b6b6b] tabular-nums">
                          {percent}%
                        </span>
                      </div>
                    )}

                    <Link
                      href={
                        targetLesson
                          ? `/learn/${course.slug}/${targetLesson.slug}`
                          : `/courses/${course.slug}`
                      }
                      className="mt-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#2d5a2d] text-white text-sm font-medium hover:bg-[#1a3a1a] transition-colors"
                    >
                      Continue
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-12 relative overflow-hidden bg-gradient-to-br from-[#1a3a1a] via-[#2d5a2d] to-[#40916c] rounded-3xl p-7 sm:p-10">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 88% 12%, rgba(246,237,207,0.2) 0%, transparent 55%), radial-gradient(ellipse at 8% 95%, rgba(255,255,255,0.08) 0%, transparent 50%)",
          }}
        />
        <div className="relative grid sm:grid-cols-[auto_1fr] gap-6 sm:gap-9 items-center">
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
    </div>
  );
}
