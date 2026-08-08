"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ExternalLink, LayoutDashboard } from "lucide-react";

export default function CourseAdminHeader({
  email,
  slug,
  courseTitle,
}: {
  email: string;
  slug: string;
  courseTitle: string;
}) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <header className="bg-[#1a3a1a] text-[#faf8f5] sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <LayoutDashboard className="w-5 h-5 text-[#9caf88] shrink-0" />
          <span className="font-semibold text-sm sm:text-base truncate">
            Editing: {courseTitle}
          </span>
          <span className="text-[#9caf88] text-xs sm:text-sm truncate hidden sm:inline">
            {email}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={`/courses/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-[#2d5a2d] text-white text-sm font-medium hover:bg-[#9caf88] hover:text-[#1a3a1a] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View live page
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-[#9caf88]/40 text-sm hover:bg-[#2d5a2d] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="sr-only sm:not-sr-only sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
