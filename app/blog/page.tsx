import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import FloatingNavbar from "@/components/FloatingNavbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yogaforcure.in";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — Yoga by Neha | Yoga for Cure",
  description:
    "Yoga tips, practice insights, and wellness articles from an experienced Indian yoga teacher. Online yoga classes in English.",
  alternates: { canonical: baseUrl + "/blog" },
  openGraph: {
    title: "Blog — Yoga by Neha | Yoga for Cure",
    description:
      "Yoga tips, practice insights, and wellness articles from an experienced Indian yoga teacher.",
    url: baseUrl + "/blog",
    siteName: "Yoga by Neha",
    type: "website",
  },
};

export default async function BlogPage() {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <>
      <FloatingNavbar />
      <main className="min-h-screen bg-linear-to-b from-[#f5f1eb] to-[#ede8e0] pt-20 sm:pt-24 pb-16 sm:pb-20 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <header className="text-center mb-10 sm:mb-12 lg:mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="inline-block h-px w-6 bg-[#e8745b]" />
              <span className="text-[0.78rem] font-bold uppercase tracking-widest text-[#e8745b]">
                Blog
              </span>
              <span className="inline-block h-px w-6 bg-[#e8745b]" />
            </div>
            <h1 className="font-extrabold text-[1.9rem] sm:text-3xl md:text-4xl lg:text-[2.4rem] leading-[1.15] text-[#1a3a1a] mb-3 sm:mb-4">
              Notes on practice
            </h1>
            <p className="text-base sm:text-lg text-[#2d2d2d] max-w-2xl mx-auto px-2">
              Yoga practice, wellness, and insights from your online Indian yoga
              teacher.
            </p>
          </header>

          {blogs.length === 0 ? (
            <p className="text-center text-[#2d2d2d] py-12 sm:py-16">
              New articles coming soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="group bg-[#faf8f5] rounded-2xl overflow-hidden border border-[#ede8e0]/80 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  <Link href={`/blog/${blog.slug}`} className="block">
                    <div className="relative aspect-[16/10] bg-[#ede8e0] overflow-hidden">
                      {blog.images[0] ? (
                        <Image
                          src={blog.images[0].url}
                          alt={blog.images[0].alt || blog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#9caf88]/30 to-[#2d5a2d]/20 flex items-center justify-center">
                          <span className="text-[#2d5a2d] font-medium">
                            Yoga by Neha
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
                      <time
                        dateTime={blog.updatedAt.toISOString()}
                        className="text-[10px] sm:text-xs text-[#9caf88] font-medium uppercase tracking-wider"
                      >
                        {blog.updatedAt.toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-[#1a3a1a] mt-2 mb-2 sm:mb-3 group-hover:text-[#2d5a2d] transition-colors line-clamp-2">
                        {blog.title}
                      </h2>
                      <p className="text-[#2d2d2d] text-sm sm:text-base leading-relaxed line-clamp-3 flex-1">
                        {blog.excerpt}
                      </p>
                      <span className="inline-block mt-4 text-[#2d5a2d] font-medium text-sm group-hover:underline">
                        Read more →
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
