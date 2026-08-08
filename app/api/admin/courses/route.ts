import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireAdmin, slugify } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emptyCourseData } from "@/lib/courses";
import { revalidateCoursePaths } from "@/lib/courseRevalidation";

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    const slug = slugify(String(body.slug || title));

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!slug) {
      return NextResponse.json({ error: "Could not derive a valid slug" }, { status: 400 });
    }

    const existing = await prisma.course.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A course with that slug already exists" },
        { status: 409 },
      );
    }

    const course = await prisma.course.create({
      data: {
        slug,
        title,
        status: "draft",
        data: emptyCourseData(slug, title) as unknown as Prisma.InputJsonValue,
      },
      select: { id: true, slug: true },
    });

    revalidateCoursePaths(slug);
    return NextResponse.json({ ok: true, course }, { status: 201 });
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
