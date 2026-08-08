import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ courseId: string; lessonId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId, lessonId } = await context.params;

  try {
    const body = await request.json();
    const data: Record<string, string | boolean | null> = {};

    if ("title" in body) data.title = String(body.title).trim();
    if ("description" in body) data.description = body.description ? String(body.description) : null;
    if ("bunnyVideoId" in body) data.bunnyVideoId = String(body.bunnyVideoId).trim();
    if ("duration" in body) data.duration = body.duration ? String(body.duration) : null;
    if ("isFreePreview" in body) data.isFreePreview = Boolean(body.isFreePreview);

    const existing = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!existing || existing.courseId !== courseId) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const lesson = await prisma.lesson.update({ where: { id: lessonId }, data });

    return NextResponse.json({ ok: true, lesson });
  } catch (error) {
    console.error("Update lesson error:", error);
    return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId, lessonId } = await context.params;

  try {
    const existing = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!existing || existing.courseId !== courseId) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    await prisma.lesson.delete({ where: { id: lessonId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete lesson error:", error);
    return NextResponse.json({ error: "Failed to delete lesson" }, { status: 500 });
  }
}
