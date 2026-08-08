import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCourseBySlug } from "@/lib/courses";
import CourseAdminHeader from "@/components/admin/CourseAdminHeader";
import CourseAdminForm from "@/components/admin/CourseAdminForm";

export const metadata = {
  title: "Course Admin — Yoga for Cure",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ slug: string }> };

export default async function CourseAdminPage({ params }: Props) {
  const { slug } = await params;
  const session = await getSession();
  if (!session) redirect(`/admin?redirect=${encodeURIComponent(`/courses/${slug}/admin`)}`);

  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      <CourseAdminHeader email={session.email} slug={slug} courseTitle={course.title} />
      <main className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
        <CourseAdminForm slug={slug} initial={course} />
      </main>
    </div>
  );
}
