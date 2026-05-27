import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FloatingNavbar from "@/components/FloatingNavbar";
import Footer from "@/components/Footer";
import BlogImageCollage from "@/components/blog/BlogImageCollage";
import { prisma } from "@/lib/prisma";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yogaforcure.in";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await prisma.blog.findFirst({
    where: { slug, published: true },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  });
  if (!blog) return { title: "Not found" };

  const title = blog.metaTitle || blog.title;
  const description = blog.metaDescription || blog.excerpt;
  const ogImage = blog.images[0]?.url;

  return {
    title: `${title} — Yoga by Neha`,
    description,
    alternates: { canonical: `${baseUrl}/blog/${slug}` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/blog/${slug}`,
      siteName: "Yoga by Neha",
      type: "article",
      publishedTime: blog.createdAt.toISOString(),
      modifiedTime: blog.updatedAt.toISOString(),
      ...(ogImage && { images: [{ url: ogImage, alt: blog.title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await prisma.blog.findFirst({
    where: { slug, published: true },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!blog) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    datePublished: blog.createdAt.toISOString(),
    dateModified: blog.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: "Neha",
      jobTitle: "Yoga Instructor",
    },
    publisher: {
      "@type": "Organization",
      name: "Yoga by Neha",
      url: baseUrl,
    },
    mainEntityOfPage: `${baseUrl}/blog/${slug}`,
    ...(blog.images[0] && {
      image: blog.images.map((img) => img.url),
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <FloatingNavbar />
      <main className="min-h-screen bg-[#faf8f5] pt-20 sm:pt-24 pb-16 sm:pb-20 overflow-x-hidden">
        <article className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <nav className="text-xs sm:text-sm text-[#2d2d2d] mt-4 mb-6 sm:mb-8">
            <Link href="/" className="hover:text-[#2d5a2d]">
              Home
            </Link>
            {" · "}
            <Link href="/blog" className="hover:text-[#2d5a2d]">
              Blog
            </Link>
          </nav>

          <header className="mb-8 sm:mb-10">
            <time
              dateTime={blog.updatedAt.toISOString()}
              className="text-xs sm:text-sm text-[#9caf88] font-medium uppercase tracking-wider"
            >
              {blog.updatedAt.toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1a3a1a] mt-2 sm:mt-3 leading-tight break-words">
              {blog.title}
            </h1>
            <p className="text-base sm:text-lg text-[#2d2d2d] mt-3 sm:mt-4 leading-relaxed">
              {blog.excerpt}
            </p>
          </header>

          <BlogImageCollage
            images={blog.images.map((img) => ({
              id: img.id,
              url: img.url,
              alt: img.alt || blog.title,
            }))}
          />

          <div
            className="prose-blog text-[#2d2d2d] text-[15px] sm:text-base md:text-lg leading-relaxed space-y-4 [&_p]:mb-4 max-w-none break-words"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <footer className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-[#ede8e0]">
            <Link
              href="/blog"
              className="inline-flex items-center text-[#2d5a2d] font-medium text-sm sm:text-base hover:underline"
            >
              ← Back to all articles
            </Link>
          </footer>
        </article>
      </main>
      <Footer />
    </>
  );
}
