import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedCourses } from "../lib/courses";

const prisma = new PrismaClient();

async function main() {
  const email = "yogaforcure.marketing@gmail.com";
  // Real password lives in .env.local (SEED_ADMIN_PASSWORD), never in this
  // committed file. Falls back to the old default only if unset.
  const password = process.env.SEED_ADMIN_PASSWORD || "Neha@2025";
  const hashed = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { email },
    update: { password: hashed },
    create: { email, password: hashed },
  });

  console.log("Admin seeded:", email);

  const courseRows: Record<string, { id: string }> = {};
  for (const course of seedCourses) {
    const data = course as unknown as Prisma.InputJsonValue;
    // update: {} — re-running seed must not overwrite live edits made via /courses/[slug]/admin.
    const row = await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: { slug: course.slug, title: course.title, data },
    });
    courseRows[course.slug] = row;
    console.log("Course seeded (skipped if already existed):", course.slug);
  }

  // Placeholder lessons — real Bunny video IDs get pasted in via the admin
  // lesson editor once that's built (Phase 2). Just enough here for the
  // player (Phase 4) to have something to render against.
  for (const course of seedCourses) {
    const courseRow = courseRows[course.slug];
    if (!courseRow) continue;
    const lessons = course.curriculum.flatMap((module) => module.lessons).slice(0, 2);
    for (const [i, lesson] of lessons.entries()) {
      const slug = `lesson-${i + 1}`;
      await prisma.lesson.upsert({
        where: { courseId_slug: { courseId: courseRow.id, slug } },
        update: {},
        create: {
          courseId: courseRow.id,
          slug,
          title: lesson.title,
          duration: lesson.duration,
          orderNumber: i + 1,
          bunnyVideoId: "placeholder-video-id",
          isFreePreview: i === 0,
        },
      });
    }
  }
  console.log("Placeholder lessons seeded");

  const students = [
    { email: "test1@example.com", name: "Test Student One", phone: "9000000001" },
    { email: "test2@example.com", name: "Test Student Two", phone: "9000000002" },
    { email: "test3@example.com", name: "Test Student Three", phone: "9000000003" },
  ];
  // Same pattern — real value in .env.local (SEED_STUDENT_PASSWORD), not here.
  const studentPassword = await bcrypt.hash(process.env.SEED_STUDENT_PASSWORD || "test1234", 12);
  const studentRows: Record<string, { id: string }> = {};
  for (const student of students) {
    const row = await prisma.student.upsert({
      where: { email: student.email },
      update: {},
      create: { ...student, password: studentPassword },
    });
    studentRows[student.email] = row;
  }
  console.log("Sample students seeded:", students.map((s) => s.email).join(", "));

  const sleepReset = courseRows["sleep-reset"];
  const calmUnderPressure = courseRows["calm-under-pressure"];
  const student1 = studentRows["test1@example.com"];
  const student2 = studentRows["test2@example.com"];

  if (sleepReset && calmUnderPressure && student1 && student2) {
    await prisma.enrollment.upsert({
      where: { studentId_courseId: { studentId: student1.id, courseId: sleepReset.id } },
      update: {},
      create: { studentId: student1.id, courseId: sleepReset.id },
    });
    await prisma.enrollment.upsert({
      where: { studentId_courseId: { studentId: student1.id, courseId: calmUnderPressure.id } },
      update: {},
      create: { studentId: student1.id, courseId: calmUnderPressure.id },
    });
    await prisma.enrollment.upsert({
      where: { studentId_courseId: { studentId: student2.id, courseId: sleepReset.id } },
      update: {},
      create: { studentId: student2.id, courseId: sleepReset.id },
    });
    console.log("Sample enrollments seeded (student 3 left with no courses, by design)");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
