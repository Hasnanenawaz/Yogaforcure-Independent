import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidateCoursePaths } from "@/lib/courseRevalidation";

type RouteContext = { params: Promise<{ courseId: string }> };

const STATUS_VALUES = new Set(["draft", "published"]);

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await context.params;

  try {
    const body = await request.json();
    const data: Record<string, string | null> = {};

    for (const key of [
      "thumbnailUrl",
      "instructorName",
      "instructorBio",
      "instructorPhoto",
      "category",
      "difficulty",
      "durationLabel",
    ] as const) {
      if (key in body) data[key] = body[key] === "" ? null : String(body[key]);
    }

    if ("status" in body) {
      if (!STATUS_VALUES.has(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      data.status = body.status;
    }

    const course = await prisma.course.update({ where: { id: courseId }, data });

    revalidateCoursePaths(course.slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Update course settings error:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await context.params;

  try {
    const enrollmentCount = await prisma.enrollment.count({ where: { courseId } });
    if (enrollmentCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete a course that has enrolled students" },
        { status: 400 },
      );
    }

    const course = await prisma.course.delete({ where: { id: courseId } });

    revalidateCoursePaths(course.slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
