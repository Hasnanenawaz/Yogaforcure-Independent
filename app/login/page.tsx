import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/studentAuth";
import StudentLoginForm from "@/components/StudentLoginForm";

export const metadata = {
  title: "Log In — Yoga for Cure",
};

export default async function LoginPage() {
  const session = await getStudentSession();
  if (session) redirect("/learn");

  return (
    <div className="min-h-screen bg-[#f5f1eb] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#faf8f5] rounded-2xl shadow-lg border border-[#ede8e0]/80 p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#1a3a1a]">Log in</h1>
          <p className="text-[#2d2d2d] text-sm mt-2">Access your courses</p>
        </div>
        <StudentLoginForm />
      </div>
    </div>
  );
}
