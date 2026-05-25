"use client";

import { ChevronDown, ChevronUp, Trash2, Upload, Loader2 } from "lucide-react";
import type { BlogImageInput } from "./BlogForm";

type BlogImageManagerProps = {
  images: BlogImageInput[];
  onChange: (images: BlogImageInput[]) => void;
  uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultAlt: string;
};

export default function BlogImageManager({
  images,
  onChange,
  uploading,
  onUpload,
  defaultAlt,
}: BlogImageManagerProps) {
  function updateAlt(index: number, alt: string) {
    onChange(images.map((img, i) => (i === index ? { ...img, alt } : img)));
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= images.length) return;
    const copy = [...images];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    onChange(copy);
  }

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <ul className="space-y-3">
          {images.map((img, index) => (
            <li
              key={img.publicId}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-[#ede8e0] bg-white"
            >
              <div className="relative w-full sm:w-28 h-40 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-[#ede8e0]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt || defaultAlt}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 text-[10px] font-medium bg-black/50 text-white px-2 py-0.5 rounded-full">
                  #{index + 1}
                </span>
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <label className="block text-xs font-medium text-[#1a3a1a]">
                  Alt text (for SEO & accessibility)
                </label>
                <input
                  value={img.alt}
                  onChange={(e) => updateAlt(index, e.target.value)}
                  placeholder={defaultAlt || "Describe this image"}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#ede8e0] focus:outline-none focus:ring-2 focus:ring-[#2d5a2d]/30"
                />
                <p className="text-xs text-[#2d2d2d]/70">
                  Order in collage: {index + 1} of {images.length}
                </p>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => moveImage(index, -1)}
                  disabled={index === 0}
                  className="p-2 rounded-lg border border-[#ede8e0] hover:bg-[#f5f1eb] disabled:opacity-40"
                  aria-label="Move up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, 1)}
                  disabled={index === images.length - 1}
                  className="p-2 rounded-lg border border-[#ede8e0] hover:bg-[#f5f1eb] disabled:opacity-40"
                  aria-label="Move down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                  aria-label="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <label className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#9caf88] text-[#2d5a2d] cursor-pointer hover:bg-[#f5f1eb] transition-colors">
        {uploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        {uploading ? "Uploading…" : "Add images"}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onUpload}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
