import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const answeredParam = searchParams.get("answered");

  try {
    const comments = await prisma.comment.findMany({
      where: {
        isAdmin: false,
        ...(answeredParam === "false" ? { replies: { none: {} } } : {}),
      },
      include: {
        student: { select: { name: true, email: true } },
        lesson: { select: { title: true, course: { select: { slug: true, title: true, data: true } } } },
        replies: {
          include: { admin: { select: { email: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("List comments error:", error);
    return NextResponse.json({ error: "Failed to load comments" }, { status: 500 });
  }
}
