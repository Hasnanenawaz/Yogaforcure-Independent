import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/studentAuth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ lessonId: string }> };

export async function POST(request: Request, context: RouteContext) {
  const session = await requireStudent();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lessonId } = await context.params;

  try {
    const body = await request.json();
    const text = String(body.text || "").trim();
    if (!text) {
      return NextResponse.json({ error: "Question cannot be empty" }, { status: 400 });
    }

    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: session.studentId, courseId: lesson.courseId } },
    });
    if (!enrollment) {
      return NextResponse.json({ error: "Enroll in this course to ask a question" }, { status: 403 });
    }

    const comment = await prisma.comment.create({
      data: { text, studentId: session.studentId, lessonId },
    });

    return NextResponse.json({ ok: true, comment });
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json({ error: "Failed to post question" }, { status: 500 });
  }
}
