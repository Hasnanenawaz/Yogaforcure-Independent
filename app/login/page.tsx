import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getStudentSession } from "@/lib/studentAuth";
import StudentLoginForm from "@/components/StudentLoginForm";

export const metadata = {
  title: "Log In — Yoga for Cure",
};

export default async function LoginPage() {
  const session = await getStudentSession();
  if (session) redirect("/learn");

  return (
    <div className="min-h-screen bg-[#f5f1eb] flex flex-col items-center justify-center px-4 py-12">
      <Link
        href="/"
        className="flex items-center gap-2 mb-8 group"
        aria-label="Yoga for Cure by Neha"
      >
        <Image
          src="/logo.webp"
          alt="Yoga for Cure Logo"
          width={40}
          height={40}
          className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
        />
        <span className="font-[family-name:var(--font-poppins)] text-lg sm:text-xl font-bold text-[#1a3a1a] group-hover:text-[#2d5a2d] transition-colors">
          Yoga for Cure
        </span>
      </Link>

      <div className="w-full max-w-md bg-[#faf8f5] rounded-2xl shadow-lg border border-[#ede8e0]/80 p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#1a3a1a]">Log in</h1>
          <p className="text-[#2d2d2d] text-sm mt-2">Access your courses</p>
        </div>
        <StudentLoginForm />
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-1.5 mt-6 text-sm text-[#6b6b6b] hover:text-[#1a3a1a] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>
    </div>
  );
}
