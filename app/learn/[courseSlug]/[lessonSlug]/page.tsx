import { notFound } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";
import { getStudentSession } from "@/lib/studentAuth";
import { prisma } from "@/lib/prisma";
import { courseDisplayTitle } from "@/lib/courses";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import BunnyPlayer from "@/components/BunnyPlayer";
import LessonSidebar from "@/components/LessonSidebar";

type Props = { params: Promise<{ courseSlug: string; lessonSlug: string }> };

export default async function LessonPlayerPage({ params }: Props) {
  const { courseSlug, lessonSlug } = await params;
  const session = await getStudentSession();
  if (!session) return null;

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: { lessons: { orderBy: { orderNumber: "asc" } } },
  });
  if (!course) notFound();

  const lesson = course.lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId: session.studentId, courseId: course.id } },
  });
  const isEnrolled = Boolean(enrollment);

  const progress = await prisma.lessonProgress.findMany({
    where: {
      studentId: session.studentId,
      lessonId: { in: course.lessons.map((l) => l.id) },
      isCompleted: true,
    },
    select: { lessonId: true },
  });
  const completedIds = new Set(progress.map((p) => p.lessonId));

  const hasAccess = isEnrolled || lesson.isFreePreview;

  const sidebarLessons = course.lessons.map((l) => ({
    slug: l.slug,
    title: l.title,
    duration: l.duration,
    isFreePreview: l.isFreePreview,
    isCompleted: completedIds.has(l.id),
  }));

  return (
    <div>
      <p className="text-sm text-[#6b6b6b] mb-1">
        <Link href="/learn" className="hover:text-[#1a3a1a]">
          My Courses
        </Link>
        <span className="mx-1.5">/</span>
        {courseDisplayTitle(course)}
      </p>
      <h1 className="text-xl sm:text-2xl font-semibold text-[#1a3a1a] mb-6">{lesson.title}</h1>

      <div className="grid lg:grid-cols-[1fr_280px] gap-5 sm:gap-6">
        <div className="space-y-4">
          {hasAccess ? (
            <>
              <BunnyPlayer
                libraryId={process.env.BUNNY_STREAM_LIBRARY_ID || ""}
                videoId={lesson.bunnyVideoId}
                lessonId={lesson.id}
                alreadyCompleted={completedIds.has(lesson.id)}
              />
              {lesson.description && (
                <p className="text-[#2d2d2d] leading-relaxed">{lesson.description}</p>
              )}
            </>
          ) : (
            <div className="aspect-video w-full rounded-2xl bg-[#faf8f5] border border-[#ede8e0] flex flex-col items-center justify-center text-center px-6 gap-3">
              <Lock className="w-8 h-8 text-[#9caf88]" />
              <p className="font-semibold text-[#1a3a1a]">This lesson requires enrollment</p>
              <p className="text-sm text-[#6b6b6b] max-w-xs">
                Reach out and we&apos;ll get you set up with full access to this course.
              </p>
              <Link
                href={getWhatsAppUrl(`Hi, I'd like to enroll in ${courseDisplayTitle(course)}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-5 py-2.5 rounded-full bg-[#e8745b] text-white text-sm font-medium hover:opacity-90"
              >
                Ask us on WhatsApp
              </Link>
            </div>
          )}
        </div>

        <LessonSidebar
          courseSlug={courseSlug}
          lessons={sidebarLessons}
          currentSlug={lessonSlug}
          isEnrolled={isEnrolled}
        />
      </div>
    </div>
  );
}
