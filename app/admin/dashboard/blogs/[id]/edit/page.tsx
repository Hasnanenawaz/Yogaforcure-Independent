import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogForm from "@/components/admin/BlogForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!blog) notFound();

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a3a1a] mb-6">
        Edit blog
      </h1>
      <BlogForm
        initial={{
          id: blog.id,
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          metaTitle: blog.metaTitle ?? "",
          metaDescription: blog.metaDescription ?? "",
          published: blog.published,
          images: blog.images.map((img) => ({
            url: img.url,
            publicId: img.publicId,
            alt: img.alt,
          })),
        }}
      />
    </div>
  );
}
