import Image from "next/image";
import { Check } from "lucide-react";

export default function WhyLearnWithMe() {
  return (
    <section
      id="why-learn-with-me"
      className="relative w-full bg-[#1a3a1a] py-16 sm:py-20 md:py-24 lg:py-32 scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16 xl:gap-20">
          {/* Left Column: Instructor Image */}
          <div className="shrink-0 w-full lg:w-auto flex justify-center">
            <div className="flex flex-col items-center w-[min(100%,16rem)] sm:w-80 lg:w-96">
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 rounded-full border-2 border-[#9caf88]/30" />
                <div className="absolute inset-2 rounded-full border border-[#9caf88]/20" />
                <div className="absolute inset-4 rounded-full overflow-hidden bg-[#ede8e0]">
                  <Image
                    src="/gallery_yoga/neha_2.jpeg"
                    alt="Experienced Indian yoga instructor Neha teaching online yoga classes in English"
                    width={400}
                    height={400}
                    sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                    priority={false}
                  />
                </div>
              </div>
              <p className="mt-5 w-full text-center text-sm sm:text-base font-bold text-[#e8745b] tracking-[0.2em] uppercase">
                Neha
              </p>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="flex-1 space-y-6 sm:space-y-8 text-left">
            <div className="flex items-center gap-2">
              <span className="inline-block h-px w-6 bg-[#e8745b]" />
              <span className="text-[0.78rem] font-bold uppercase tracking-widest text-[#e8745b]">
                Meet Your Instructor
              </span>
            </div>

            {/* SEO Heading */}
            <h2 className="font-extrabold text-[1.9rem] sm:text-3xl md:text-4xl lg:text-[2.4rem] leading-[1.15] text-[#faf8f5]">
              Why Learn Yoga Online with an Experienced Instructor?
            </h2>

            {/* Intro Paragraph */}
            <p className="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl text-[#f5f1eb] leading-relaxed max-w-3xl">
              I am an experienced Indian yoga instructor with over 10 years of
              teaching practice, offering live online yoga classes in clear,
              fluent English for students around the world.
            </p>

            {/* Benefits List */}
            <ul className="space-y-4 sm:space-y-5 pt-2">
              {[
                "I carefully observe your posture and movement during live online yoga classes",
                "I understand different body types, limitations, and pain patterns",
                "I guide with experience — not random instructions or unsafe pushing",
                "I teach yoga in fluent English, so every instruction feels clear and confident",
                "I stay personally involved until you feel real strength, flexibility, and relief",
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="flex-shrink-0 mt-1">
                    <Check
                      className="w-5 h-5 sm:w-6 sm:h-6 text-[#9caf88]"
                      strokeWidth={2.5}
                    />
                  </span>
                  <span className="text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl text-[#f5f1eb] leading-relaxed">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            {/* Authority & Trust */}
            <div className="pt-4 space-y-4">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl text-[#f5f1eb] leading-relaxed max-w-3xl">
                I don’t believe in quick fixes or generic routines.
              </p>

              <p className="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl text-[#f5f1eb] leading-relaxed max-w-3xl">
                My online yoga classes are rooted in authentic Indian yoga
                traditions and adapted for modern lifestyles — taught clearly in
                English so you always understand why you are doing each
                movement.
              </p>

              <p className="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl text-[#f5f1eb] leading-relaxed max-w-3xl">
                Students often come to me with pain, stiffness, stress, or low
                confidence. With consistent practice, they don’t just see
                changes — they feel stronger, calmer, and more connected to
                their bodies.
              </p>
            </div>

            {/* Hidden SEO Signal */}
            <p className="sr-only">
              Experienced Indian yoga instructor offering online yoga classes in
              English for beginners, seniors, working professionals, and
              international students.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
