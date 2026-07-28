import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Leaf } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface HeroProps {
  onHeroReady?: () => void;
}

export default function Hero({ onHeroReady }: HeroProps) {
  useEffect(() => {
    onHeroReady?.();
  }, [onHeroReady]);

  return (
    <div className="relative overflow-x-hidden lg:overflow-hidden bg-gradient-to-b from-[#faf8f5] via-white to-white lg:h-dvh lg:max-h-dvh">
      {/* Mobile background hero */}
      <div
        className="absolute inset-0 z-0 lg:hidden overflow-hidden"
        aria-hidden
      >
        <Image
          src="/newPics/mobilehero.webp"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* WhatsApp — mobile & tablet */}
      <div className="absolute bottom-5 right-4 sm:bottom-6 sm:right-6 z-20 lg:hidden">
        <Link
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-lg shadow-green-100/60 ring-1 ring-black/5"
          aria-label="Chat on WhatsApp"
        >
          <Image
            src="/whatsappicon.webp"
            alt="WhatsApp"
            width={32}
            height={32}
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
          />
        </Link>
      </div>

      <section
        aria-label="Hero"
        className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10 pt-[5.25rem] sm:pt-[5.5rem] lg:pt-20 pb-10 sm:pb-90 lg:pb-0 min-h-[100dvh] lg:min-h-0 lg:h-full flex items-center"
      >
        <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-9 lg:gap-10 xl:gap-12 lg:h-[calc(100dvh-5rem)] lg:max-h-[calc(100dvh-5rem)] lg:min-h-0 lg:items-center ">
          {/* Copy */}
          <div className="flex flex-col justify-center text-center lg:text-left lg:max-w-xl lg:mx-0 order-1 lg:h-full lg:py-4">
            <div className="mb-2 sm:mb-3 flex justify-center lg:justify-start">
              <span className="inline-flex items-center justify-center w-9 h-9 bg-[#e4eee7]/90 rounded-full">
                <Leaf className="w-5 h-5 text-[#40916C]" />
              </span>
            </div>

            <h2 className="text-[2rem] leading-[1.12] sm:text-4xl md:text-[2.65rem] lg:text-[2.5rem] xl:text-[2.85rem] 2xl:text-5xl font-bold text-white lg:text-gray-900 mb-3 sm:mb-4">
              Build{" "}
              <span className="text-[#51e17a] lg:text-[#40916C]">strength</span>
              . Improve{" "}
              <span className="text-[#51e17a] lg:text-[#40916C]">
                flexibility
              </span>
              .
            </h2>

            <p className="text-white/95 lg:text-gray-600 text-base sm:text-lg lg:text-base xl:text-lg mb-5 sm:mb-6 lg:mb-7 leading-relaxed max-w-md mx-auto lg:mx-0">
              Feel better in your body. Yoga that fits your life, wherever you
              are.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-center lg:justify-start">
              <Link
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#e8745b] text-white px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 shadow-[0_8px_20px_rgba(232,116,91,0.32)] hover:shadow-[0_14px_28px_rgba(232,116,91,0.4)] hover:-translate-y-0.5"
              >
                Join Class
              </Link>
              <Link
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white/95 hover:bg-white text-[#2d5a2d] lg:bg-white lg:hover:bg-[#e4eee7] border border-white/30 lg:border-[#2d5a2d]/40 px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300"
              >
                Book a Consultation
              </Link>
            </div>
          </div>

          {/* Desktop hero — centered beside text, zoomed in */}
          <div className="hidden lg:flex order-2 items-center justify-center w-full h-full min-h-0 overflow-hidden">
            <div className="relative h-[min(82dvh,820px)] w-full max-w-[640px] xl:max-w-[720px] 2xl:max-w-[800px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-50/80 via-transparent to-transparent rounded-full blur-3xl opacity-75 pointer-events-none scale-90" />

              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src="/newPics/nobgheroimage.webp"
                  alt="Yoga instructor in practice — Yoga by Neha online classes"
                  fill
                  priority
                  className="object-contain object-center scale-[1.10] xl:scale-[1.12]  origin-center drop-shadow-[0_16px_48px_rgba(0,0,0,0)]"
                  sizes="(min-width: 1536px) 800px, (min-width: 1280px) 720px, 640px"
                />
              </div>

              <div className="absolute top-[10%] right-0 xl:right-2 z-20 bg-white p-3 xl:p-4 rounded-2xl shadow-xl shadow-green-100/50 ring-1 ring-black/5 animate-bounce motion-reduce:animate-none">
                <Link
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  aria-label="Chat on WhatsApp"
                >
                  <Image
                    src="/whatsappicon.webp"
                    alt="WhatsApp"
                    width={48}
                    height={48}
                    className="w-10 h-10 xl:w-12 xl:h-12 object-contain"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
