import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ commentId: string }> };

export async function POST(request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { commentId } = await context.params;

  try {
    const body = await request.json();
    const text = String(body.text || "").trim();
    if (!text) {
      return NextResponse.json({ error: "Reply cannot be empty" }, { status: 400 });
    }

    const parent = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!parent) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const reply = await prisma.comment.create({
      data: {
        text,
        adminId: session.adminId,
        lessonId: parent.lessonId,
        parentId: parent.id,
        isAdmin: true,
      },
    });

    return NextResponse.json({ ok: true, reply });
  } catch (error) {
    console.error("Create reply error:", error);
    return NextResponse.json({ error: "Failed to post reply" }, { status: 500 });
  }
}
