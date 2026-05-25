import { NextResponse } from "next/server";
import { requireAdmin, slugify, contentToHtml } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary } from "@/lib/cloudinary";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!blog) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(blog);
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

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

    const existing = await prisma.blog.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let slug = existing.slug;
    if (title && slugify(title) !== slugify(existing.title)) {
      slug = slugify(title);
      const clash = await prisma.blog.findFirst({
        where: { slug, NOT: { id } },
      });
      if (clash) slug = `${slug}-${Date.now()}`;
    }

    const htmlContent =
      content && !content.includes("<p>") ? contentToHtml(content) : content;

    if (images) {
      const newPublicIds = new Set(
        images.map((i: { publicId: string }) => i.publicId)
      );
      for (const img of existing.images) {
        if (!newPublicIds.has(img.publicId)) {
          try {
            await deleteFromCloudinary(img.publicId);
          } catch {
            /* ignore */
          }
        }
      }
      await prisma.blogImage.deleteMany({ where: { blogId: id } });
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        slug,
        ...(excerpt && { excerpt: excerpt.trim() }),
        ...(htmlContent && { content: htmlContent }),
        ...(metaTitle !== undefined && {
          metaTitle: metaTitle?.trim() || title?.trim(),
        }),
        ...(metaDescription !== undefined && {
          metaDescription: metaDescription?.trim() || excerpt?.trim(),
        }),
        ...(published !== undefined && { published: Boolean(published) }),
        ...(images && {
          images: {
            create: images.map(
              (
                img: { url: string; publicId: string; alt?: string },
                i: number
              ) => ({
                url: img.url,
                publicId: img.publicId,
                alt: img.alt?.trim() || title?.trim() || existing.title,
                order: i,
              })
            ),
          },
        }),
      },
      include: { images: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Update blog error:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = await request.json();
    const { published } = body;

    if (published === undefined) {
      return NextResponse.json(
        { error: "published field is required" },
        { status: 400 }
      );
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: { published: Boolean(published) },
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Toggle publish error:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const blog = await prisma.blog.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!blog) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  for (const img of blog.images) {
    try {
      await deleteFromCloudinary(img.publicId);
    } catch {
      /* ignore */
    }
  }

  await prisma.blog.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
