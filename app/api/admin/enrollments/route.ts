import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function courseTitle(course: { title: string | null; data: unknown; slug: string }) {
  return course.title || (course.data as { title?: string } | null)?.title || course.slug;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.enrollment.findMany({
    include: { course: true, student: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const enrollments = rows.map((r) => ({
    id: r.id,
    email: r.student.email,
    studentName: r.student.name,
    courseId: r.courseId,
    courseTitle: courseTitle(r.course),
    createdAt: r.createdAt,
  }));

  return NextResponse.json({ enrollments });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const courseId = String(body.courseId || "").trim();

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 400 });
    }

    const student = await prisma.student.findUnique({ where: { email } });
    if (!student) {
      return NextResponse.json(
        { error: "No student account found with that email. Create the student first, then grant access." },
        { status: 400 },
      );
    }

    const existing = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: student.id, courseId } },
    });

    if (existing) {
      return NextResponse.json({ ok: true, alreadyOwned: true, enrollmentId: existing.id });
    }

    const created = await prisma.enrollment.create({
      data: { studentId: student.id, courseId },
    });

    return NextResponse.json({ ok: true, alreadyOwned: false, enrollmentId: created.id }, { status: 201 });
  } catch (error) {
    console.error("Grant enrollment error:", error);
    return NextResponse.json({ error: "Failed to grant access" }, { status: 500 });
  }
}
