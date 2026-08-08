import Link from "next/link";
import AddStudentForm from "@/components/admin/AddStudentForm";

export default function NewStudentPage() {
  return (
    <div className="max-w-xl">
      <nav className="text-sm text-[#6b6b6b] mb-3">
        <Link href="/admin/dashboard/students" className="hover:text-[#1a3a1a]">
          Students
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-[#1a3a1a]">Add student</span>
      </nav>
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a3a1a] mb-2">
        Add a student
      </h1>
      <p className="text-sm text-[#6b6b6b] mb-6">
        Create the account after payment is confirmed. Once created, grant them access to their
        course from Enrollments.
      </p>
      <AddStudentForm />
    </div>
  );
}
