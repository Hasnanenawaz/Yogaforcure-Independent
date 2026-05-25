import { NextResponse } from "next/server";
import { requireAdmin, slugify, contentToHtml } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const blogs = await prisma.blog.findMany({
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(blogs);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      metaTitle,
      metaDescription,
      published,
      images,
    } = body;

    if (!title?.trim() || !excerpt?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Title, excerpt, and content are required" },
        { status: 400 }
      );
    }

    let slug = slugify(title);
    const existing = await prisma.blog.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const htmlContent = content.includes("<p>")
      ? content
      : contentToHtml(content);

    const blog = await prisma.blog.create({
      data: {
        title: title.trim(),
        slug,
        excerpt: excerpt.trim(),
        content: htmlContent,
        metaTitle: metaTitle?.trim() || title.trim(),
        metaDescription: metaDescription?.trim() || excerpt.trim(),
        published: Boolean(published),
        adminId: session.adminId,
        images: {
          create: (images ?? []).map(
            (
              img: { url: string; publicId: string; alt?: string },
              i: number
            ) => ({
              url: img.url,
              publicId: img.publicId,
              alt: img.alt?.trim() || title.trim(),
              order: i,
            })
          ),
        },
      },
      include: { images: true },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Create blog error:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
