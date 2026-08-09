"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import FloatingNavbar from "@/components/FloatingNavbar";
import HashScrollHandler from "@/components/HashScrollHandler";
import SplashScreen from "@/components/SplashScreen";
import ProgramsAndCourses from "@/components/sections/ProgramsAndCourses";
import FAQSection from "@/components/sections/FAQSection";
import WhatWeOffer from "@/components/WhatWeOffer";
import WhyLearnWithMe from "@/components/WhyLearnWithMe";
import WhatYoullGain from "@/components/WhatYoullGain";
import WeeklyLiveSessions from "@/components/WeeklyLiveSessions";
import PricingCarousel from "@/components/PricingCarousel";
import GallerySlideshow from "@/components/GallerySlideshow";
import ClientReviewReels from "@/components/ClientReviewReels";
import ClosingCTA from "@/components/ClosingCTA";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import type { Course } from "@/lib/courses";

export default function HomeClient({ courses }: { courses: Course[] }) {
  const [heroReady, setHeroReady] = useState(false);
  const [contentInteractive, setContentInteractive] = useState(false);

  const onHeroReady = useCallback(() => {
    setHeroReady(true);
  }, []);

  return (
    <>
      <SplashScreen
        heroReady={heroReady}
        onReveal={() => setContentInteractive(true)}
      />
      {/* Main content visible from first paint; overlay does not gate visibility */}
      <div className={contentInteractive ? "" : "pointer-events-none"}>
        <FloatingNavbar />
        <HashScrollHandler />
        <main className="relative">
          <h1 className="sr-only">
            Yoga by Neha — Online Indian yoga teacher for strength and
            flexibility.
          </h1>
          <Hero onHeroReady={onHeroReady} />
          <ProgramsAndCourses courses={courses} />
          <WhatWeOffer />
          <WhyLearnWithMe />
          <WhatYoullGain />
          <WeeklyLiveSessions />
          <section id="pricing" className="scroll-mt-24">
            <PricingCarousel />
          </section>
          <section
            id="gallery"
            className="relative min-h-screen bg-gradient-to-b from-[#f5f1eb] to-[#ede8e0] pt-16 pb-20 lg:pt-24 lg:pb-32 scroll-mt-24"
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
              <div className="text-center mb-10 lg:mb-14">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="inline-block h-px w-6 bg-[#e8745b]" />
                  <span className="text-[0.78rem] font-bold uppercase tracking-widest text-[#e8745b]">
                    Gallery
                  </span>
                  <span className="inline-block h-px w-6 bg-[#e8745b]" />
                </div>
                <h2 className="font-extrabold text-[1.9rem] sm:text-3xl md:text-4xl lg:text-[2.4rem] leading-[1.15] text-[#1a3a1a]">
                  Moments from the mat
                </h2>
              </div>
              <GallerySlideshow />
              <div className="mt-12 lg:mt-16 flex justify-center">
                <Link
                  href="/gallery"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full font-semibold bg-[#2d5a2d] text-[#faf8f5] hover:bg-[#1a3a1a] transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                  See more
                </Link>
              </div>
            </div>
          </section>
          <ClientReviewReels />
          <Testimonials />
          <FAQSection />
          <ClosingCTA />

          {/* Other sections temporarily hidden for video hero evaluation */}
          {/* <Offers />
          
          <Gallery />
          <CTA /> */}
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}
