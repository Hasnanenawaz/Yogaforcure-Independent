import Link from "next/link";
import { ExternalLink } from "lucide-react";

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  status: string;
  thumbnailUrl: string | null;
  lessonCount: number;
  enrollmentCount: number;
};

export default function CourseListAdmin({ courses }: { courses: CourseRow[] }) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 bg-[#faf8f5] rounded-2xl border border-[#ede8e0] px-4">
        <p className="text-[#2d2d2d] mb-4">No courses yet.</p>
        <Link
          href="/admin/dashboard/courses/new"
          className="inline-flex px-6 py-3 rounded-full bg-[#e8745b] text-white font-medium hover:opacity-90"
        >
          Create your first course
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <article
          key={course.id}
          className="bg-[#faf8f5] rounded-2xl border border-[#ede8e0]/80 p-4 sm:p-6 flex items-center gap-4"
        >
          {course.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.thumbnailUrl}
              alt=""
              className="w-16 h-16 rounded-xl object-cover border border-[#ede8e0] shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-[#ede8e0] shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-semibold text-[#1a3a1a] truncate">
                {course.title}
              </h2>
              <span
                className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full shrink-0 ${
                  course.status === "published"
                    ? "text-[#2d5a2d] bg-green-50"
                    : "text-[#6b6b6b] bg-[#ede8e0]"
                }`}
              >
                {course.status === "published" ? "Published" : "Draft"}
              </span>
            </div>
            <p className="text-sm text-[#6b6b6b] mt-1">
              {course.lessonCount} lesson{course.lessonCount === 1 ? "" : "s"} ·{" "}
              {course.enrollmentCount} enrolled
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/courses/${course.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-[#ede8e0] text-[#2d2d2d] hover:bg-white"
              aria-label="View live page"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            <Link
              href={`/courses/${course.slug}/admin`}
              className="inline-flex px-4 py-2 rounded-lg bg-[#2d5a2d] text-white text-sm font-medium hover:bg-[#1a3a1a] transition-colors"
            >
              Edit
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
