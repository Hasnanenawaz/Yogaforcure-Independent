import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ courseId: string }> };

export async function POST(request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await context.params;

  try {
    const body = await request.json();
    const orderedIds = Array.isArray(body.orderedIds) ? (body.orderedIds as string[]) : null;
    if (!orderedIds || orderedIds.length === 0) {
      return NextResponse.json({ error: "orderedIds is required" }, { status: 400 });
    }

    const lessons = await prisma.lesson.findMany({ where: { courseId } });
    const validIds = new Set(lessons.map((l) => l.id));
    if (
      orderedIds.length !== lessons.length ||
      !orderedIds.every((id) => validIds.has(id))
    ) {
      return NextResponse.json(
        { error: "orderedIds must match this course's lessons exactly" },
        { status: 400 },
      );
    }

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.lesson.update({ where: { id }, data: { orderNumber: index + 1 } }),
      ),
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Reorder lessons error:", error);
    return NextResponse.json({ error: "Failed to reorder lessons" }, { status: 500 });
  }
}
