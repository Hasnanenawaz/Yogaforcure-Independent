import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata = {
  title: "Admin Login — Yoga for Cure",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getSession();
  if (session) redirect("/admin/dashboard");

  return (
    <div className="min-h-screen bg-[#f5f1eb] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#faf8f5] rounded-2xl shadow-lg border border-[#ede8e0]/80 p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#1a3a1a]">Admin Login</h1>
          <p className="text-[#2d2d2d] text-sm mt-2">Yoga for Cure — Blog dashboard</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
