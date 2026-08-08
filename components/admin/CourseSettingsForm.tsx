"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";

type CourseSettings = {
  id: string;
  thumbnailUrl: string;
  instructorName: string;
  instructorBio: string;
  instructorPhoto: string;
  category: string;
  difficulty: string;
  durationLabel: string;
  status: string;
};

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-[#ede8e0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5a2d]/30 text-base";
const labelClass = "block text-sm font-medium text-[#1a3a1a] mb-1.5";

function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "yoga-courses");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex items-center gap-4">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="w-16 h-16 rounded-xl object-cover border border-[#ede8e0] shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-[#ede8e0] shrink-0" />
        )}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#ede8e0] text-sm font-medium text-[#2d2d2d] hover:bg-white disabled:opacity-60"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {value ? "Replace image" : "Upload image"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  );
}

export default function CourseSettingsForm({ initial }: { initial: CourseSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function set<K extends keyof CourseSettings>(key: K, value: CourseSettings[K]) {
    setSavedAt(null);
    setSettings((s) => ({ ...s, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/courses/${settings.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
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
    <section className="bg-[#faf8f5] rounded-2xl border border-[#ede8e0]/80 p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#1a3a1a]">Course settings</h2>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-lg bg-[#2d5a2d] text-white text-sm font-semibold hover:bg-[#1a3a1a] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}
      {savedAt && !error && (
        <p className="text-sm text-[#2d5a2d] bg-[#e4eee7] border border-[#2d5a2d]/20 rounded-lg px-4 py-3">
          Saved.
        </p>
      )}

      <div>
        <label className={labelClass}>Status</label>
        <select
          value={settings.status}
          onChange={(e) => set("status", e.target.value)}
          className={inputClass}
        >
          <option value="draft">Draft (hidden from public listing logic you add later)</option>
          <option value="published">Published</option>
        </select>
      </div>

      <ImageUploadField
        label="Course thumbnail"
        value={settings.thumbnailUrl}
        onChange={(url) => set("thumbnailUrl", url)}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category</label>
          <input
            value={settings.category}
            onChange={(e) => set("category", e.target.value)}
            className={inputClass}
            placeholder="Sleep, Stress, Flexibility…"
          />
        </div>
        <div>
          <label className={labelClass}>Difficulty</label>
          <input
            value={settings.difficulty}
            onChange={(e) => set("difficulty", e.target.value)}
            className={inputClass}
            placeholder="Beginner, All levels…"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Duration label</label>
          <input
            value={settings.durationLabel}
            onChange={(e) => set("durationLabel", e.target.value)}
            className={inputClass}
            placeholder="21 nights, ~20 minutes a day"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 items-start">
        <div>
          <label className={labelClass}>Instructor name</label>
          <input
            value={settings.instructorName}
            onChange={(e) => set("instructorName", e.target.value)}
            className={inputClass}
          />
        </div>
        <ImageUploadField
          label="Instructor photo"
          value={settings.instructorPhoto}
          onChange={(url) => set("instructorPhoto", url)}
        />
      </div>
      <div>
        <label className={labelClass}>Instructor bio</label>
        <textarea
          value={settings.instructorBio}
          onChange={(e) => set("instructorBio", e.target.value)}
          rows={3}
          className={`${inputClass} resize-y`}
        />
      </div>
    </section>
  );
}
