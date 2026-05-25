"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BlogImageManager from "@/components/admin/BlogImageManager";

export type BlogImageInput = {
  url: string;
  publicId: string;
  alt: string;
};

type BlogFormProps = {
  initial?: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    metaTitle: string;
    metaDescription: string;
    published: boolean;
    images: BlogImageInput[];
  };
};

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export default function BlogForm({ initial }: BlogFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(
    initial?.content ? stripHtml(initial.content) : ""
  );
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    initial?.metaDescription ?? ""
  );
  const [published, setPublished] = useState(initial?.published ?? false);
  const [images, setImages] = useState<BlogImageInput[]>(initial?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    setError("");

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setImages((prev) => [
          ...prev,
          { url: data.url, publicId: data.publicId, alt: title || file.name },
        ]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      excerpt,
      content,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      published,
      images,
    };

    try {
      const url = isEdit ? `/api/blogs/${initial!.id}` : "/api/blogs";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 max-w-3xl w-full">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="bg-[#faf8f5] rounded-2xl border border-[#ede8e0]/80 p-4 sm:p-6 space-y-5">
        <h2 className="text-lg font-semibold text-[#1a3a1a]">Blog content</h2>

        <div>
          <label className="block text-sm font-medium text-[#1a3a1a] mb-1.5">
            Title *
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-[#ede8e0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5a2d]/30 text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1a3a1a] mb-1.5">
            Excerpt *
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
            rows={2}
            className="w-full px-4 py-3 rounded-lg border border-[#ede8e0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5a2d]/30 resize-y text-base"
            placeholder="Short summary for cards and search results"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1a3a1a] mb-1.5">
            Content *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            className="w-full px-4 py-3 rounded-lg border border-[#ede8e0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5a2d]/30 resize-y text-sm sm:text-base leading-relaxed"
            placeholder="Write your blog here. Use blank lines between paragraphs."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1a3a1a] mb-2">
            Images
          </label>
          <p className="text-xs text-[#2d2d2d]/70 mb-3">
            Reorder, edit alt text, or remove images. First image appears on blog cards.
          </p>
          <BlogImageManager
            images={images}
            onChange={setImages}
            uploading={uploading}
            onUpload={handleUpload}
            defaultAlt={title}
          />
        </div>
      </div>

      <div className="bg-[#faf8f5] rounded-2xl border border-[#ede8e0]/80 p-4 sm:p-6 space-y-5">
        <h2 className="text-lg font-semibold text-[#1a3a1a]">SEO</h2>
        <div>
          <label className="block text-sm font-medium text-[#1a3a1a] mb-1.5">
            Meta title
          </label>
          <input
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-[#ede8e0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5a2d]/30 text-base"
            placeholder={title || "Defaults to blog title"}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a3a1a] mb-1.5">
            Meta description
          </label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-lg border border-[#ede8e0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5a2d]/30 resize-y text-base"
            placeholder={excerpt || "Defaults to excerpt"}
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 rounded border-[#ede8e0] text-[#2d5a2d] focus:ring-[#2d5a2d]"
          />
          <span className="text-sm text-[#1a3a1a]">Publish (visible on /blog)</span>
        </label>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-auto px-6 py-3 rounded-lg border border-[#ede8e0] text-[#2d2d2d] hover:bg-[#faf8f5]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto px-8 py-3 rounded-lg bg-[#2d5a2d] text-white font-semibold hover:bg-[#1a3a1a] disabled:opacity-60"
        >
          {saving ? "Saving…" : isEdit ? "Update blog" : "Create blog"}
        </button>
      </div>
    </form>
  );
}
