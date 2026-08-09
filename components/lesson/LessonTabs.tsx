"use client";

import { useState } from "react";
import ReviewsPanel, { type ReviewItem } from "./ReviewsPanel";
import QAPanel, { type QAQuestion } from "./QAPanel";

type FaqItem = { question: string; answer: string };

type TabId = "overview" | "reviews" | "qa" | "faq" | "instructor";

export default function LessonTabs({
  lessonTitle,
  lessonDescription,
  courseHighlights,
  courseFaq,
  instructor,
  courseId,
  lessonId,
  reviews,
  canReview,
  questions,
  canPost,
}: {
  lessonTitle: string;
  lessonDescription: string | null;
  courseHighlights: string[];
  courseFaq: FaqItem[];
  instructor: { name: string; role: string; bio: string; photo: string | null };
  courseId: string;
  lessonId: string;
  reviews: ReviewItem[];
  canReview: boolean;
  questions: QAQuestion[];
  canPost: boolean;
}) {
  const [tab, setTab] = useState<TabId>("overview");

  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "reviews", label: `Reviews (${reviews.length})` },
    { id: "qa", label: "Q & A" },
    { id: "faq", label: "FAQ" },
    { id: "instructor", label: "Instructor" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#ede8e0] overflow-hidden">
      <div className="flex gap-1 border-b border-[#ede8e0] px-2 sm:px-4 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === t.id
                ? "text-[#1a3a1a] border-[#e8745b]"
                : "text-[#6b6b6b] border-transparent hover:text-[#1a3a1a]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-7">
        {tab === "overview" && (
          <div>
            <h2 className="text-lg font-semibold text-[#1a3a1a] mb-3">{lessonTitle}</h2>
            {lessonDescription && (
              <p className="text-[#6b6b6b] leading-relaxed mb-5">{lessonDescription}</p>
            )}
            {courseHighlights.length > 0 && (
              <div className="bg-[#f5f1eb] rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-[#1a3a1a] mb-4">
                  What you&apos;ll gain from this course
                </h3>
                <ul className="flex flex-col gap-3">
                  {courseHighlights.map((h, i) => (
                    <li key={i} className="flex gap-3 text-sm text-[#2d2d2d]">
                      <span className="w-5 h-5 rounded-full bg-[#e8ede8] text-[#2d5a2d] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {tab === "reviews" && (
          <ReviewsPanel courseId={courseId} reviews={reviews} canReview={canReview} />
        )}

        {tab === "qa" && <QAPanel lessonId={lessonId} questions={questions} canPost={canPost} />}

        {tab === "faq" && (
          <div className="flex flex-col gap-3">
            {courseFaq.length === 0 ? (
              <p className="text-sm text-[#6b6b6b]">No FAQ available for this course yet.</p>
            ) : (
              courseFaq.map((item, i) => (
                <details
                  key={i}
                  className="bg-[#faf8f5] border border-[#ede8e0] rounded-xl px-5 py-4 group"
                >
                  <summary className="cursor-pointer text-sm font-semibold text-[#1a3a1a] list-none flex items-center justify-between gap-4">
                    {item.question}
                    <span className="text-[#e8745b] text-lg font-bold group-open:rotate-45 transition-transform shrink-0">
                      +
                    </span>
                  </summary>
                  <p className="text-sm text-[#6b6b6b] leading-relaxed mt-3">{item.answer}</p>
                </details>
              ))
            )}
          </div>
        )}

        {tab === "instructor" && (
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9caf88] to-[#f6edcf] flex items-center justify-center text-2xl font-bold text-[#1a3a1a] shrink-0 overflow-hidden">
              {instructor.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={instructor.photo} alt={instructor.name} className="w-full h-full object-cover" />
              ) : (
                instructor.name.charAt(0)
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1a3a1a]">{instructor.name}</h3>
              <p className="text-xs font-semibold tracking-wide uppercase text-[#e8745b] mb-3">
                {instructor.role}
              </p>
              <p className="text-sm text-[#6b6b6b] leading-relaxed whitespace-pre-line">
                {instructor.bio}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
