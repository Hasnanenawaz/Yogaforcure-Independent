import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/studentAuth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ lessonId: string }> };

export async function POST(_request: Request, context: RouteContext) {
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

    await prisma.lessonProgress.upsert({
      where: { studentId_lessonId: { studentId: session.studentId, lessonId } },
      update: { isCompleted: true, watchedAt: new Date() },
      create: {
        studentId: session.studentId,
        lessonId,
        isCompleted: true,
        watchedAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Update lesson progress error:", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
