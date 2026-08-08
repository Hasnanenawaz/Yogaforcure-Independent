import { getStudentSession } from "@/lib/studentAuth";

export default async function LearnDashboardPage() {
  const session = await getStudentSession();

  return (
    <main className="min-h-screen bg-[#f5f1eb] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-[#1a3a1a]">
          Welcome, {session?.name}
        </h1>
        <p className="text-[#2d2d2d] mt-2">
          Your courses will show up here soon.
        </p>
      </div>
    </main>
  );
}
