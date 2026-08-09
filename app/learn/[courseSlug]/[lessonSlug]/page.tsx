import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { getStudentSession } from "@/lib/studentAuth";
import { prisma } from "@/lib/prisma";
import { courseDisplayTitle, getCourseBySlug, instructor as staticInstructor } from "@/lib/courses";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import BunnyPlayer from "@/components/BunnyPlayer";
import LessonSidebar from "@/components/LessonSidebar";
import LessonTabs from "@/components/lesson/LessonTabs";
import MarkCompleteButton from "@/components/lesson/MarkCompleteButton";
import type { ReviewItem } from "@/components/lesson/ReviewsPanel";
import type { QAQuestion } from "@/components/lesson/QAPanel";

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

  const lessonIndex = course.lessons.findIndex((l) => l.slug === lessonSlug);
  if (lessonIndex === -1) notFound();
  const lesson = course.lessons[lessonIndex];
  const prevLesson = lessonIndex > 0 ? course.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < course.lessons.length - 1 ? course.lessons[lessonIndex + 1] : null;

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

  const [reviews, comments, courseStatic] = await Promise.all([
    prisma.review.findMany({
      where: { courseId: course.id },
      include: { student: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.comment.findMany({
      where: { lessonId: lesson.id, parentId: null },
      include: {
        student: { select: { name: true } },
        replies: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    }),
    getCourseBySlug(courseSlug),
  ]);

  const reviewItems: ReviewItem[] = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    text: r.text,
    createdAt: r.createdAt.toISOString(),
    studentName: r.student.name,
    isMine: r.studentId === session.studentId,
  }));

  const questions: QAQuestion[] = comments.map((c) => ({
    id: c.id,
    text: c.text,
    createdAt: c.createdAt.toISOString(),
    studentName: c.student?.name ?? "Student",
    reply: c.replies[0]
      ? { id: c.replies[0].id, text: c.replies[0].text, createdAt: c.replies[0].createdAt.toISOString() }
      : null,
  }));

  const sidebarLessons = course.lessons.map((l) => ({
    slug: l.slug,
    title: l.title,
    duration: l.duration,
    isFreePreview: l.isFreePreview,
    isCompleted: completedIds.has(l.id),
  }));

  const instructorTabData = {
    name: course.instructorName || staticInstructor.name,
    role: staticInstructor.role,
    bio: course.instructorBio || courseStatic?.instructorNote || staticInstructor.bio,
    photo: course.instructorPhoto,
  };

  return (
    <div>
      <p className="text-sm text-[#6b6b6b] mb-1">
        <Link href="/learn" className="hover:text-[#1a3a1a]">
          My Courses
        </Link>
        <span className="mx-1.5">/</span>
        {courseDisplayTitle(course)}
      </p>

      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <p className="text-xs text-[#6b6b6b] mb-1">
            Lesson {lessonIndex + 1} of {course.lessons.length}
          </p>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#1a3a1a]">{lesson.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={prevLesson ? `/learn/${courseSlug}/${prevLesson.slug}` : "#"}
            aria-disabled={!prevLesson}
            className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-full border text-sm font-medium transition-colors ${
              prevLesson
                ? "border-[#ede8e0] text-[#2d2d2d] hover:border-[#2d5a2d] hover:text-[#2d5a2d]"
                : "border-[#ede8e0] text-[#c7c7c7] pointer-events-none"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </Link>
          <Link
            href={nextLesson ? `/learn/${courseSlug}/${nextLesson.slug}` : "#"}
            aria-disabled={!nextLesson}
            className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-full border text-sm font-medium transition-colors ${
              nextLesson
                ? "border-[#ede8e0] text-[#2d2d2d] hover:border-[#2d5a2d] hover:text-[#2d5a2d]"
                : "border-[#ede8e0] text-[#c7c7c7] pointer-events-none"
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Link>
          {hasAccess && <MarkCompleteButton lessonId={lesson.id} initialCompleted={completedIds.has(lesson.id)} />}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-5 sm:gap-6">
        <div className="space-y-5 min-w-0">
          {hasAccess ? (
            <BunnyPlayer
              libraryId={process.env.BUNNY_STREAM_LIBRARY_ID || ""}
              videoId={lesson.bunnyVideoId}
              lessonId={lesson.id}
              alreadyCompleted={completedIds.has(lesson.id)}
            />
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

          <LessonTabs
            lessonTitle={lesson.title}
            lessonDescription={lesson.description}
            courseHighlights={courseStatic?.highlights ?? []}
            courseFaq={courseStatic?.faq ?? []}
            instructor={instructorTabData}
            courseId={course.id}
            lessonId={lesson.id}
            reviews={reviewItems}
            canReview={isEnrolled}
            questions={questions}
            canPost={isEnrolled}
          />
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
