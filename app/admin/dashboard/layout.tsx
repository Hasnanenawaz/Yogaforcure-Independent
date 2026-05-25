import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminDashboardShell from "@/components/admin/AdminDashboardShell";

export const metadata = {
  title: "Dashboard — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin");

  return (
    <AdminDashboardShell email={session.email}>{children}</AdminDashboardShell>
  );
}
