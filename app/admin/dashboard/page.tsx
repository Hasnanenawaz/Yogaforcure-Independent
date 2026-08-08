import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getStats() {
  const [
    studentsTotal,
    studentsActive,
    coursesTotal,
    coursesPublished,
    enrollmentsTotal,
    lessonsTotal,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.student.count({ where: { isActive: true } }),
    prisma.course.count(),
    prisma.course.count({ where: { status: "published" } }),
    prisma.enrollment.count(),
    prisma.lesson.count(),
  ]);

  return {
    studentsTotal,
    studentsActive,
    coursesTotal,
    coursesPublished,
    enrollmentsTotal,
    lessonsTotal,
  };
}

function StatCard({
  label,
  value,
  sub,
  href,
}: {
  label: string;
  value: number;
  sub?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-[#faf8f5] rounded-2xl border border-[#ede8e0]/80 p-5 sm:p-6 hover:border-[#9caf88] transition-colors"
    >
      <p className="text-sm font-medium text-[#6b6b6b]">{label}</p>
      <p className="text-3xl font-semibold text-[#1a3a1a] mt-2">{value}</p>
      {sub && <p className="text-xs text-[#9caf88] mt-1">{sub}</p>}
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a3a1a] mb-6">
        Overview
      </h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Students"
          value={stats.studentsTotal}
          sub={`${stats.studentsActive} active`}
          href="/admin/dashboard/students"
        />
        <StatCard
          label="Courses"
          value={stats.coursesTotal}
          sub={`${stats.coursesPublished} published`}
          href="/admin/dashboard/courses"
        />
        <StatCard
          label="Enrollments"
          value={stats.enrollmentsTotal}
          sub="lifetime access grants"
          href="/admin/dashboard/enrollments"
        />
        <StatCard
          label="Lessons"
          value={stats.lessonsTotal}
          sub="across all courses"
          href="/admin/dashboard/courses"
        />
      </div>
    </div>
  );
}
