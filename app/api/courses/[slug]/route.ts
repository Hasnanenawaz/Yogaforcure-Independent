import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Course } from "@/lib/courses";
import { revalidateCoursePaths } from "@/lib/courseRevalidation";

type RouteContext = { params: Promise<{ slug: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await context.params;

  try {
    const body = (await request.json()) as Course;

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid course data" }, { status: 400 });
    }

    const data = { ...body, slug } as unknown as Prisma.InputJsonValue;
    const title = body.title ? String(body.title) : undefined;

    await prisma.course.upsert({
      where: { slug },
      update: { data, ...(title ? { title } : {}) },
      create: { slug, data, title },
    });

    revalidateCoursePaths(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update course error:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}
