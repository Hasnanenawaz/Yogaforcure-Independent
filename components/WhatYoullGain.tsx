export default function WhatYoullGain() {
  return (
    <section
      id="what-youll-gain"
      className="relative w-full bg-[#f5f1eb] py-16 sm:py-20 md:py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        {/* Section Heading */}
        <header className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="inline-block h-px w-6 bg-[#e8745b]" />
            <span className="text-[0.78rem] font-bold uppercase tracking-widest text-[#e8745b]">
              Real Results
            </span>
            <span className="inline-block h-px w-6 bg-[#e8745b]" />
          </div>
          <h2 className="font-extrabold text-[1.9rem] sm:text-3xl md:text-4xl lg:text-[2.4rem] leading-[1.15] text-[#1a3a1a] mb-4">
            What You’ll Gain
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#2d2d2d] max-w-3xl mx-auto">
            Real, lasting benefits from guided online yoga practice — taught
            clearly in English and adapted to your body.
          </p>
        </header>

        {/* Benefits List */}
        <div className="max-w-3xl mx-auto mb-12 sm:mb-16">
          <ul className="space-y-4 sm:space-y-5">
            <li className="flex items-start gap-4 text-left">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#9caf88]" />
              <span className="text-base sm:text-lg md:text-xl text-[#1a3a1a] leading-relaxed">
                Improved flexibility through safe, guided movements — without
                forcing or strain
              </span>
            </li>

            <li className="flex items-start gap-4 text-left">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#9caf88]" />
              <span className="text-base sm:text-lg md:text-xl text-[#1a3a1a] leading-relaxed">
                Functional strength that supports your joints, spine, and
                everyday movement
              </span>
            </li>

            <li className="flex items-start gap-4 text-left">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#9caf88]" />
              <span className="text-base sm:text-lg md:text-xl text-[#1a3a1a] leading-relaxed">
                Better posture, balance, and core stability through structured
                online yoga classes
              </span>
            </li>

            <li className="flex items-start gap-4 text-left">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#9caf88]" />
              <span className="text-base sm:text-lg md:text-xl text-[#1a3a1a] leading-relaxed">
                Increased body awareness and control with clear English
                instruction
              </span>
            </li>

            <li className="flex items-start gap-4 text-left">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#9caf88]" />
              <span className="text-base sm:text-lg md:text-xl text-[#1a3a1a] leading-relaxed">
                More confidence in movement, posture, and daily physical
                activity
              </span>
            </li>

            <li className="flex items-start gap-4 text-left">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#9caf88]" />
              <span className="text-base sm:text-lg md:text-xl text-[#1a3a1a] leading-relaxed">
                Consistency in practice without burnout, confusion, or
                overtraining
              </span>
            </li>
          </ul>
        </div>

        {/* Hidden SEO Reinforcement */}
        <p className="sr-only">
          Benefits of online yoga classes taught by an experienced Indian yoga
          instructor in English include flexibility, strength, posture
          correction, stress reduction, confidence, and sustainable long-term
          health.
        </p>
      </div>
    </section>
  );
}
