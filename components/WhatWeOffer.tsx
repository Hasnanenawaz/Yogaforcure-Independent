"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const offerings = [
  {
    id: 1,
    title: "Online Group Live Yoga Classes",
    summary:
      "Live online yoga classes led by an experienced Indian yoga instructor, focusing on strength, flexibility, balance, and core stability.",
    description:
      "These group yoga sessions are ideal if you want structured practice, consistency, and guidance from a qualified English-speaking yoga teacher in India. Classes are suitable for beginners and intermediate practitioners looking to build strength, mobility, and confidence through authentic yoga practice.",
    imageSrc: "/newPics/group.webp",
    href: "#live-group-sessions",
  },
  {
    id: 2,
    title: "1-on-1 Personalized Online Yoga Sessions",
    summary:
      "Fully customized one-on-one online yoga sessions designed around your body, lifestyle, health goals, and limitations.",
    description:
      "These private yoga classes are taught by an experienced Indian yoga instructor in fluent English. Sessions focus on posture correction, pain management, strength building, flexibility, and sustainable lifestyle changes. Personalized diet guidance is also provided to support long-term results.",
    includes: [
      "Personalized online yoga sessions with full attention",
      "Clear English instruction and posture correction",
      "Support for pain relief, weight management, and mobility",
      "Flexible scheduling to fit your daily routine",
      "Lifestyle and diet guidance for holistic improvement",
    ],
    imageSrc: "/newPics/1on1.webp",
    href: "#one-on-one-sessions",
  },
  {
    id: 3,
    title: "Online Yoga Practice Library (YouTube Membership)",
    summary:
      "A self-paced online yoga library with 100+ guided sessions, including strength, flexibility, fat loss, and mobility programs.",
    description:
      "This option is ideal if you prefer practicing yoga at your own pace with guidance from an experienced Indian yoga teacher. All sessions are explained clearly in English and designed to help you stay consistent without a fixed schedule.",
    imageSrc: "/newPics/youtubeimage.webp",
    href: "https://www.youtube.com/channel/UCpXHyfQbeKQXHCl5vKISokQ/join",
    external: true,
  },
  {
    id: 4,
    title: "Corporate Yoga & Wellness Programs",
    summary:
      "Professional online corporate yoga programs designed to reduce stress, improve posture, and enhance workplace productivity.",
    description:
      "Led by an experienced Indian yoga instructor, these corporate wellness sessions are conducted in English and tailored for modern work environments. Programs focus on stress management, posture correction, mental clarity, and sustainable employee well-being.",
    imageSrc: "/newPics/corporateSession.webp",
    href: "#corporate-wellness",
  },
];

export default function WhatWeOffer() {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section
      id="what-we-offer"
      className="relative w-full bg-[#f5f1eb] py-16 sm:py-20 md:py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20">
        <header className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1a3a1a] mb-4">
            Our Yoga Programs
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#2d2d2d] max-w-3xl mx-auto">
            Choose from live group classes, personalized one-on-one sessions, or
            self-paced online yoga programs — all taught in clear English.{" "}
            <Link
              href="/#pricing"
              className="text-[#e8745b] hover:text-[#f0906f] font-medium no-underline"
            >
              View pricing
            </Link>
            {" · "}
            <Link
              href="/#weekly-live-sessions"
              className="text-[#e8745b] hover:text-[#f0906f] font-medium no-underline"
            >
              View schedule
            </Link>
          </p>
        </header>

        <div className="space-y-10 sm:space-y-12 md:space-y-14 lg:space-y-16">
          {offerings.map((offering, index) => {
            const isExpanded = expandedIds.has(offering.id);

            return (
              <article
                key={offering.id}
                id={offering.href.replace("#", "")}
                className="bg-[#faf8f5] rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-[#ede8e0]/60 shadow-sm overflow-hidden"
              >
                <div
                  className={`flex flex-col gap-6 sm:gap-8 lg:gap-10 xl:gap-12 lg:flex-row lg:items-stretch ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Program image — top on mobile, side on desktop */}
                  <div className="shrink-0 w-full lg:w-[42%] xl:w-[40%] max-w-none mx-auto lg:mx-0 order-first">
                    <div className="relative w-full aspect-[4/5] sm:aspect-[5/6] md:aspect-[4/5] lg:aspect-[3/4] xl:aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-[#f0ebe3] to-[#e8e2d9] ring-1 ring-[#ede8e0]/80 shadow-inner">
                      <Image
                        src={offering.imageSrc}
                        alt={`${offering.title} taught by experienced Indian yoga instructor online in English`}
                        fill
                        className="object-contain object-center p-3 sm:p-4 md:p-5"
                        sizes="(max-width: 768px) 92vw, (max-width: 1024px) 45vw, 420px"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1 flex flex-col min-w-0 min-h-0 order-last lg:order-none">
                    <h3 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-semibold text-[#1a3a1a] mb-3 sm:mb-4">
                      {offering.title}
                    </h3>

                    <p className="text-sm sm:text-base md:text-lg xl:text-xl text-[#2d2d2d] leading-relaxed mb-3 sm:mb-4">
                      {offering.summary}
                    </p>

                    <p
                      className={`text-sm sm:text-base md:text-lg xl:text-xl text-[#2d2d2d] leading-relaxed mb-3 sm:mb-4 ${
                        isExpanded
                          ? "max-lg:line-clamp-none"
                          : "line-clamp-4 max-lg:line-clamp-3"
                      }`}
                    >
                      {offering.description}
                    </p>

                    {offering.includes && (
                      <ul
                        className={`space-y-2 mb-3 sm:mb-4 ${
                          isExpanded
                            ? "max-lg:line-clamp-none"
                            : "line-clamp-5 max-lg:line-clamp-3"
                        }`}
                      >
                        {offering.includes.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start text-sm sm:text-base md:text-lg text-[#2d2d2d]"
                          >
                            <span className="text-[#9caf88] mr-3 mt-1 shrink-0">
                              •
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="lg:hidden shrink-0 mb-2">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(offering.id)}
                        className="text-[#e8745b] hover:text-[#f0906f] font-medium text-sm"
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? "Show less" : "Learn more"}
                      </button>
                    </div>

                    <div className="mt-auto pt-2 sm:pt-4">
                      <Link
                        href={
                          offering.external ? offering.href : getWhatsAppUrl()
                        }
                        target={offering.external ? "_blank" : undefined}
                        rel={
                          offering.external ? "noopener noreferrer" : undefined
                        }
                        className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 sm:py-3.5 bg-[#2d5a2d] text-[#faf8f5] font-semibold rounded-full hover:bg-[#1a3a1a] transition-colors text-sm sm:text-base"
                      >
                        {offering.id === 2 || offering.id === 4
                          ? "Enquire Now"
                          : "Enroll Now"}
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="sr-only">
          Experienced Indian yoga instructor offering online yoga classes in
          English, including group yoga sessions, one-on-one personalized yoga,
          corporate wellness, and self-paced online yoga programs.
        </p>
      </div>
    </section>
  );
}
