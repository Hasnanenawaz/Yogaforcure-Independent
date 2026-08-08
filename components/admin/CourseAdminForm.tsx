"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import type {
  Course,
  Lesson,
  Module,
  WhoCard,
  Testimonial,
  FaqItem,
  Stat,
} from "@/lib/courses";
import RowControls from "./RowControls";

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-[#ede8e0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5a2d]/30 text-base";
const labelClass = "block text-sm font-medium text-[#1a3a1a] mb-1.5";
const cardClass =
  "bg-[#faf8f5] rounded-2xl border border-[#ede8e0]/80 p-4 sm:p-6 space-y-5";

function Field({
  label,
  value,
  onChange,
  textarea,
  rows = 1,
  placeholder,
  type = "text",
  step,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
  type?: string;
  step?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={`${inputClass} resize-y`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function StringListEditor({
  items,
  onChange,
  addLabel,
  rows = 2,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
  rows?: number;
  placeholder?: string;
}) {
  function updateAt(i: number, value: string) {
    onChange(items.map((it, idx) => (idx === i ? value : it)));
  }
  function removeAt(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function moveAt(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const copy = [...items];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-white border border-[#ede8e0] rounded-xl p-3 space-y-2">
          <RowControls
            onMoveUp={() => moveAt(i, -1)}
            onMoveDown={() => moveAt(i, 1)}
            onRemove={() => removeAt(i)}
            canMoveUp={i > 0}
            canMoveDown={i < items.length - 1}
          />
          <textarea
            value={item}
            onChange={(e) => updateAt(i, e.target.value)}
            rows={rows}
            className={`${inputClass} resize-y`}
            placeholder={placeholder}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2d5a2d] hover:text-[#1a3a1a]"
      >
        <Plus className="w-4 h-4" />
        {addLabel}
      </button>
    </div>
  );
}

function ListEditor<T>({
  items,
  onChange,
  renderItem,
  emptyItem,
  addLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  emptyItem: T;
  addLabel: string;
}) {
  function update(i: number, patch: Partial<T>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const copy = [...items];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-white border border-[#ede8e0] rounded-xl p-4 space-y-3">
          <RowControls
            onMoveUp={() => move(i, -1)}
            onMoveDown={() => move(i, 1)}
            onRemove={() => remove(i)}
            canMoveUp={i > 0}
            canMoveDown={i < items.length - 1}
          />
          {renderItem(item, (patch) => update(i, patch))}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, emptyItem])}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2d5a2d] hover:text-[#1a3a1a]"
      >
        <Plus className="w-4 h-4" />
        {addLabel}
      </button>
    </div>
  );
}

function SaveBar({
  onSave,
  saving,
  sticky,
}: {
  onSave: () => void;
  saving: boolean;
  sticky?: boolean;
}) {
  return (
    <div className={sticky ? "sticky bottom-4 z-10" : ""}>
      <div className="bg-white border border-[#ede8e0] rounded-2xl shadow-[0_12px_34px_rgba(27,67,50,0.12)] p-4 flex items-center justify-between gap-3">
        <p className="text-sm text-[#6b6b6b] hidden sm:block">
          Changes go live on the site once you click Save.
        </p>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="ml-auto px-8 py-3 rounded-lg bg-[#2d5a2d] text-white font-semibold hover:bg-[#1a3a1a] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

export default function CourseAdminForm({
  slug,
  initial,
}: {
  slug: string;
  initial: Course;
}) {
  const router = useRouter();
  const [course, setCourse] = useState<Course>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function set<K extends keyof Course>(key: K, value: Course[K]) {
    setSavedAt(null);
    setCourse((c) => ({ ...c, [key]: value }));
  }

  function setIntroVideo<K extends keyof Course["introVideo"]>(
    key: K,
    value: Course["introVideo"][K]
  ) {
    setSavedAt(null);
    setCourse((c) => ({ ...c, introVideo: { ...c.introVideo, [key]: value } }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/courses/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSavedAt(Date.now());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5 sm:space-y-6 pb-6">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}
      {savedAt && !error && (
        <p className="text-sm text-[#2d5a2d] bg-[#e4eee7] border border-[#2d5a2d]/20 rounded-lg px-4 py-3">
          Saved. The live page updates within a few minutes.
        </p>
      )}

      <SaveBar onSave={handleSave} saving={saving} />

      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-[#1a3a1a]">Basics &amp; pricing</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Title" value={course.title} onChange={(v) => set("title", v)} />
          <Field
            label="Tag (badge shown on cards)"
            value={course.tag}
            onChange={(v) => set("tag", v)}
          />
        </div>
        <Field
          label="Card description (homepage course card)"
          value={course.description}
          onChange={(v) => set("description", v)}
          textarea
          rows={2}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Price (display)" value={course.price} onChange={(v) => set("price", v)} />
          <Field
            label="Price (numeric, INR)"
            type="number"
            value={String(course.priceValue)}
            onChange={(v) => set("priceValue", Number(v) || 0)}
          />
          <Field
            label="Was price (display)"
            value={course.wasPrice}
            onChange={(v) => set("wasPrice", v)}
          />
          <Field
            label="Save percent"
            type="number"
            value={String(course.savePercent)}
            onChange={(v) => set("savePercent", Number(v) || 0)}
          />
          <Field
            label="Meta line (e.g. lesson count)"
            value={course.meta}
            onChange={(v) => set("meta", v)}
          />
          <Field label="Duration" value={course.duration} onChange={(v) => set("duration", v)} />
          <Field label="Level" value={course.level} onChange={(v) => set("level", v)} />
          <Field label="Format" value={course.format} onChange={(v) => set("format", v)} />
          <Field
            label="Rating"
            type="number"
            step="0.1"
            value={String(course.rating)}
            onChange={(v) => set("rating", Number(v) || 0)}
          />
          <Field
            label="Review count"
            type="number"
            value={String(course.reviewCount)}
            onChange={(v) => set("reviewCount", Number(v) || 0)}
          />
          <Field
            label="Time required (ISO 8601, e.g. PT2H24M)"
            value={course.timeRequiredIso}
            onChange={(v) => set("timeRequiredIso", v)}
          />
          <Field
            label="CTA button label"
            value={course.cta}
            onChange={(v) => set("cta", v)}
          />
          <div>
            <label className={labelClass}>Card style</label>
            <select
              value={course.variant}
              onChange={(e) => set("variant", e.target.value as "solid" | "outline")}
              className={inputClass}
            >
              <option value="solid">Solid (filled button)</option>
              <option value="outline">Outline</option>
            </select>
          </div>
          <Field
            label="Gradient (CSS background)"
            value={course.gradient}
            onChange={(v) => set("gradient", v)}
          />
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-[#1a3a1a]">Hero section</h2>
        <Field
          label="Hero lead paragraph"
          value={course.heroLead}
          onChange={(v) => set("heroLead", v)}
          textarea
          rows={3}
        />
        <div>
          <label className={labelClass}>Hero meta bullets</label>
          <StringListEditor
            items={course.heroMeta}
            onChange={(v) => set("heroMeta", v)}
            addLabel="Add bullet"
            rows={1}
          />
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-[#1a3a1a]">Cover card</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Kicker"
            value={course.coverKicker}
            onChange={(v) => set("coverKicker", v)}
          />
          <Field
            label="Heading"
            value={course.coverHeading}
            onChange={(v) => set("coverHeading", v)}
          />
        </div>
        <Field
          label="Description"
          value={course.coverDescription}
          onChange={(v) => set("coverDescription", v)}
          textarea
          rows={2}
        />
        <div>
          <label className={labelClass}>Stats (value + label)</label>
          <ListEditor<Stat>
            items={course.coverStats}
            onChange={(v) => set("coverStats", v)}
            emptyItem={{ value: "", label: "" }}
            addLabel="Add stat"
            renderItem={(item, update) => (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Value" value={item.value} onChange={(v) => update({ value: v })} />
                <Field label="Label" value={item.label} onChange={(v) => update({ label: v })} />
              </div>
            )}
          />
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-[#1a3a1a]">Intro video</h2>
        <Field
          label="Heading"
          value={course.introVideo.heading}
          onChange={(v) => setIntroVideo("heading", v)}
        />
        <Field
          label="Description"
          value={course.introVideo.description}
          onChange={(v) => setIntroVideo("description", v)}
          textarea
          rows={2}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Instructor line"
            value={course.introVideo.instructorLine}
            onChange={(v) => setIntroVideo("instructorLine", v)}
          />
          <Field
            label="Length label"
            value={course.introVideo.lengthLabel}
            onChange={(v) => setIntroVideo("lengthLabel", v)}
          />
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-[#1a3a1a]">About this course (paragraphs)</h2>
        <StringListEditor
          items={course.about}
          onChange={(v) => set("about", v)}
          addLabel="Add paragraph"
          rows={3}
        />
      </section>

      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-[#1a3a1a]">What you&apos;ll gain (highlights)</h2>
        <StringListEditor
          items={course.highlights}
          onChange={(v) => set("highlights", v)}
          addLabel="Add highlight"
        />
      </section>

      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-[#1a3a1a]">Curriculum</h2>
        <ListEditor<Module>
          items={course.curriculum}
          onChange={(v) => set("curriculum", v)}
          emptyItem={{ title: "New module", subtitle: "", lessons: [] }}
          addLabel="Add module"
          renderItem={(module, updateModule) => (
            <div className="space-y-3">
              <Field
                label="Module title"
                value={module.title}
                onChange={(v) => updateModule({ title: v })}
              />
              <Field
                label="Module subtitle"
                value={module.subtitle}
                onChange={(v) => updateModule({ subtitle: v })}
              />
              <div>
                <label className={labelClass}>Lessons</label>
                <ListEditor<Lesson>
                  items={module.lessons}
                  onChange={(v) => updateModule({ lessons: v })}
                  emptyItem={{ title: "New lesson", duration: "" }}
                  addLabel="Add lesson"
                  renderItem={(lesson, updateLesson) => (
                    <div className="grid grid-cols-[1fr_120px] gap-3">
                      <Field
                        label="Lesson title"
                        value={lesson.title}
                        onChange={(v) => updateLesson({ title: v })}
                      />
                      <Field
                        label="Duration"
                        value={lesson.duration}
                        onChange={(v) => updateLesson({ duration: v })}
                        placeholder="6 min"
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          )}
        />
      </section>

      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-[#1a3a1a]">Who this course is for</h2>
        <ListEditor<WhoCard>
          items={course.whoItsFor}
          onChange={(v) => set("whoItsFor", v)}
          emptyItem={{ title: "", description: "" }}
          addLabel="Add card"
          renderItem={(item, update) => (
            <>
              <Field label="Title" value={item.title} onChange={(v) => update({ title: v })} />
              <Field
                label="Description"
                value={item.description}
                onChange={(v) => update({ description: v })}
                textarea
                rows={2}
              />
            </>
          )}
        />
      </section>

      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-[#1a3a1a]">Instructor note</h2>
        <Field
          label="Note (shown under the instructor bio)"
          value={course.instructorNote}
          onChange={(v) => set("instructorNote", v)}
          textarea
          rows={2}
        />
      </section>

      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-[#1a3a1a]">Student testimonials</h2>
        <ListEditor<Testimonial>
          items={course.testimonials}
          onChange={(v) => set("testimonials", v)}
          emptyItem={{ quote: "", name: "", location: "" }}
          addLabel="Add testimonial"
          renderItem={(item, update) => (
            <>
              <Field
                label="Quote"
                value={item.quote}
                onChange={(v) => update({ quote: v })}
                textarea
                rows={2}
              />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name" value={item.name} onChange={(v) => update({ name: v })} />
                <Field
                  label="Location"
                  value={item.location}
                  onChange={(v) => update({ location: v })}
                />
              </div>
            </>
          )}
        />
      </section>

      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-[#1a3a1a]">Frequently asked questions</h2>
        <ListEditor<FaqItem>
          items={course.faq}
          onChange={(v) => set("faq", v)}
          emptyItem={{ question: "", answer: "" }}
          addLabel="Add question"
          renderItem={(item, update) => (
            <>
              <Field
                label="Question"
                value={item.question}
                onChange={(v) => update({ question: v })}
              />
              <Field
                label="Answer"
                value={item.answer}
                onChange={(v) => update({ answer: v })}
                textarea
                rows={2}
              />
            </>
          )}
        />
      </section>

      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-[#1a3a1a]">
          What&apos;s included (sidebar checklist)
        </h2>
        <StringListEditor
          items={course.includes}
          onChange={(v) => set("includes", v)}
          addLabel="Add item"
          rows={1}
        />
      </section>

      <SaveBar onSave={handleSave} saving={saving} sticky />
    </div>
  );
}
