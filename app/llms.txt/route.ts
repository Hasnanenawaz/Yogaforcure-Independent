import { prisma } from "@/lib/prisma";
import { getAllCourses, instructor } from "@/lib/courses";
import { homeFaq } from "@/lib/homeFaq";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yogaforcure.in";

export const revalidate = 300;

export async function GET() {
  const [courses, blogs] = await Promise.all([
    getAllCourses(),
    prisma.blog.findMany({
      where: { published: true },
      select: { title: true, slug: true, excerpt: true },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
  ]);

  const lines: string[] = [];

  lines.push("# Yoga for Cure by Neha");
  lines.push("");
  lines.push(
    `> Yoga for Cure is an online yoga practice founded by ${instructor.name}, an Indian yoga teacher with over 10 years of experience teaching students in India, the UK, Singapore, and beyond. ${instructor.name} teaches live group classes over Zoom and self-paced video courses, in clear, fluent English, for strength, flexibility, and lasting wellbeing.`
  );
  lines.push("");
  lines.push(
    "This file summarizes the site for AI assistants and answer engines. For full detail, follow the links below."
  );
  lines.push("");

  lines.push("## Key facts");
  lines.push("");
  lines.push(`- Founder and instructor: ${instructor.name} (${instructor.role})`);
  lines.push("- Format: live online group classes (Zoom) and self-paced recorded courses");
  lines.push("- Language: English");
  lines.push("- Audience: all levels, beginners welcome, students join from India, the UK, Singapore, and worldwide");
  lines.push("- Live class timings: mornings and evenings IST, with UK and Singapore equivalents shared on the schedule");
  lines.push("- Course refund policy: 14-day full refund if the first week doesn't help, no questions asked");
  lines.push(`- Contact: WhatsApp (buttons on ${baseUrl}), Instagram @yoga_for_cure, YouTube @yogaforcurevideos`);
  lines.push("");

  lines.push("## Pages");
  lines.push("");
  lines.push(`- [Home](${baseUrl}/): Live classes, programs, pricing, and FAQ`);
  lines.push(`- [Courses](${baseUrl}/#courses): Self-paced video courses`);
  lines.push(`- [Gallery](${baseUrl}/gallery): Photos and videos from practice`);
  lines.push(`- [Blog](${baseUrl}/blog): Yoga tips and wellness articles`);
  lines.push("");

  if (courses.length > 0) {
    lines.push("## Courses");
    lines.push("");
    for (const course of courses) {
      lines.push(`### ${course.title}`);
      lines.push(`${course.description}`);
      lines.push(
        `Price: ${course.price} · Level: ${course.level} · Format: ${course.format} · Duration: ${course.duration}`
      );
      lines.push(`Link: ${baseUrl}/courses/${course.slug}`);
      lines.push("");
    }
  }

  lines.push("## Frequently asked questions");
  lines.push("");
  for (const item of homeFaq) {
    lines.push(`Q: ${item.question}`);
    lines.push(`A: ${item.answer}`);
    lines.push("");
  }

  if (blogs.length > 0) {
    lines.push("## Recent blog posts");
    lines.push("");
    for (const blog of blogs) {
      lines.push(`- [${blog.title}](${baseUrl}/blog/${blog.slug}): ${blog.excerpt}`);
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
    },
  });
}
