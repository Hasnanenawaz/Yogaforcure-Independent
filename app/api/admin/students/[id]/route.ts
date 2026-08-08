import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = await request.json();
    const data: Record<string, string | boolean> = {};

    if ("name" in body) {
      const name = String(body.name).trim();
      if (!name) return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
      data.name = name;
    }
    if ("phone" in body) {
      const phone = String(body.phone).trim();
      if (!phone) return NextResponse.json({ error: "Phone cannot be empty" }, { status: 400 });
      data.phone = phone;
    }
    if ("isActive" in body) data.isActive = Boolean(body.isActive);
    if ("password" in body && body.password) {
      const password = String(body.password);
      if (password.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters" },
          { status: 400 },
        );
      }
      data.password = await bcrypt.hash(password, 12);
    }

    const student = await prisma.student.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, phone: true, isActive: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, student });
  } catch (error) {
    console.error("Update student error:", error);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}
