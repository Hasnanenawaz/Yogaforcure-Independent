import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/studentAuth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ courseId: string }> };

export async function POST(request: Request, context: RouteContext) {
  const session = await requireStudent();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await context.params;

  try {
    const body = await request.json();
    const rating = Number(body.rating);
    const text = body.text ? String(body.text).trim() : null;
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: session.studentId, courseId } },
    });
    if (!enrollment) {
      return NextResponse.json({ error: "Enroll in this course to leave a review" }, { status: 403 });
    }

    const review = await prisma.review.upsert({
      where: { studentId_courseId: { studentId: session.studentId, courseId } },
      update: { rating, text },
      create: { rating, text, studentId: session.studentId, courseId },
    });

    return NextResponse.json({ ok: true, review });
  } catch (error) {
    console.error("Upsert review error:", error);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}
