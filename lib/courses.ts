export type Course = {
  slug: string;
  tag: string;
  gradient: string;
  title: string;
  description: string;
  longDescription: string;
  price: string;
  meta: string;
  duration: string;
  level: string;
  format: string;
  cta: string;
  variant: "solid" | "outline";
  highlights: string[];
  curriculum: { title: string; description: string }[];
  whoItsFor: string[];
};

export const courses: Course[] = [
  {
    slug: "sleep-reset",
    tag: "Course - Sleep",
    gradient: "linear-gradient(140deg,#1B4332,#40916C)",
    title: "Sleep Reset: 21 nights to deeper rest",
    description:
      "Wind down sequences and breath pacing that train your body to switch off. Practice each night from home.",
    longDescription:
      "Sleep Reset is a 21 night, self-paced video course built around a simple idea: your nervous system can be trained to switch off, the same way it's been trained to stay switched on. Each night you'll follow a short wind-down sequence, a breath pacing exercise, and a guided relaxation designed to shorten the time it takes you to fall asleep and improve how rested you feel in the morning.",
    price: "Rs. 1,999",
    meta: "24 lessons, lifetime access",
    duration: "21 nights, ~20 minutes a day",
    level: "All levels",
    format: "Recorded video, practice at home",
    cta: "View course",
    variant: "solid",
    highlights: [
      "Fall asleep faster with a repeatable wind-down ritual",
      "Learn breath pacing techniques that calm a racing mind",
      "Reduce nighttime restlessness and 3am wake-ups",
      "Build a sustainable bedtime routine you'll actually keep",
    ],
    curriculum: [
      {
        title: "Week 1 — Settling the body",
        description:
          "Gentle floor sequences and progressive muscle relaxation to release physical tension held from the day.",
      },
      {
        title: "Week 2 — Slowing the breath",
        description:
          "Breath pacing drills (extended exhales, box breathing) that shift your nervous system out of alert mode.",
      },
      {
        title: "Week 3 — Quieting the mind",
        description:
          "Guided body scans and yoga nidra style relaxations to switch off mental chatter before sleep.",
      },
    ],
    whoItsFor: [
      "Anyone who lies awake replaying the day instead of falling asleep",
      "Shift workers and frequent travellers with disrupted sleep patterns",
      "People who've tried meditation apps but want a structured, guided path",
    ],
  },
  {
    slug: "calm-under-pressure",
    tag: "Course - Stress",
    gradient: "linear-gradient(140deg,#2D6A4F,#95B8A6)",
    title: "Calm Under Pressure for busy professionals",
    description:
      "Short daily practices for the workday: desk release, box breathing, and a 10 minute reset between meetings.",
    longDescription:
      "Calm Under Pressure is built for people whose calendars don't leave room for an hour on the mat. Over 30 short lessons you'll pick up a toolkit of desk-friendly releases, breathing resets, and quick recovery practices you can drop into a packed workday — between meetings, before a hard conversation, or at the first sign of tension in your shoulders.",
    price: "Rs. 2,499",
    meta: "30 lessons, lifetime access",
    duration: "30 lessons, 5-10 minutes each",
    level: "Beginner to intermediate",
    format: "Recorded video, practice anywhere",
    cta: "View course",
    variant: "outline",
    highlights: [
      "10 minute resets you can do between back-to-back meetings",
      "Desk release sequences for neck, shoulders, and lower back",
      "Box breathing and other techniques to regain focus fast",
      "A calmer baseline that carries into how you handle pressure",
    ],
    curriculum: [
      {
        title: "Module 1 — Desk release",
        description:
          "Seated and standing stretches that undo hours of screen posture, no mat required.",
      },
      {
        title: "Module 2 — Breath resets",
        description:
          "Box breathing and other pacing techniques to lower stress response in under two minutes.",
      },
      {
        title: "Module 3 — The 10 minute reset",
        description:
          "A complete movement and breath sequence for the moments you need to reset before the next meeting.",
      },
    ],
    whoItsFor: [
      "Professionals who sit most of the day and feel it in their body",
      "Anyone who wants stress tools that fit inside a 10 minute break",
      "People who want practical relief, not a full hour-long practice",
    ],
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}
