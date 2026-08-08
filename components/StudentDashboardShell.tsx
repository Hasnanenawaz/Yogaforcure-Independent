"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Home } from "lucide-react";

export default function StudentDashboardShell({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/student/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      <header className="bg-[#faf8f5] border-b border-[#ede8e0] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <Link href="/learn" className="flex items-center gap-2 min-w-0">
            <Image
              src="/logo.webp"
              alt="Yoga for Cure Logo"
              width={36}
              height={36}
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0"
            />
            <span className="font-[family-name:var(--font-poppins)] font-bold text-[#1a3a1a] truncate">
              Yoga for Cure
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span className="hidden sm:inline text-sm text-[#6b6b6b] truncate max-w-[160px]">
              {name}
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-[#2d5a2d] hover:bg-[#e8ede8]/60 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Browse courses</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-[#6b6b6b] hover:bg-[#e8ede8]/60 hover:text-[#1a3a1a] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">{children}</main>
    </div>
  );
}
