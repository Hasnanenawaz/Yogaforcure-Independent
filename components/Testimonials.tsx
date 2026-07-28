"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";

const testimonials = [
  {
    name: "Manasa Hemanth",
    role: "Product Lead",
    text: "The sessions feel thoughtfully structured and genuinely calming. It's become the most reliable part of my week.",
    avatar: "MH",
    timeAgo: "2 weeks ago",
    likes: 24,
  },
  {
    name: "Chaya Malakar",
    role: "Student",
    text: "Clear guidance, consistent progress, and a calmer mind. The experience feels premium without being intimidating.",
    avatar: "CM",
    timeAgo: "1 month ago",
    likes: 18,
  },
  {
    name: "Megha Goutham",
    role: "Operations Manager",
    text: "It's the right balance of gentle and effective. I'm stronger, more mobile, and far less stressed day to day.",
    avatar: "MG",
    timeAgo: "3 weeks ago",
    likes: 31,
  },
  {
    name: "Aarav Mehta",
    role: "Engineering Manager",
    text: "The pacing is excellent—calm, confident, and steady. It's helped me build a practice I can actually maintain.",
    avatar: "AM",
    timeAgo: "1 week ago",
    likes: 12,
  },
  {
    name: "Priya Sharma",
    role: "HR / People Ops",
    text: "Our team sessions feel grounded and energizing. People show up, stay consistent, and feel better afterward.",
    avatar: "PS",
    timeAgo: "2 months ago",
    likes: 27,
  },
  {
    name: "Daniel Kim",
    role: "Consultant",
    text: "Small improvements compounded quickly. The guidance is precise, and the overall vibe is incredibly reassuring.",
    avatar: "DK",
    timeAgo: "3 weeks ago",
    likes: 15,
  },
];

/** YouTube dark-theme comment card: avatar, name + time, body, like (red heart) + reply */
function TestimonialCard({
  t,
}: {
  t: (typeof testimonials)[number];
}) {
  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(39, 39, 39, 0.95)" }}
      transition={{ type: "tween", duration: 0.2 }}
      className="w-[320px] sm:w-[380px] shrink-0 rounded-xl bg-[#272727] px-4 py-3 sm:px-5 sm:py-4"
    >
      <div className="flex gap-3 sm:gap-4">
        {/* Avatar — YouTube style */}
        <div
          className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full bg-[#3f3f3f] flex items-center justify-center text-[#e0e0e0] text-xs sm:text-sm font-medium"
          aria-hidden
        >
          {t.avatar}
        </div>
        <div className="min-w-0 flex-1">
          {/* Header: name + time ago (exactly like YouTube) */}
          <div className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-[13px] sm:text-sm font-medium text-white">
              {t.name}
            </span>
            <span className="text-[12px] sm:text-xs text-[#909090]">
              {t.timeAgo}
            </span>
          </div>
          {/* Comment body */}
          <p className="mt-1 text-[13px] sm:text-sm leading-[1.5] text-[#aaaaaa]">
            {t.text}
          </p>
          {/* Action row: like (red heart) + reply — YouTube style */}
          <div className="mt-2 flex items-center gap-4">
            <button
              type="button"
              className="flex items-center gap-1.5 text-[#909090] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3ea6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f] rounded"
              aria-label={`${t.likes} likes`}
            >
              <Heart
                className="h-4 w-4 sm:h-[18px] sm:w-[18px] fill-[#ff0000] text-[#ff0000]"
                strokeWidth={2}
                aria-hidden
              />
              <span className="text-[12px] sm:text-xs font-medium">
                {t.likes}
              </span>
            </button>
            <button
              type="button"
              className="text-[12px] sm:text-xs font-medium text-[#909090] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3ea6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f] rounded"
              aria-label="Reply"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const prefersReducedMotion = useReducedMotion();
  const track = [...testimonials, ...testimonials];

  return (
    <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f] overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        {/* Section header — dark theme */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 lg:mb-16"
        >
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#e8745b]">
            Testimonials
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
            What our community says
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#aaaaaa] max-w-2xl mx-auto">
            Real experiences from people who found their practice here.
          </p>
        </motion.div>

        {/* Marquee rows — YouTube comment cards */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <div className="relative overflow-hidden">
            <div
              className={`flex w-max gap-5 sm:gap-6 ${prefersReducedMotion ? "" : "testimonial-marquee-left"}`}
            >
              {track.map((t, i) => (
                <TestimonialCard key={`${t.name}-${t.role}-${i}`} t={t} />
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden">
            <div
              className={`flex w-max gap-5 sm:gap-6 ${prefersReducedMotion ? "" : "testimonial-marquee-right"}`}
            >
              {track.map((t, i) => (
                <TestimonialCard key={`${t.name}-${t.role}-b-${i}`} t={t} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
