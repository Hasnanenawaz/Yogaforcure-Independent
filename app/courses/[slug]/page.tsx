import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import FloatingNavbar from "@/components/FloatingNavbar";
import Footer from "@/components/Footer";
import { courses, getCourseBySlug } from "@/lib/courses";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yogaforcure.in";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Not found" };

  return {
    title: `${course.title} — Yoga for Cure`,
    description: course.description,
    alternates: { canonical: `${baseUrl}/courses/${slug}` },
    openGraph: {
      title: course.title,
      description: course.description,
      url: `${baseUrl}/courses/${slug}`,
      siteName: "Yoga for Cure",
      type: "website",
    },
  };
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) notFound();

  const enrollMessage = `Hi, I'd like to enroll in "${course.title}". Please share details.`;

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.longDescription,
    provider: {
      "@type": "Organization",
      name: "Yoga for Cure",
      url: baseUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <FloatingNavbar />

      <main className="min-h-screen overflow-x-hidden bg-[#faf8f5]">
        {/* Hero */}
        <div
          className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 px-4"
          style={{ background: course.gradient }}
        >
          <div className="max-w-4xl mx-auto">
            <nav className="text-[0.85rem] text-white/80 mb-6">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              {" / "}
              <Link href="/#courses" className="hover:text-white transition-colors">
                Courses
              </Link>
            </nav>

            <span className="inline-flex items-center rounded-full bg-[#faf8f5]/95 text-[#1a3a1a] uppercase tracking-wide font-bold text-[0.72rem] px-[13px] py-[6px] mb-5">
              {course.tag}
            </span>

            <h1 className="font-extrabold text-white text-[1.9rem] sm:text-4xl md:text-[2.6rem] leading-[1.15] mb-4">
              {course.title}
            </h1>

            <p className="text-white/90 text-[1.05rem] max-w-[640px]">
              {course.description}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 flex flex-col gap-10">
              <section>
                <h2 className="font-bold text-[#1a3a1a] text-[1.35rem] mb-3">
                  About this course
                </h2>
                <p className="text-[#2d2d2d] leading-relaxed">
                  {course.longDescription}
                </p>
              </section>

              <section>
                <h2 className="font-bold text-[#1a3a1a] text-[1.35rem] mb-4">
                  What you&apos;ll gain
                </h2>
                <ul className="flex flex-col gap-3">
                  {course.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#e8745b] shrink-0 mt-0.5" />
                      <span className="text-[#2d2d2d]">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="font-bold text-[#1a3a1a] text-[1.35rem] mb-4">
                  Course curriculum
                </h2>
                <div className="flex flex-col gap-4">
                  {course.curriculum.map((item) => (
                    <div
                      key={item.title}
                      className="bg-white border border-[#ede8e0] rounded-2xl p-5"
                    >
                      <h3 className="font-bold text-[#2d5a2d] text-[1rem] mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-[#2d2d2d] text-[0.92rem]">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="font-bold text-[#1a3a1a] text-[1.35rem] mb-4">
                  Who it&apos;s for
                </h2>
                <ul className="flex flex-col gap-3">
                  {course.whoItsFor.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#2d5a2d] shrink-0 mt-0.5" />
                      <span className="text-[#2d2d2d]">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-28 bg-white border border-[#ede8e0] rounded-[20px] shadow-[0_12px_34px_rgba(27,67,50,0.10)] p-6 flex flex-col gap-4">
                <span className="font-bold text-[#2d5a2d] text-[1.6rem]">
                  {course.price}
                </span>

                <div className="flex flex-col gap-2 text-[0.9rem] text-[#2d2d2d] border-t border-[#ede8e0] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6b6b6b]">Duration</span>
                    <span className="font-medium text-right">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6b6b6b]">Level</span>
                    <span className="font-medium text-right">{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6b6b6b]">Format</span>
                    <span className="font-medium text-right">{course.format}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6b6b6b]">Access</span>
                    <span className="font-medium text-right">{course.meta}</span>
                  </div>
                </div>

                <Link
                  href={getWhatsAppUrl(enrollMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center font-semibold text-[0.95rem] px-6 py-3.5 rounded-full bg-[#e8745b] text-white shadow-[0_8px_20px_rgba(232,116,91,0.32)] hover:shadow-[0_14px_28px_rgba(232,116,91,0.4)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  Enroll on WhatsApp
                </Link>

                <Link
                  href="/#courses"
                  className="w-full text-center font-semibold text-[0.9rem] px-6 py-3 rounded-full border-2 border-[#2d5a2d] text-[#2d5a2d] hover:bg-[#2d5a2d] hover:text-[#faf8f5] transition-all duration-300"
                >
                  Back to all courses
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
