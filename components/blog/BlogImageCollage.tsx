"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

export type BlogCollageImage = {
  id: string;
  url: string;
  alt: string;
};

function getCollageClass(index: number, total: number): string {
  const base =
    "relative overflow-hidden rounded-2xl sm:rounded-3xl cursor-zoom-in group ring-1 ring-[#d4ddd4]/40 shadow-sm hover:shadow-md transition-shadow duration-300 block w-full min-h-0";

  if (total === 1) {
    return `${base} col-span-2 sm:col-span-12 aspect-[4/3] sm:aspect-[21/9]`;
  }
  if (total === 2) {
    return index === 0
      ? `${base} col-span-2 sm:col-span-7 aspect-[16/10] sm:aspect-auto sm:min-h-[280px] sm:row-span-2`
      : `${base} col-span-2 sm:col-span-5 aspect-[16/10] sm:aspect-auto sm:min-h-[280px] sm:row-span-2`;
  }
  if (total === 3) {
    const classes = [
      `${base} col-span-2 sm:col-span-7 aspect-[16/10] sm:aspect-auto sm:min-h-[260px] sm:row-span-2`,
      `${base} col-span-1 aspect-[4/5] sm:col-span-5 sm:aspect-auto sm:min-h-[125px]`,
      `${base} col-span-1 aspect-square sm:col-span-5 sm:aspect-auto sm:min-h-[125px]`,
    ];
    return classes[index] ?? classes[0];
  }

  const cycle = [
    `${base} col-span-2 sm:col-span-7 aspect-[16/10] sm:aspect-auto sm:min-h-[220px]`,
    `${base} col-span-1 aspect-[4/5] sm:col-span-5 sm:aspect-auto sm:min-h-[160px]`,
    `${base} col-span-1 aspect-square sm:col-span-5 sm:aspect-auto sm:min-h-[160px]`,
    `${base} col-span-2 sm:col-span-12 aspect-[16/9] sm:aspect-auto sm:min-h-[200px]`,
  ];
  return cycle[index % cycle.length];
}

function Lightbox({
  image,
  onClose,
}: {
  image: BlogCollageImage | null;
  onClose: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!image) return;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [image, handleKeyDown]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {image && (
        <motion.div
          key={image.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            aria-hidden
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative z-10 w-full max-w-4xl max-h-[88vh] flex items-center justify-center pointer-events-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.alt}
              className="max-w-full max-h-[88vh] w-auto h-auto object-contain rounded-xl sm:rounded-2xl shadow-2xl pointer-events-auto"
              draggable={false}
            />
          </motion.div>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-white/15 backdrop-blur-md text-white hover:bg-white/25 transition-colors"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default function BlogImageCollage({ images }: { images: BlogCollageImage[] }) {
  const [active, setActive] = useState<BlogCollageImage | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div
        className="grid grid-cols-2 sm:grid-cols-12 auto-rows-auto gap-2.5 sm:gap-4 mb-8 sm:mb-12 w-full"
        aria-label="Blog photo collage"
      >
        {images.map((img, index) => (
          <button
            key={img.id}
            type="button"
            className={getCollageClass(index, images.length)}
            onClick={() => setActive(img)}
            aria-label={`View ${img.alt || "blog image"}`}
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 40vw"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <span className="absolute bottom-2 right-2 text-[10px] text-white/90 bg-black/35 backdrop-blur-sm px-2 py-0.5 rounded-full sm:opacity-0 sm:group-hover:opacity-100 transition-opacity pointer-events-none">
              Tap to expand
            </span>
          </button>
        ))}
      </div>

      <Lightbox image={active} onClose={() => setActive(null)} />
    </>
  );
}
