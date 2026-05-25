"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";

type PricingPlan = {
  id: string;
  title: string;
  price: string;
  duration: string;
  badge?: string | null;
};

const plans: PricingPlan[] = [
  { id: "monthly", title: "Monthly", price: "₹1500", duration: "per month" },
  {
    id: "3months",
    title: "3 Months",
    price: "₹3000",
    duration: "per 3 months",
  },
  {
    id: "6months",
    title: "6 Months",
    price: "₹5500",
    duration: "per 6 months",
    badge: "Best Value",
  },
  { id: "1year", title: "1 Year", price: "₹10000", duration: "per year" },
];

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export default function PricingCarousel() {
  const prefersReducedMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rafRef = useRef<number | null>(null);

  const defaultPlanIndex = Math.max(
    0,
    plans.findIndex((p) => p.badge),
  );
  const [activeIndex, setActiveIndex] = useState(defaultPlanIndex);

  const dotCount = plans.length;

  const transition = useMemo(
    () =>
      prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.55, ease: [0.4, 0, 0.2, 1] as const },
    [prefersReducedMotion],
  );

  const measureActive = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    if (scroller.clientWidth === 0) return;

    const viewportCenterX = scroller.scrollLeft + scroller.clientWidth / 2;

    let bestIdx = 0;
    let bestDist = Number.POSITIVE_INFINITY;

    for (let i = 0; i < plans.length; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const centerX = el.offsetLeft + el.clientWidth / 2;
      const dist = Math.abs(centerX - viewportCenterX);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }

    setActiveIndex(bestIdx);
  };

  const onScroll = () => {
    if (rafRef.current != null) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      measureActive();
    });
  };

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const initScroll = () => {
      const el = cardRefs.current[defaultPlanIndex];
      if (el) {
        scroller.scrollLeft =
          el.offsetLeft + el.clientWidth / 2 - scroller.clientWidth / 2;
      }
    };

    const onResize = () => measureActive();

    measureActive();
    requestAnimationFrame(() => requestAnimationFrame(initScroll));

    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToIndex = (idx: number) => {
    const scroller = scrollerRef.current;
    const el = cardRefs.current[idx];
    if (!scroller || !el) return;

    const targetLeft =
      el.offsetLeft + el.clientWidth / 2 - scroller.clientWidth / 2;
    scroller.scrollTo({
      left: targetLeft,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <section className="relative w-full bg-[#f5f1eb] py-16 sm:py-20 md:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-[#1a3a1a] mb-3">
            Pricing for group sessions
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-[#2d2d2d] max-w-3xl mx-auto leading-relaxed">
            Choose the plan that supports your consistency.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block">
            <button
              type="button"
              onClick={() => scrollToIndex(mod(activeIndex - 1, plans.length))}
              aria-label="Previous plan"
              className="
                absolute left-0 top-1/2 -translate-y-1/2
                z-10
                h-11 w-11 rounded-full
                bg-[#faf8f5]/70
                text-[#1a3a1a]/60
                hover:text-[#1a3a1a]
                hover:bg-[#faf8f5]
                transition-colors duration-300
                flex items-center justify-center
                select-none
              "
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scrollToIndex(mod(activeIndex + 1, plans.length))}
              aria-label="Next plan"
              className="
                absolute right-0 top-1/2 -translate-y-1/2
                z-10
                h-11 w-11 rounded-full
                bg-[#faf8f5]/70
                text-[#1a3a1a]/60
                hover:text-[#1a3a1a]
                hover:bg-[#faf8f5]
                transition-colors duration-300
                flex items-center justify-center
                select-none
              "
            >
              ›
            </button>
          </div>

          <div
            ref={scrollerRef}
            className="
              relative
              overflow-x-auto
              overflow-y-visible
              snap-x
              snap-mandatory
              scroll-smooth
              [-webkit-overflow-scrolling:touch]
              scrollbar-hide
              pt-6
              pb-12
              [--cardW:78vw]
              sm:[--cardW:56vw]
              md:[--cardW:42vw]
              lg:[--cardW:380px]
            "
            style={{
              scrollPaddingInline: "calc((100% - var(--cardW)) / 2)",
            }}
            aria-label="Pricing plans carousel"
            onScroll={onScroll}
          >
            <div
              className="flex w-max gap-6 sm:gap-7 md:gap-8 lg:gap-10 px-[calc((100%-var(--cardW))/2)]"
              style={{
                paddingInline: "calc((100% - var(--cardW)) / 2)",
              }}
            >
              {plans.map((plan, idx) => {
                const isActive = idx === activeIndex;
                const inactiveScale = 0.9;
                const activeScale = 1.08;

                return (
                  <motion.div
                    key={plan.id}
                    ref={(node) => {
                      cardRefs.current[idx] = node;
                    }}
                    className="snap-center shrink-0 w-[var(--cardW)]"
                    animate={{
                      scale: isActive ? activeScale : inactiveScale,
                      opacity: isActive ? 1 : 0.74,
                      zIndex: isActive ? 2 : 1,
                    }}
                    transition={transition}
                  >
                    <motion.div
                      animate={{
                        boxShadow: isActive
                          ? "0 22px 70px rgba(0,0,0,0.12)"
                          : "0 10px 30px rgba(0,0,0,0.06)",
                        borderColor: isActive
                          ? "rgba(45,90,45,0.35)"
                          : "rgba(237,232,224,0.7)",
                      }}
                      transition={transition}
                      className="
                        relative
                        h-full
                        rounded-3xl
                        bg-[#faf8f5]
                        border
                        p-7 sm:p-8
                      "
                      style={{
                        borderWidth: isActive ? 2 : 1,
                      }}
                    >
                      {plan.badge ? (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="inline-flex items-center rounded-full bg-[#9caf88]/60 text-[#1a3a1a] text-[11px] sm:text-xs font-semibold px-3 py-1 tracking-wide">
                            {plan.badge}
                          </span>
                        </div>
                      ) : null}

                      <div className="space-y-6">
                        <div className="space-y-1">
                          <h3 className="text-2xl sm:text-3xl font-semibold text-[#1a3a1a]">
                            {plan.title}
                          </h3>
                          <p className="text-sm sm:text-base text-[#6b8e5a]">
                            {plan.duration}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#ede8e0]/80">
                          <div className="text-4xl sm:text-5xl font-semibold text-[#1a3a1a] tracking-tight">
                            {plan.price}
                          </div>
                        </div>

                        <div className="pt-2">
                          <Link
                            href={getWhatsAppUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                              block w-full text-center
                              px-6 py-3.5
                              rounded-full
                              font-semibold
                              bg-[#2d5a2d] text-[#faf8f5]
                              hover:bg-[#1a3a1a]
                              transition-colors duration-300
                            "
                          >
                            Get Started
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: dotCount }).map((_, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to ${plans[i].title} plan`}
                className="p-2"
              >
                <span
                  className={[
                    "block rounded-full transition-all duration-300",
                    isActive
                      ? "w-6 h-2 bg-[#2d5a2d]"
                      : "w-2 h-2 bg-[#9caf88]/50",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
