import Link from "next/link";
import { prisma } from "@/lib/prisma";
import GrantEnrollmentForm from "@/components/admin/GrantEnrollmentForm";

export default async function NewEnrollmentPage() {
  const rows = await prisma.course.findMany({ orderBy: { createdAt: "asc" } });
  const courses = rows.map((r) => ({
    id: r.id,
    title: (r.data as { title?: string })?.title || r.slug,
  }));

  return (
    <div className="max-w-xl">
      <nav className="text-sm text-[#6b6b6b] mb-3">
        <Link href="/admin/dashboard/enrollments" className="hover:text-[#1a3a1a]">
          Enrollments
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-[#1a3a1a]">Grant new access</span>
      </nav>
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a3a1a] mb-2">
        Grant course access
      </h1>
      <p className="text-sm text-[#6b6b6b] mb-1">
        Use this after a buyer has paid over UPI in WhatsApp. This records the enrollment for your
        own reference. Course delivery is manual today, so tell the buyer directly once you&apos;ve
        recorded it here.
      </p>
      {process.env.NEXT_PUBLIC_UPI_ID && (
        <p className="text-xs text-[#9caf88] mb-6">
          Your UPI ID to share with buyers: {process.env.NEXT_PUBLIC_UPI_ID}
        </p>
      )}
      {!process.env.NEXT_PUBLIC_UPI_ID && <div className="mb-6" />}
      <GrantEnrollmentForm courses={courses} />
    </div>
  );
}
