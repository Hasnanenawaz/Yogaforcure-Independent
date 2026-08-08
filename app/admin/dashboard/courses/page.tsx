import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import CourseListAdmin from "@/components/admin/CourseListAdmin";

export default async function AdminCoursesPage() {
  const rows = await prisma.course.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { lessons: true, enrollments: true } } },
  });

  const courses = rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title || (row.data as { title?: string } | null)?.title || row.slug,
    status: row.status,
    thumbnailUrl: row.thumbnailUrl,
    lessonCount: row._count.lessons,
    enrollmentCount: row._count.enrollments,
  }));

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a3a1a]">Courses</h1>
        <Link
          href="/admin/dashboard/courses/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2d5a2d] text-white text-sm font-medium hover:bg-[#1a3a1a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New course
        </Link>
      </div>
      <CourseListAdmin courses={courses} />
    </div>
  );
}
