import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

// Enrollment is a plain join table (studentId + courseId) — there's no "revoked"
// status to toggle anymore. Removing access means deleting the row (below).

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    await prisma.enrollment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete enrollment error:", error);
    return NextResponse.json({ error: "Failed to delete enrollment" }, { status: 500 });
  }
}
