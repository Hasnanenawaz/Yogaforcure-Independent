import Link from "next/link";
import NewCourseForm from "@/components/admin/NewCourseForm";

export default function NewCoursePage() {
  return (
    <div className="max-w-xl">
      <nav className="text-sm text-[#6b6b6b] mb-3">
        <Link href="/admin/dashboard/courses" className="hover:text-[#1a3a1a]">
          Courses
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-[#1a3a1a]">New course</span>
      </nav>
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a3a1a] mb-2">
        Create a course
      </h1>
      <p className="text-sm text-[#6b6b6b] mb-6">
        Just the basics for now — you&apos;ll fill in pricing, curriculum, lessons, and everything
        else on the next screen.
      </p>
      <NewCourseForm />
    </div>
  );
}
