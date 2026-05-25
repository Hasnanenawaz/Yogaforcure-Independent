import React, { useEffect } from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface HeroProps {
  onHeroReady?: () => void;
}

export default function Hero({ onHeroReady }: HeroProps) {
  useEffect(() => {
    // Call onHeroReady when component mounts
    onHeroReady?.();
  }, [onHeroReady]);
  return (
    <div className="relative min-h-screen font-sans text-gray-800 overflow-x-hidden bg-white">
      {/* Mobile-only background image layer: public/photos/yoga-hero-mobile.webp (small screens only) */}
      <div
        className="absolute inset-0 z-0 lg:hidden"
        aria-hidden
        style={{
          backgroundImage: "url('/photos/yoga-hero-mobile.webp')",
          backgroundSize: "cover",
          backgroundPosition: "35% center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Overlay on mobile: darkens background image slightly so it's less bright and text stays readable */}
      <div
        className="absolute inset-0 z-0 bg-black/35 pointer-events-none lg:hidden"
        aria-hidden
      />
      {/* WhatsApp button: mobile only, bottom-right of hero with bounce animation */}
      <div className="absolute bottom-6 right-4 z-20 lg:hidden">
        <Link
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-xl shadow-green-100/50 animate-bounce"
          aria-label="Chat on WhatsApp"
        >
          <img
            src="/whatsappicon.webp"
            alt="WhatsApp"
            className="w-8 h-8 object-contain"
          />
        </Link>
      </div>
      {/* Hero Section: on mobile, only heading/text/buttons overlaid on background; on desktop, two-column layout with hero-section.webp */}
      <section aria-label="Hero" className="relative z-10 container mx-auto px-4 sm:px-6 pt-12 sm:pt-16 lg:pt-0 xl:pt-0 2xl:pt-0 pb-16 sm:pb-24 lg:-mt-20 xl:-mt-24 2xl:-mt-28 min-h-screen flex flex-col justify-center lg:block">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Content - on mobile: overlaid on yoga-hero-mobile.jpeg background; on desktop: left column */}
          <div className="relative z-10 max-w-xl mx-auto lg:mx-0 lg:ml-10 lg:pt-24 xl:pt-28 2xl:pt-32 text-center lg:text-left">
            <div className="mb-4 sm:mb-6 flex justify-center lg:justify-start">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mb-2">
                <Leaf className="w-5 h-5 text-green-600" />
              </span>
            </div>

            <h2 className="text-5xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.15] text-white lg:text-gray-900 mb-4 sm:mb-6">
              Build{" "}
              <span className="text-[#51e17a] lg:text-[#2d5a2d]">strength</span>
              . Improve{" "}
              <span className="text-[#51e17a] lg:text-[#2d5a2d]">
                flexibility
              </span>
              .
            </h2>

            <p className="text-white lg:text-gray-500 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
              Feel better in your body. Yoga that fits your life, wherever you
              are.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#2d5a2d] hover:bg-[#1a3a1a] text-white px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-3.5 rounded-md font-medium text-sm sm:text-base transition-all shadow-lg shadow-green-200"
              >
                Join Class
              </Link>

              <Link
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#2d5a2d] hover:bg-[#1a3a1a] text-white px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-3.5 rounded-md font-medium text-sm sm:text-base transition-all shadow-lg shadow-green-200"
              >
                Book a Consultation
              </Link>
            </div>
          </div>

          {/* Right Content - hero-section.webp + WhatsApp; hidden on mobile (replaced by yoga-hero-mobile.jpeg background) */}
          <div className="hidden lg:flex relative h-[700px] xl:h-[800px] 2xl:h-[900px] items-center justify-center pt-24 xl:pt-28 2xl:pt-32">
            {/* Main Image Container */}
            <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl aspect-[3/4] lg:aspect-auto lg:h-full">
              {/* Background decorative blob */}
              <div className="absolute inset-0 bg-gradient-to-tr from-green-50 to-transparent rounded-full blur-3xl opacity-60 transform translate-y-10"></div>

              {/* Main Image */}
              <img
                src="/hero-section.webp"
                alt="Yoga instructor in practice — Yoga by Neha online classes"
                className="relative z-10 w-full h-full object-contain object-center rounded-3xl lg:rounded-none lg:bg-transparent"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, black 80%, transparent 100%)",
                }}
              />

              {/* Floating Elements */}

              {/* WhatsApp Icon - Top Right */}
              <div className="absolute top-12 sm:top-20 right-0 lg:-right-4 z-20 bg-white p-3 sm:p-4 lg:p-5 rounded-2xl shadow-xl shadow-green-100/50 animate-bounce duration-3000">
                <div className="bg-green-50 p-2 sm:p-3 rounded-xl">
                  <Link
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src="/whatsappicon.webp"
                      alt="WhatsApp"
                      className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 object-contain"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
