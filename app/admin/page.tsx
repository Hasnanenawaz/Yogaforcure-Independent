import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata = {
  title: "Admin Login — Yoga for Cure",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ redirect?: string }> };

function safeRedirect(target: string | undefined): string | undefined {
  if (!target) return undefined;
  if (!target.startsWith("/") || target.startsWith("//")) return undefined;
  return target;
}

export default async function AdminPage({ searchParams }: Props) {
  const { redirect: redirectParam } = await searchParams;
  const redirectTo = safeRedirect(redirectParam);

  const session = await getSession();
  if (session) redirect(redirectTo || "/admin/dashboard");

  return (
    <div className="min-h-screen bg-[#f5f1eb] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#faf8f5] rounded-2xl shadow-lg border border-[#ede8e0]/80 p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#1a3a1a]">Admin Login</h1>
          <p className="text-[#2d2d2d] text-sm mt-2">Yoga for Cure — Blog dashboard</p>
        </div>
        <AdminLoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
