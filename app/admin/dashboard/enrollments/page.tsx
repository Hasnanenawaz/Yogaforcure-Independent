import Link from "next/link";
import { Plus } from "lucide-react";
import EnrollmentListAdmin from "@/components/admin/EnrollmentListAdmin";

export default function EnrollmentsPage() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a3a1a]">Enrollments</h1>
        <Link
          href="/admin/dashboard/enrollments/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#e8745b] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Grant new access
        </Link>
      </div>
      <EnrollmentListAdmin />
    </div>
  );
}
