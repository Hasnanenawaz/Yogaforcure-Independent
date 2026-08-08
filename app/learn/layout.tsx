import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/studentAuth";

export const metadata = {
  title: "My Courses — Yoga for Cure",
  robots: { index: false, follow: false },
};

export default async function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getStudentSession();
  if (!session) redirect("/login");

  return <>{children}</>;
}
