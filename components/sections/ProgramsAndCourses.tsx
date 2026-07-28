const courses = [
  {
    tag: "Course - Sleep",
    gradient: "linear-gradient(140deg,#1B4332,#40916C)",
    title: "Sleep Reset: 21 nights to deeper rest",
    description:
      "Wind down sequences and breath pacing that train your body to switch off. Practice each night from home.",
    price: "Rs. 1,999",
    meta: "24 lessons, lifetime access",
    cta: "View course",
    variant: "solid" as const,
  },
  {
    tag: "Course - Stress",
    gradient: "linear-gradient(140deg,#2D6A4F,#95B8A6)",
    title: "Calm Under Pressure for busy professionals",
    description:
      "Short daily practices for the workday: desk release, box breathing, and a 10 minute reset between meetings.",
    price: "Rs. 2,499",
    meta: "30 lessons, lifetime access",
    cta: "View course",
    variant: "outline" as const,
  },
  {
    tag: "Live - Group classes",
    gradient: "linear-gradient(140deg,#8C6A1D,#C9A227)",
    title: "Live online group classes",
    description:
      "Practice together on Zoom, mornings and evenings IST, with timings shared for the UK and Singapore too.",
    price: "From Rs. 2,000/mo",
    meta: "See schedule",
    cta: "See the schedule",
    variant: "outline" as const,
  },
];

export default function ProgramsAndCourses() {
  return (
    <section
      id="courses"
      className="relative w-full bg-[#faf8f5] py-16 sm:py-20 lg:py-[84px] scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block h-px w-6 bg-[#2d5a2d]" />
          <span className="text-[0.78rem] font-bold uppercase tracking-widest text-[#2d5a2d]">
            Programs and Courses
          </span>
        </div>

        <h2 className="font-extrabold text-[#1a3a1a] text-[1.7rem] sm:text-3xl md:text-4xl lg:text-[2.4rem] leading-[1.15] mb-4">
          Choose the change you want to feel
        </h2>

        <p className="text-[#2d2d2d] max-w-[640px] mb-12 sm:mb-14 lg:mb-16">
          Join live group classes, book private sessions, or learn at your own
          pace with recorded courses. Every path includes lifetime support in
          our community.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[28px]">
          {courses.map((course) => (
            <div
              key={course.title}
              className="flex flex-col bg-white border border-[#ede8e0] rounded-[20px] shadow-[0_12px_34px_rgba(27,67,50,0.10)] hover:-translate-y-[7px] hover:shadow-[0_18px_42px_rgba(27,67,50,0.16)] transition-all duration-300 overflow-hidden"
            >
              <div
                className="relative h-[158px]"
                style={{ background: course.gradient }}
              >
                <span className="absolute left-4 bottom-4 inline-flex items-center rounded-full bg-[#faf8f5]/[.94] text-[#1a3a1a] uppercase tracking-wide font-bold text-[0.72rem] px-[13px] py-[6px]">
                  {course.tag}
                </span>
              </div>

              <div className="flex flex-col gap-[10px] p-[22px] flex-1">
                <h3 className="font-bold text-[#2d5a2d] text-[1.1rem]">
                  {course.title}
                </h3>

                <p className="text-[0.92rem] text-[#2d2d2d] flex-grow">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-[0.85rem]">
                  <span className="font-bold text-[#2d5a2d] text-[1.15rem]">
                    {course.price}
                  </span>
                  <span className="text-[#6b6b6b]">{course.meta}</span>
                </div>

                <button
                  type="button"
                  className={
                    course.variant === "solid"
                      ? "w-full font-semibold text-[0.93rem] px-6 py-3 rounded-full bg-[#2d5a2d] text-[#faf8f5] hover:bg-[#1a3a1a] shadow-md hover:shadow-lg transition-all duration-300"
                      : "w-full font-semibold text-[0.93rem] px-6 py-3 rounded-full border-2 border-[#2d5a2d] text-[#2d5a2d] hover:bg-[#2d5a2d] hover:text-[#faf8f5] transition-all duration-300"
                  }
                >
                  {course.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
