import Link from "next/link";
import { getStudentSession } from "@/lib/studentAuth";
import { prisma } from "@/lib/prisma";
import { getWhatsAppUrl } from "@/lib/whatsapp";

function courseTitle(course: { title: string | null; data: unknown; slug: string }) {
  return course.title || (course.data as { title?: string } | null)?.title || course.slug;
}

export default async function LearnDashboardPage() {
  const session = await getStudentSession();
  if (!session) return null;

  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: session.studentId },
    orderBy: { createdAt: "desc" },
    include: { course: { include: { _count: { select: { lessons: true } } } } },
  });

  const completedProgress = await prisma.lessonProgress.findMany({
    where: { studentId: session.studentId, isCompleted: true },
    include: { lesson: { select: { courseId: true } } },
  });
  const completedByCourse = new Map<string, number>();
  for (const p of completedProgress) {
    completedByCourse.set(p.lesson.courseId, (completedByCourse.get(p.lesson.courseId) ?? 0) + 1);
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a3a1a] mb-2">
        Welcome, {session.name.split(" ")[0]}
      </h1>
      <p className="text-[#6b6b6b] mb-8">Pick up where you left off.</p>

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
            const total = course._count.lessons;
            const completed = completedByCourse.get(course.id) ?? 0;
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

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
                      {courseTitle(course)}
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
                  href={`/courses/${course.slug}`}
                  className="mt-1 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#2d5a2d] text-white text-sm font-medium hover:bg-[#1a3a1a] transition-colors"
                >
                  Continue
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
