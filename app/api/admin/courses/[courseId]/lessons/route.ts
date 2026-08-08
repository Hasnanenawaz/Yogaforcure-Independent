import { NextResponse } from "next/server";
import { requireAdmin, slugify } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ courseId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await context.params;
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    orderBy: { orderNumber: "asc" },
  });

  return NextResponse.json({ lessons });
}

export async function POST(request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await context.params;

  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    const bunnyVideoId = String(body.bunnyVideoId || "").trim();
    const slug = slugify(String(body.slug || title));

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!slug) {
      return NextResponse.json({ error: "Could not derive a valid slug" }, { status: 400 });
    }
    if (!bunnyVideoId) {
      return NextResponse.json({ error: "Bunny video ID is required" }, { status: 400 });
    }

    const existing = await prisma.lesson.findUnique({
      where: { courseId_slug: { courseId, slug } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A lesson with that slug already exists in this course" },
        { status: 409 },
      );
    }

    const last = await prisma.lesson.findFirst({
      where: { courseId },
      orderBy: { orderNumber: "desc" },
    });

    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        title,
        slug,
        description: body.description ? String(body.description) : null,
        bunnyVideoId,
        duration: body.duration ? String(body.duration) : null,
        isFreePreview: Boolean(body.isFreePreview),
        orderNumber: (last?.orderNumber ?? 0) + 1,
      },
    });

    return NextResponse.json({ ok: true, lesson }, { status: 201 });
  } catch (error) {
    console.error("Create lesson error:", error);
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 });
  }
}
