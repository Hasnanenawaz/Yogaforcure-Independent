import { prisma } from "@/lib/prisma";

export type Lesson = { title: string; duration: string };
export type Module = { title: string; subtitle: string; lessons: Lesson[] };
export type WhoCard = { title: string; description: string };
export type Testimonial = { quote: string; name: string; location: string };
export type FaqItem = { question: string; answer: string };
export type Stat = { value: string; label: string };

export type Course = {
  slug: string;
  tag: string;
  gradient: string;
  title: string;
  description: string;
  price: string;
  priceValue: number;
  wasPrice: string;
  savePercent: number;
  meta: string;
  duration: string;
  level: string;
  format: string;
  cta: string;
  variant: "solid" | "outline";
  rating: number;
  reviewCount: number;
  timeRequiredIso: string;
  heroLead: string;
  heroMeta: string[];
  coverKicker: string;
  coverHeading: string;
  coverDescription: string;
  coverStats: Stat[];
  introVideo: {
    heading: string;
    description: string;
    instructorLine: string;
    lengthLabel: string;
  };
  about: string[];
  highlights: string[];
  curriculum: Module[];
  whoItsFor: WhoCard[];
  instructorNote: string;
  testimonials: Testimonial[];
  faq: FaqItem[];
  includes: string[];
};

export const instructor = {
  name: "Neha",
  initial: "N",
  role: "Founder, Yoga for Cure",
  bio: "Neha has taught yoga for over 10 years, guiding students in India, the UK, Singapore, and beyond. She teaches in clear, fluent English, with a warm, unhurried style that meets people exactly where they are.",
};

export const seedCourses: Course[] = [
  {
    slug: "sleep-reset",
    tag: "Course - Sleep",
    gradient: "linear-gradient(140deg,#1B4332,#40916C)",
    title: "Sleep Reset: 21 nights to deeper rest",
    description:
      "Wind down sequences and breath pacing that train your body to switch off. Practice each night from home.",
    price: "Rs. 1,999",
    priceValue: 1999,
    wasPrice: "Rs. 2,999",
    savePercent: 33,
    meta: "13 lessons, lifetime access",
    duration: "21 nights, ~20 minutes a day",
    level: "All levels",
    format: "Recorded video, practice at home",
    cta: "View course",
    variant: "solid",
    rating: 4.9,
    reviewCount: 84,
    timeRequiredIso: "PT2H24M",
    heroLead:
      "A self paced online yoga course that trains your body to switch off at night, using short wind down sequences, paced breathing, and guided relaxations. Practice from home in about 20 minutes a night.",
    heroMeta: [
      "21 nights, ~20 min a day",
      "13 video lessons",
      "All levels, beginners welcome",
      "Lifetime access, any device",
    ],
    coverKicker: "A calm, guided path",
    coverHeading: "Fall asleep faster, wake up feeling rested",
    coverDescription:
      "Sleep Reset is built for the mind that will not switch off at night. Three weeks, one short practice each evening, and a rhythm your body starts to trust.",
    coverStats: [
      { value: "21", label: "nights" },
      { value: "13", label: "lessons" },
      { value: "4.9", label: "rating" },
    ],
    introVideo: {
      heading: "A 2 minute look at how the course works",
      description:
        "Neha walks you through the three weeks, the length of each practice, and how the course fits into a real bedtime routine, so you know exactly what you're signing up for.",
      instructorLine: "Neha, founder and instructor",
      lengthLabel: "2 min preview",
    },
    about: [
      "Sleep Reset is a 21 night, self paced video course built around a simple idea: your nervous system can be trained to switch off, the same way it's been trained to stay switched on. Each night you follow a short wind down sequence, a paced breathing exercise, and a guided relaxation.",
      "The goal isn't perfection or a heroic new routine. It's a gentle, repeatable rhythm that shortens the time it takes you to fall asleep and improves how rested you feel in the morning. Practice on a mat, a rug, or your bed, in about 20 minutes.",
    ],
    highlights: [
      "A repeatable wind down ritual that signals bedtime to your body, so falling asleep starts feeling automatic again",
      "Breath pacing techniques that calm a racing mind in minutes, useful long after this course ends",
      "Fewer 3am wake-ups, and a clearer way to guide yourself back to sleep when they do happen",
      "A gentle bedtime routine you'll actually keep, because it's short, doable, and doesn't need a perfect environment",
      "A calmer relationship with sleep itself, with less anxiety about the hours you are or aren't getting",
    ],
    curriculum: [
      {
        title: "Week 1 — Settling the body",
        subtitle: "6 lessons, about 59 minutes total",
        lessons: [
          { title: "Welcome, and how to practice this course", duration: "6 min" },
          { title: "The evening wind down sequence, done right", duration: "14 min" },
          { title: "Progressive muscle relaxation for tired shoulders", duration: "12 min" },
          { title: "Legs up the wall, and why it works", duration: "9 min" },
          { title: "Gentle floor twists to release the low back", duration: "10 min" },
          { title: "Practice recap: your first week rhythm", duration: "8 min" },
        ],
      },
      {
        title: "Week 2 — Slowing the breath",
        subtitle: "4 lessons, about 46 minutes total",
        lessons: [
          { title: "Why extended exhales calm the nervous system", duration: "11 min" },
          { title: "The 4-6 breathing rhythm, guided", duration: "13 min" },
          { title: "Box breathing for a busy mind", duration: "12 min" },
          { title: "Alternate nostril breathing, simplified", duration: "10 min" },
        ],
      },
      {
        title: "Week 3 — Quieting the mind",
        subtitle: "3 lessons, about 39 minutes total",
        lessons: [
          { title: "Guided body scan for the end of the day", duration: "14 min" },
          { title: "Yoga nidra style relaxation, short version", duration: "15 min" },
          { title: "When you can't sleep: a middle of the night practice", duration: "10 min" },
        ],
      },
    ],
    whoItsFor: [
      {
        title: "The busy mind at bedtime",
        description:
          "You lie down and your brain starts replaying the day, tomorrow's to-do list, or old conversations.",
      },
      {
        title: "The 3am wake-up",
        description:
          "You fall asleep fine, but wake up at 3 or 4am and can't fall back asleep easily.",
      },
      {
        title: "The frequent traveller",
        description:
          "Shift work, travel, or an irregular schedule keeps knocking your sleep patterns out of rhythm.",
      },
      {
        title: "The meditation app graduate",
        description:
          "You've tried apps, but want a structured, guided path with a real teacher, not a growing library to pick from.",
      },
    ],
    instructorNote:
      "Sleep Reset is built from what she's seen actually help her students unwind, not a generic template.",
    testimonials: [
      {
        quote:
          "The breath pacing changed everything. I stopped dreading bedtime by day 4. It sounds dramatic, but it's the honest change.",
        name: "Manasa H.",
        location: "Bengaluru",
      },
      {
        quote:
          "I've tried apps for years and always drifted. Having Neha guide me, night after night, made it stick. First real bedtime routine in a decade.",
        name: "Daniel K.",
        location: "Singapore",
      },
    ],
    faq: [
      {
        question: "How much time do I need each day?",
        answer:
          "About 20 minutes a night for 21 nights. Sessions are short, gentle, and designed to fit into your existing bedtime routine.",
      },
      {
        question: "Is this course suitable for complete beginners?",
        answer:
          "Yes. Every practice includes beginner options and is taught in clear, simple English. You don't need any prior yoga experience.",
      },
      {
        question: "Will this cure my insomnia?",
        answer:
          "This course does not treat medical conditions. It teaches wind down routines and paced breathing that support better sleep habits, and works alongside, not instead of, medical care.",
      },
      {
        question: "Can I access the course from outside India?",
        answer:
          "Yes. Students access the course from the UK, Singapore, the UAE, and other countries. All videos stream on phone, tablet, and laptop, with lifetime access.",
      },
      {
        question: "What if the course doesn't work for me?",
        answer:
          "If you complete the first week and don't feel any change in your sleep, contact us on WhatsApp within 14 days for a full refund. No questions asked.",
      },
    ],
    includes: [
      "13 guided video lessons across 3 weeks",
      "Lifetime access on phone, tablet, and laptop",
      "Downloadable breathing guide and bedtime checklist",
      "Track your progress lesson by lesson",
      "14 day full refund if week 1 doesn't help",
      "WhatsApp community access for questions",
    ],
  },
  {
    slug: "calm-under-pressure",
    tag: "Course - Stress",
    gradient: "linear-gradient(140deg,#2D6A4F,#95B8A6)",
    title: "Calm Under Pressure for busy professionals",
    description:
      "Short daily practices for the workday: desk release, box breathing, and a 10 minute reset between meetings.",
    price: "Rs. 2,499",
    priceValue: 2499,
    wasPrice: "Rs. 3,499",
    savePercent: 29,
    meta: "15 lessons, lifetime access",
    duration: "15 lessons, 5-10 minutes each",
    level: "Beginner to intermediate",
    format: "Recorded video, practice anywhere",
    cta: "View course",
    variant: "outline",
    rating: 4.8,
    reviewCount: 63,
    timeRequiredIso: "PT1H45M",
    heroLead:
      "A self paced online yoga course built for people whose calendars don't leave room for an hour on the mat. Desk-friendly releases, breathing resets, and quick recovery practices you can drop into a packed workday.",
    heroMeta: [
      "15 lessons, 5-10 min each",
      "3 modules, practice anywhere",
      "Beginner to intermediate",
      "Lifetime access, any device",
    ],
    coverKicker: "Relief that fits your calendar",
    coverHeading: "Regain your calm between meetings, not just on weekends",
    coverDescription:
      "Calm Under Pressure is built for the workday itself. No mat, no hour to spare, just short resets you can use at your desk, before a hard conversation, or the moment tension shows up in your shoulders.",
    coverStats: [
      { value: "15", label: "lessons" },
      { value: "3", label: "modules" },
      { value: "4.8", label: "rating" },
    ],
    introVideo: {
      heading: "A 2 minute look at how the course works",
      description:
        "Neha walks you through the three modules, how short each practice is, and how it fits into a real workday, so you know exactly what you're signing up for.",
      instructorLine: "Neha, founder and instructor",
      lengthLabel: "2 min preview",
    },
    about: [
      "Calm Under Pressure is built for people whose calendars don't leave room for an hour on the mat. Over 15 short lessons you'll pick up a toolkit of desk-friendly releases, breathing resets, and quick recovery practices.",
      "You can drop these into a packed workday: between meetings, before a hard conversation, or at the first sign of tension in your shoulders. Nothing here needs a mat, a quiet room, or a change of clothes.",
    ],
    highlights: [
      "10 minute resets you can do between back-to-back meetings",
      "Desk release sequences for neck, shoulders, and lower back, no mat required",
      "Box breathing and other techniques to regain focus fast before a hard conversation",
      "A calmer baseline that carries into how you handle pressure through the day",
      "Practices short enough to fit inside a coffee break, so you'll actually keep doing them",
    ],
    curriculum: [
      {
        title: "Module 1 — Desk release",
        subtitle: "5 lessons, about 34 minutes total",
        lessons: [
          { title: "Welcome, and practicing this course at your desk", duration: "4 min" },
          { title: "Neck and shoulder release, seated", duration: "7 min" },
          { title: "Standing spine and hip opener", duration: "8 min" },
          { title: "Wrist and forearm relief for screen time", duration: "6 min" },
          { title: "Recap: building your desk routine", duration: "9 min" },
        ],
      },
      {
        title: "Module 2 — Breath resets",
        subtitle: "5 lessons, about 31 minutes total",
        lessons: [
          { title: "Box breathing for a racing mind", duration: "6 min" },
          { title: "Extended exhale reset before a hard conversation", duration: "5 min" },
          { title: "Breathing for focus before deep work", duration: "7 min" },
          { title: "The 2 minute reset between calls", duration: "4 min" },
          { title: "Building your own breath toolkit", duration: "9 min" },
        ],
      },
      {
        title: "Module 3 — The 10 minute reset",
        subtitle: "5 lessons, about 40 minutes total",
        lessons: [
          { title: "Full body reset sequence, no mat needed", duration: "10 min" },
          { title: "Recovering after a difficult meeting", duration: "8 min" },
          { title: "End of day wind down at your desk", duration: "9 min" },
          { title: "Weekend reset for full recovery", duration: "7 min" },
          { title: "Putting it together: your pressure playbook", duration: "6 min" },
        ],
      },
    ],
    whoItsFor: [
      {
        title: "The back-to-back meeting professional",
        description:
          "Your calendar is wall-to-wall and you're carrying yesterday's tension into today's calls.",
      },
      {
        title: "The desk-bound body",
        description:
          "You sit most of the day and feel it in your neck, shoulders, and lower back by 3pm.",
      },
      {
        title: "The high-pressure decision maker",
        description:
          "You need to regain focus fast before a hard conversation or a big presentation.",
      },
      {
        title: "The always-on professional",
        description:
          "You want stress relief that fits inside a 10 minute break, not a full hour-long practice.",
      },
    ],
    instructorNote:
      "Calm Under Pressure comes straight from the resets Neha teaches her own corporate clients between back-to-back calls.",
    testimonials: [
      {
        quote:
          "The 2 minute reset between calls is the one habit that's actually stuck. My shoulders don't live around my ears anymore.",
        name: "Rohit S.",
        location: "Mumbai",
      },
      {
        quote:
          "I was skeptical about yoga at a desk, but the box breathing before a big presentation genuinely calmed me down in under a minute.",
        name: "Priya V.",
        location: "London",
      },
    ],
    faq: [
      {
        question: "How much time do I need each day?",
        answer:
          "Just 5 to 10 minutes. Lessons are built to fit inside a coffee break or the gap between two meetings.",
      },
      {
        question: "Do I need a yoga mat or a quiet room?",
        answer:
          "No. Every practice works at your desk, in a meeting room, or even in a hotel room while travelling.",
      },
      {
        question: "Will this help with chronic back or neck pain?",
        answer:
          "This course does not treat medical conditions. It teaches movement and breath resets that ease everyday tension, and works alongside, not instead of, medical care.",
      },
      {
        question: "Can I do this course from any country?",
        answer:
          "Yes. Students practice from India, the UK, Singapore, and beyond. Everything streams on phone, tablet, and laptop, with lifetime access.",
      },
      {
        question: "What if it doesn't help me manage stress?",
        answer:
          "If you complete the first week and don't feel calmer, contact us on WhatsApp within 14 days for a full refund. No questions asked.",
      },
    ],
    includes: [
      "15 guided video lessons across 3 modules",
      "Lifetime access on phone, tablet, and laptop",
      "Downloadable desk stretch and breathing cheat sheet",
      "Track your progress lesson by lesson",
      "14 day full refund if it doesn't help",
      "WhatsApp community access for questions",
    ],
  },
];

export function courseDisplayTitle(course: { title: string | null; data: unknown; slug: string }): string {
  return course.title || (course.data as { title?: string } | null)?.title || course.slug;
}

export function parseDurationMinutes(duration: string | null | undefined): number {
  if (!duration) return 0;
  const match = duration.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

const COVER_GRADIENTS = [
  "linear-gradient(135deg,#1B4332,#40916C)",
  "linear-gradient(135deg,#2D6A4F,#95B8A6)",
  "linear-gradient(135deg,#6B4A2D,#C9A227)",
  "linear-gradient(135deg,#7A4A3A,#E8745B)",
];

export function courseCoverGradient(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return COVER_GRADIENTS[hash % COVER_GRADIENTS.length];
}

export function emptyCourseData(slug: string, title: string): Course {
  return {
    slug,
    tag: "",
    gradient: "linear-gradient(140deg,#1B4332,#40916C)",
    title,
    description: "",
    price: "",
    priceValue: 0,
    wasPrice: "",
    savePercent: 0,
    meta: "",
    duration: "",
    level: "",
    format: "",
    cta: "View course",
    variant: "solid",
    rating: 0,
    reviewCount: 0,
    timeRequiredIso: "",
    heroLead: "",
    heroMeta: [],
    coverKicker: "",
    coverHeading: "",
    coverDescription: "",
    coverStats: [],
    introVideo: { heading: "", description: "", instructorLine: "", lengthLabel: "" },
    about: [],
    highlights: [],
    curriculum: [],
    whoItsFor: [],
    instructorNote: "",
    testimonials: [],
    faq: [],
    includes: [],
  };
}

export async function getAllCourses(): Promise<Course[]> {
  try {
    const rows = await prisma.course.findMany({ orderBy: { createdAt: "asc" } });
    if (rows.length > 0) {
      return rows.map(
        (row) => (row.data as unknown as Course) ?? emptyCourseData(row.slug, row.title || row.slug),
      );
    }
  } catch {
    // Course table not migrated yet, or DB unreachable — serve the defaults below.
  }
  return seedCourses;
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  try {
    const row = await prisma.course.findUnique({ where: { slug } });
    if (row) return (row.data as unknown as Course) ?? emptyCourseData(row.slug, row.title || row.slug);
  } catch {
    // Course table not migrated yet, or DB unreachable — fall back below.
  }
  return seedCourses.find((course) => course.slug === slug);
}
