import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emptyCourseData, type Course } from "@/lib/courses";
import CourseAdminHeader from "@/components/admin/CourseAdminHeader";
import CourseAdminForm from "@/components/admin/CourseAdminForm";
import CourseSettingsForm from "@/components/admin/CourseSettingsForm";
import LessonListAdmin from "@/components/admin/LessonListAdmin";

export const metadata = {
  title: "Course Admin — Yoga for Cure",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ slug: string }> };

export default async function CourseAdminPage({ params }: Props) {
  const { slug } = await params;
  const session = await getSession();
  if (!session) redirect(`/admin?redirect=${encodeURIComponent(`/courses/${slug}/admin`)}`);

  const row = await prisma.course.findUnique({
    where: { slug },
    include: { lessons: { orderBy: { orderNumber: "asc" } } },
  });
  if (!row) notFound();

  const course = (row.data as unknown as Course) ?? emptyCourseData(row.slug, row.title || row.slug);

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      <CourseAdminHeader email={session.email} slug={slug} courseTitle={row.title || course.title} />
      <main className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-5 sm:space-y-6">
        <CourseSettingsForm
          initial={{
            id: row.id,
            thumbnailUrl: row.thumbnailUrl || "",
            instructorName: row.instructorName,
            instructorBio: row.instructorBio || "",
            instructorPhoto: row.instructorPhoto || "",
            category: row.category || "",
            difficulty: row.difficulty || "",
            durationLabel: row.durationLabel || "",
            status: row.status,
          }}
        />
        <LessonListAdmin courseId={row.id} initialLessons={row.lessons} />
        <CourseAdminForm slug={slug} initial={course} />
      </main>
    </div>
  );
}
