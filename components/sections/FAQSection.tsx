import { ChevronDown } from "lucide-react";
import Reveal from "@/components/Reveal";
import { homeFaq } from "@/lib/homeFaq";

export default function FAQSection() {
  return (
    <section
      id="faq"
      className="relative w-full bg-[#f5f1eb] py-16 sm:py-20 lg:py-[84px] scroll-mt-24"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-12">
        <Reveal>
          <div className="text-center mb-10 lg:mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="inline-block h-px w-6 bg-[#e8745b]" />
              <span className="text-[0.78rem] font-bold uppercase tracking-widest text-[#e8745b]">
                FAQ
              </span>
              <span className="inline-block h-px w-6 bg-[#e8745b]" />
            </div>
            <h2 className="font-extrabold text-[1.9rem] sm:text-3xl md:text-4xl lg:text-[2.4rem] leading-[1.15] text-[#1a3a1a]">
              Questions, answered
            </h2>
          </div>
        </Reveal>

        <Reveal>
          <div className="flex flex-col gap-3">
            {homeFaq.map((item) => (
              <details
                key={item.question}
                className="group bg-[#faf8f5] rounded-2xl border border-[#ede8e0]/80 open:shadow-sm"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 sm:px-6 py-4 sm:py-5">
                  <span className="font-semibold text-[#1a3a1a] text-[0.98rem] sm:text-base">
                    {item.question}
                  </span>
                  <ChevronDown className="w-5 h-5 text-[#2d5a2d] shrink-0 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="px-5 sm:px-6 pb-5 sm:pb-6 -mt-1 text-[#2d2d2d] text-sm sm:text-base leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
