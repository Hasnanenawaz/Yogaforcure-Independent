import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock, BookOpen, Gauge, ShieldCheck, Star } from "lucide-react";
import FloatingNavbar from "@/components/FloatingNavbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import CourseVideoPreview from "@/components/course/CourseVideoPreview";
import { courses, getCourseBySlug, instructor } from "@/lib/courses";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yogaforcure.in";

type Props = { params: Promise<{ slug: string }> };

const heroMetaIcons = [Clock, BookOpen, Gauge, Check];

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Not found" };

  return {
    title: `${course.title} | Online Yoga Course | Yoga for Cure`,
    description: course.description,
    alternates: { canonical: `${baseUrl}/courses/${slug}` },
    openGraph: {
      title: `${course.title} | Yoga for Cure`,
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
  const enrollUrl = getWhatsAppUrl(enrollMessage);

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.about.join(" "),
    provider: {
      "@type": "Organization",
      name: "Yoga for Cure",
      sameAs: baseUrl,
    },
    instructor: {
      "@type": "Person",
      name: instructor.name,
      jobTitle: instructor.role,
    },
    inLanguage: "en",
    educationalLevel: course.level,
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: course.timeRequiredIso,
        instructor: { "@type": "Person", name: instructor.name },
      },
    ],
    offers: {
      "@type": "Offer",
      price: String(course.priceValue),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/courses/${slug}`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(course.rating),
      reviewCount: String(course.reviewCount),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: course.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Courses", item: `${baseUrl}/#courses` },
      { "@type": "ListItem", position: 3, name: course.title, item: `${baseUrl}/courses/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <FloatingNavbar />

      <main className="min-h-screen overflow-x-hidden bg-[#faf8f5]">
        {/* Hero */}
        <div
          className="relative overflow-hidden pt-32 pb-44 sm:pt-40 sm:pb-56 px-4"
          style={{
            background:
              "linear-gradient(140deg,#0F2E20 0%, #1a3a1a 45%, #2d5a2d 100%)",
          }}
        >
          <div className="pointer-events-none absolute -top-36 -right-24 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(64,145,108,0.35),transparent_65%)]" />
          <div className="pointer-events-none absolute -bottom-52 -left-40 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(232,116,91,0.18),transparent_65%)]" />

          <div className="relative max-w-4xl mx-auto">
            <nav className="text-[0.85rem] text-[#9caf88] mb-7">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span className="mx-1.5 opacity-55">/</span>
              <Link href="/#courses" className="hover:text-white transition-colors">
                Courses
              </Link>
              <span className="mx-1.5 opacity-55">/</span>
              <span className="text-white/80">{course.title.split(":")[0]}</span>
            </nav>

            <span className="inline-flex items-center rounded-full bg-[#faf8f5]/95 text-[#1a3a1a] uppercase tracking-wide font-bold text-[0.72rem] px-[13px] py-[6px] mb-5">
              {course.tag}
            </span>

            <h1 className="font-extrabold text-white text-[2rem] sm:text-4xl md:text-[2.7rem] leading-[1.15] mb-4 max-w-[820px]">
              {course.title}
            </h1>

            <p className="text-white/90 text-[1.05rem] max-w-[640px] mb-8">
              {course.heroLead}
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-3 text-[0.9rem] mb-9">
              {course.heroMeta.map((meta, i) => {
                const Icon = heroMetaIcons[i] ?? Check;
                return (
                  <span key={meta} className="flex items-center gap-2.5 text-white/85">
                    <Icon className="w-5 h-5 text-[#9caf88] shrink-0" strokeWidth={1.9} />
                    {meta}
                  </span>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3.5">
              <a
                href="#buy"
                className="inline-flex items-center justify-center font-semibold text-[1rem] px-8 py-4 rounded-full bg-[#e8745b] text-white shadow-[0_14px_28px_rgba(232,116,91,0.4)] hover:-translate-y-0.5 transition-transform duration-300"
              >
                Enroll for {course.price}
              </a>
              <a
                href="#intro-video"
                className="inline-flex items-center justify-center font-semibold text-[1rem] px-8 py-4 rounded-full border-2 border-white/40 text-white hover:bg-white/10 transition-colors duration-300"
              >
                Watch a 2 min preview
              </a>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-28 sm:-mt-36 relative pb-20">
          {/* Cover card */}
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] bg-white border border-[#ede8e0] rounded-[20px] shadow-[0_12px_34px_rgba(27,67,50,0.10)] overflow-hidden mb-11">
              <div
                className="relative min-h-[220px] sm:min-h-[280px]"
                style={{ background: course.gradient }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_60%)]" />
              </div>

              <div className="flex flex-col gap-3.5 p-8 sm:p-9 justify-center">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-px w-6 bg-[#e8745b]" />
                  <span className="text-[0.78rem] font-bold uppercase tracking-widest text-[#e8745b]">
                    {course.coverKicker}
                  </span>
                </div>
                <h2 className="font-bold text-[#1a3a1a] text-[1.4rem] leading-tight">
                  {course.coverHeading}
                </h2>
                <p className="text-[#6b6b6b] text-[0.95rem]">
                  {course.coverDescription}
                </p>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {course.coverStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-[#faf8f5] rounded-2xl py-3.5 text-center"
                    >
                      <div className="font-[family-name:var(--font-poppins)] font-bold text-[#1a3a1a] text-[1.15rem]">
                        {stat.value}
                      </div>
                      <div className="text-[0.68rem] uppercase tracking-wide text-[#6b6b6b] mt-0.5">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-11 items-start">
            {/* Left content */}
            <div className="flex flex-col gap-14">
              {/* Intro video */}
              <Reveal>
                <section id="intro-video" className="scroll-mt-28">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="inline-block h-px w-6 bg-[#e8745b]" />
                    <span className="text-[0.78rem] font-bold uppercase tracking-widest text-[#e8745b]">
                      Meet your teacher
                    </span>
                  </div>
                  <h2 className="font-bold text-[#1a3a1a] text-[1.4rem] mb-3">
                    {course.introVideo.heading}
                  </h2>
                  <p className="text-[#6b6b6b] mb-5">{course.introVideo.description}</p>
                  <CourseVideoPreview
                    gradient="linear-gradient(150deg,#0F2E20 0%,#1a3a1a 50%,#2d5a2d 100%)"
                    instructorLine={course.introVideo.instructorLine}
                    lengthLabel={course.introVideo.lengthLabel}
                  />
                </section>
              </Reveal>

              {/* About */}
              <Reveal>
                <section>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="inline-block h-px w-6 bg-[#e8745b]" />
                    <span className="text-[0.78rem] font-bold uppercase tracking-widest text-[#e8745b]">
                      About this course
                    </span>
                  </div>
                  <h2 className="font-bold text-[#1a3a1a] text-[1.4rem] mb-3">
                    What {course.title.split(":")[0]} is, in plain words
                  </h2>
                  <div className="flex flex-col gap-3.5">
                    {course.about.map((paragraph) => (
                      <p key={paragraph} className="text-[#6b6b6b] leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              </Reveal>

              {/* What you'll gain */}
              <Reveal>
                <section>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="inline-block h-px w-6 bg-[#e8745b]" />
                    <span className="text-[0.78rem] font-bold uppercase tracking-widest text-[#e8745b]">
                      What you&apos;ll gain
                    </span>
                  </div>
                  <h2 className="font-bold text-[#1a3a1a] text-[1.4rem] mb-4">
                    Real changes you can feel by the end of week 1
                  </h2>
                  <ul className="flex flex-col gap-3.5">
                    {course.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-3.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e4eee7] text-[#2d5a2d] shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </span>
                        <span className="text-[#2d2d2d]">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>

              {/* Curriculum */}
              <Reveal>
                <section>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="inline-block h-px w-6 bg-[#e8745b]" />
                    <span className="text-[0.78rem] font-bold uppercase tracking-widest text-[#e8745b]">
                      Course curriculum
                    </span>
                  </div>
                  <h2 className="font-bold text-[#1a3a1a] text-[1.4rem] mb-4">
                    {course.curriculum.length} parts, one focus each
                  </h2>
                  <div className="flex flex-col gap-3.5">
                    {course.curriculum.map((module, i) => (
                      <details
                        key={module.title}
                        open={i === 0}
                        className="group bg-white border border-[#ede8e0] rounded-2xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
                      >
                        <summary className="list-none cursor-pointer px-6 py-5 flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                          <div>
                            <h3 className="font-bold text-[#1a3a1a] text-[1.02rem] mb-1">
                              {module.title}
                            </h3>
                            <div className="text-[0.85rem] text-[#6b6b6b]">
                              {module.subtitle}
                            </div>
                          </div>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#faf8f5] text-[#e8745b] font-bold shrink-0 transition-transform duration-300 group-open:rotate-45 group-open:bg-[#e8745b] group-open:text-white">
                            +
                          </span>
                        </summary>
                        <div className="px-6 pb-5 pt-1 border-t border-[#ede8e0]">
                          <ul className="flex flex-col gap-2 mt-3">
                            {module.lessons.map((lesson, li) => (
                              <li
                                key={lesson.title}
                                className="flex items-center gap-3 text-[0.92rem] text-[#2d2d2d] py-1.5"
                              >
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e4eee7] text-[#2d5a2d] text-[0.7rem] shrink-0">
                                  {li + 1}
                                </span>
                                {lesson.title}
                                <span className="ml-auto text-[0.8rem] text-[#6b6b6b] shrink-0">
                                  {lesson.duration}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              </Reveal>

              {/* Who it's for */}
              <Reveal>
                <section>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="inline-block h-px w-6 bg-[#e8745b]" />
                    <span className="text-[0.78rem] font-bold uppercase tracking-widest text-[#e8745b]">
                      Who this course is for
                    </span>
                  </div>
                  <h2 className="font-bold text-[#1a3a1a] text-[1.4rem] mb-4">
                    If any of this sounds like you, you&apos;re in the right place
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {course.whoItsFor.map((card, i) => (
                      <div
                        key={card.title}
                        className="bg-white border border-[#ede8e0] rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_12px_34px_rgba(27,67,50,0.10)]"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fbe3dc] text-[#e8745b] font-[family-name:var(--font-poppins)] font-bold mb-3">
                          {i + 1}
                        </div>
                        <h3 className="font-bold text-[#1a3a1a] text-[1rem] mb-1">
                          {card.title}
                        </h3>
                        <p className="text-[#6b6b6b] text-[0.9rem]">{card.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>

              {/* Meet instructor */}
              <Reveal>
                <section>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="inline-block h-px w-6 bg-[#e8745b]" />
                    <span className="text-[0.78rem] font-bold uppercase tracking-widest text-[#e8745b]">
                      Your instructor
                    </span>
                  </div>
                  <h2 className="font-bold text-[#1a3a1a] text-[1.4rem] mb-4">
                    Taught by {instructor.name}
                  </h2>
                  <div className="bg-gradient-to-b from-white to-[#faf8f5] border border-[#ede8e0] rounded-[20px] p-8 shadow-[0_12px_34px_rgba(27,67,50,0.10)] grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center text-center sm:text-left">
                    <div className="mx-auto sm:mx-0 flex h-[110px] w-[110px] items-center justify-center rounded-full bg-gradient-to-br from-[#e4eee7] to-[#f6edcf] border-4 border-white shadow-[0_12px_34px_rgba(27,67,50,0.10)] font-[family-name:var(--font-poppins)] font-bold text-[#1a3a1a] text-[2rem]">
                      {instructor.initial}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1a3a1a] text-[1.1rem]">
                        {instructor.name}
                      </h3>
                      <div className="text-[#e8745b] font-semibold text-[0.82rem] uppercase tracking-wide my-1">
                        {instructor.role}
                      </div>
                      <p className="text-[#6b6b6b] text-[0.95rem] mb-2">{instructor.bio}</p>
                      <p className="text-[#6b6b6b] text-[0.95rem]">{course.instructorNote}</p>
                    </div>
                  </div>
                </section>
              </Reveal>

              {/* Testimonials */}
              <Reveal>
                <section>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="inline-block h-px w-6 bg-[#e8745b]" />
                    <span className="text-[0.78rem] font-bold uppercase tracking-widest text-[#e8745b]">
                      Student experiences
                    </span>
                  </div>
                  <h2 className="font-bold text-[#1a3a1a] text-[1.4rem] mb-4">
                    What people say after finishing week 1
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {course.testimonials.map((testimonial) => (
                      <article
                        key={testimonial.name}
                        className="bg-white border border-[#ede8e0] rounded-2xl p-6 shadow-[0_6px_18px_rgba(27,67,50,0.05)] transition-transform duration-200 hover:-translate-y-1"
                      >
                        <span className="block font-[family-name:var(--font-poppins)] text-[2.1rem] leading-none text-[#e8745b] font-extrabold mb-3">
                          &ldquo;
                        </span>
                        <blockquote className="text-[#2d2d2d] text-[0.96rem] mb-4">
                          {testimonial.quote}
                        </blockquote>
                        <div className="flex items-center gap-1 text-[#c9a227] mb-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <div className="flex items-center gap-3 pt-3.5 border-t border-[#ede8e0]">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2d5a2d] text-white font-[family-name:var(--font-poppins)] font-bold text-[0.82rem]">
                            {testimonial.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")}
                          </span>
                          <div>
                            <div className="font-semibold text-[#1a3a1a] text-[0.88rem]">
                              {testimonial.name}
                            </div>
                            <div className="text-[0.78rem] text-[#6b6b6b]">
                              {testimonial.location}
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </Reveal>

              {/* FAQ */}
              <Reveal>
                <section>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="inline-block h-px w-6 bg-[#e8745b]" />
                    <span className="text-[0.78rem] font-bold uppercase tracking-widest text-[#e8745b]">
                      Frequently asked
                    </span>
                  </div>
                  <h2 className="font-bold text-[#1a3a1a] text-[1.4rem] mb-4">
                    Questions, answered directly
                  </h2>
                  <div className="flex flex-col gap-3">
                    {course.faq.map((item, i) => (
                      <details
                        key={item.question}
                        open={i === 0}
                        className="group bg-white border border-[#ede8e0] rounded-2xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
                      >
                        <summary className="list-none cursor-pointer px-6 py-4 font-[family-name:var(--font-poppins)] font-semibold text-[#1a3a1a] flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                          {item.question}
                          <span className="text-[#e8745b] font-bold transition-transform duration-300 group-open:rotate-45 shrink-0">
                            +
                          </span>
                        </summary>
                        <p className="px-6 pb-5 text-[#6b6b6b] text-[0.94rem]">{item.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              </Reveal>

              {/* Final CTA band */}
              <Reveal>
                <section className="relative overflow-hidden rounded-[26px] bg-[#1a3a1a] p-8 sm:p-12 flex flex-wrap items-center justify-between gap-7">
                  <div className="pointer-events-none absolute -right-24 -top-24 h-[300px] w-[300px] rounded-full bg-[#2d5a2d]" />
                  <div className="pointer-events-none absolute right-16 -bottom-32 h-[220px] w-[220px] rounded-full bg-[#e8745b]/35" />
                  <div className="relative z-10 max-w-[520px]">
                    <h2 className="font-bold text-white text-[1.5rem] sm:text-[1.9rem] leading-snug">
                      Start tonight, feel the change by the end of week 1
                    </h2>
                    <p className="text-[#9caf88] mt-2">
                      Lifetime access. Practice on phone, tablet, or laptop.
                    </p>
                  </div>
                  <Link
                    href={enrollUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 inline-flex items-center justify-center font-semibold text-[1rem] px-8 py-4 rounded-full bg-[#e8745b] text-white shadow-[0_14px_28px_rgba(232,116,91,0.4)] hover:-translate-y-0.5 transition-transform duration-300"
                  >
                    Enroll for {course.price}
                  </Link>
                </section>
              </Reveal>
            </div>

            {/* Sticky sidebar */}
            <Reveal>
              <aside id="buy" className="lg:sticky lg:top-28 scroll-mt-28">
                <div className="bg-white border border-[#ede8e0] rounded-[20px] shadow-[0_12px_34px_rgba(27,67,50,0.10)] overflow-hidden">
                  <div className="px-7 pt-7 pb-6 border-b border-[#ede8e0]">
                    <div className="flex items-baseline flex-wrap gap-3">
                      <span className="font-[family-name:var(--font-poppins)] font-extrabold text-[#1a3a1a] text-[2.1rem] leading-none">
                        {course.price}
                      </span>
                      <span className="text-[#6b6b6b] line-through text-[1.05rem] font-semibold">
                        {course.wasPrice}
                      </span>
                      <span className="bg-[#f6edcf] text-[#8c6a1d] text-[0.72rem] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
                        Save {course.savePercent}%
                      </span>
                    </div>
                    <div className="text-[#6b6b6b] text-[0.85rem] mt-1.5">
                      One time payment, lifetime access
                    </div>
                  </div>

                  <div className="px-7 py-5 flex flex-col gap-3">
                    {course.includes.map((item) => (
                      <div key={item} className="flex items-start gap-3 text-[0.9rem] text-[#2d2d2d]">
                        <Check className="w-[18px] h-[18px] text-[#2d5a2d] shrink-0 mt-0.5" strokeWidth={2.2} />
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="px-7 pb-7 flex flex-col gap-2.5">
                    <Link
                      href={enrollUrl}
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
                    <div className="flex items-center justify-center gap-1.5 text-[0.78rem] text-[#6b6b6b] mt-1.5">
                      <ShieldCheck className="w-[14px] h-[14px] text-[#2d5a2d]" />
                      Secure checkout via WhatsApp, UPI and cards accepted
                    </div>
                  </div>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
