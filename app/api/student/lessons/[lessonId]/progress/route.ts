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
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    let completed = true;
    try {
      const body = await request.json();
      if (typeof body?.completed === "boolean") completed = body.completed;
    } catch {
      // No body (or non-JSON body) — default to marking complete, preserving the
      // existing auto-complete-on-video-ended call which sends nothing.
    }

    await prisma.lessonProgress.upsert({
      where: { studentId_lessonId: { studentId: session.studentId, lessonId } },
      update: { isCompleted: completed, watchedAt: completed ? new Date() : null },
      create: {
        studentId: session.studentId,
        lessonId,
        isCompleted: completed,
        watchedAt: completed ? new Date() : null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Update lesson progress error:", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
