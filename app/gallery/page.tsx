"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import FloatingNavbar from "@/components/FloatingNavbar";

type GalleryItem = {
  src: string;
  alt: string;
  type: "image" | "video";
};

const GALLERY_IMAGES: GalleryItem[] = [
  { src: "/photos/photo-1.webp", alt: "Yoga practice moment from online class — Yoga by Neha", type: "image" },
  { src: "/photos/photo-2.webp", alt: "Yoga class session — Yoga by Neha", type: "image" },
  { src: "/photos/photo-4.webp", alt: "Yoga practice photo from live online class", type: "image" },
  { src: "/photos/photo-5.webp", alt: "Yoga session moment — strength and flexibility", type: "image" },
  { src: "/photos/photo-6.webp", alt: "Online yoga class with Yoga by Neha", type: "image" },
  { src: "/photos/photo-7.webp", alt: "Yoga practice — Yoga by Neha gallery", type: "image" },
  { src: "/photos/photo-8.webp", alt: "Yoga class moment from practice", type: "image" },
  { src: "/photos/photo-9.webp", alt: "Yoga session — Yoga by Neha online classes", type: "image" },
  { src: "/photos/photo-10.webp", alt: "Yoga practice photo from class", type: "image" },
  { src: "/photos/photo-11.webp", alt: "Yoga by Neha — practice moment", type: "image" },
  { src: "/photos/photo-12.jpeg", alt: "Yoga class photo — online Indian yoga teacher", type: "image" },
  { src: "/photos/photo-13.jpeg", alt: "Yoga practice from live session", type: "image" },
  { src: "/photos/photo-14.jpeg", alt: "Yoga by Neha class moment", type: "image" },
  { src: "/photos/photo-15.jpeg", alt: "Yoga session — Yoga for Cure", type: "image" },
  { src: "/reels/aasanvideo-1.MP4", alt: "Yoga asana practice video — Yoga by Neha", type: "video" },
  { src: "/reels/aasanvideo-2.MP4", alt: "Yoga asana demonstration video", type: "video" },
  { src: "/reels/aasanvideo-3.MP4", alt: "Yoga asana practice — online class", type: "video" },
];

const GAP = 16;
const GAP_LG = 24;
const DEFAULT_ASPECT = 4 / 5;

function getNumColumns(width: number): number {
  if (width < 640) return 2;
  if (width < 1024) return 3;
  return 4;
}

type Dimensions = Record<number, { w: number; h: number }>;

function useImageDimensions(sources: GalleryItem[]) {
  const [dimensions, setDimensions] = useState<Dimensions>({});

  useEffect(() => {
    let cancelled = false;
    sources.forEach((item, index) => {
      if (item.type === "video") {
        // For videos, use default aspect ratio or load video metadata
        const video = document.createElement("video");
        video.preload = "metadata";
        video.muted = true;
        video.playsInline = true;
        video.onloadedmetadata = () => {
          if (cancelled) return;
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            setDimensions((prev) => ({
              ...prev,
              [index]: { w: video.videoWidth, h: video.videoHeight },
            }));
          } else {
            // Fallback to default aspect ratio
            setDimensions((prev) => ({
              ...prev,
              [index]: { w: 9, h: 16 },
            }));
          }
        };
        video.onerror = () => {
          if (cancelled) return;
          // Fallback to default aspect ratio on error
          setDimensions((prev) => ({
            ...prev,
            [index]: { w: 9, h: 16 },
          }));
        };
        video.src = item.src;
        // Fallback to default if metadata doesn't load within 3 seconds
        setTimeout(() => {
          if (!dimensions[index] && !cancelled) {
            setDimensions((prev) => ({
              ...prev,
              [index]: { w: 9, h: 16 }, // Default video aspect ratio
            }));
          }
        }, 3000);
      } else {
        const img = new window.Image();
        img.onload = () => {
          if (cancelled) return;
          setDimensions((prev) => ({
            ...prev,
            [index]: { w: img.naturalWidth, h: img.naturalHeight },
          }));
        };
        img.src = item.src;
      }
    });
    return () => {
      cancelled = true;
    };
  }, [sources]);

  return dimensions;
}

function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => setWidth(el.offsetWidth);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, width };
}

function computeMasonryLayout(
  dimensions: Dimensions,
  containerWidth: number,
  count: number
): { columns: number[][]; columnWidth: number; heights: Record<number, number> } {
  const numColumns = getNumColumns(containerWidth);
  const gap = containerWidth >= 1024 ? GAP_LG : GAP;
  const columnWidth =
    (containerWidth - (numColumns - 1) * gap) / numColumns;

  const heights: Record<number, number> = {};
  const columnHeights = new Array(numColumns).fill(0);
  const columns: number[][] = Array.from({ length: numColumns }, () => []);

  for (let i = 0; i < count; i++) {
    const dim = dimensions[i] ?? { w: 4, h: 5 };
    const itemHeight = columnWidth * (dim.h / dim.w);
    heights[i] = itemHeight;

    let minCol = 0;
    for (let c = 1; c < numColumns; c++) {
      if (columnHeights[c] < columnHeights[minCol]) minCol = c;
    }
    columns[minCol].push(i);
    columnHeights[minCol] += itemHeight + gap;
  }

  return { columns, columnWidth, heights };
}

// ----- Lightbox -----

function LightboxModal({
  isOpen,
  selectedIndex,
  onClose,
  images,
}: {
  isOpen: boolean;
  selectedIndex: number | null;
  onClose: () => void;
  images: GalleryItem[];
}) {
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  const item = selectedIndex != null ? images[selectedIndex] : null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && item && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
          style={{ zIndex: 9999 }}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Backdrop: blur + dark overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md cursor-zoom-out"
            onClick={handleBackdropClick}
            aria-hidden
          />

          {/* Modal image: scale + fade; tap to close */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-4xl min-h-[200px] max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl cursor-zoom-out flex items-center justify-center bg-black/30"
            style={{ zIndex: 10001 }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onClose()}
            aria-label="Close lightbox"
          >
            {item.type === "video" ? (
              <video
                src={item.src}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] w-auto h-auto object-contain block"
                onClick={(e) => e.stopPropagation()}
                style={{ pointerEvents: "auto" }}
              />
            ) : (
              <img
                src={item.src}
                alt={item.alt}
                className="max-w-full max-h-[85vh] w-auto h-auto object-contain block"
                draggable={false}
                sizes="(max-width: 896px) 100vw, 896px"
                onClick={(e) => e.stopPropagation()}
                style={{ pointerEvents: "none" }}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// ----- Skeleton -----

function MasonrySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {GALLERY_IMAGES.map((item, i) => (
        <div
          key={i}
          className="rounded-2xl bg-[#e8e4de]/60 animate-pulse"
          style={{ aspectRatio: item.type === "video" ? "9/16" : "4/5" }}
        />
      ))}
    </div>
  );
}

// ----- Main page -----

export default function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const dims = useImageDimensions(GALLERY_IMAGES);
  const { ref: containerRef, width: containerWidth } = useContainerWidth();

  const hasAllDimensions = Object.keys(dims).length === GALLERY_IMAGES.length;
  const showMasonry = containerWidth > 0 && hasAllDimensions;

  const layout = useMemo(() => {
    if (containerWidth <= 0) return null;
    return computeMasonryLayout(dims, containerWidth, GALLERY_IMAGES.length);
  }, [dims, containerWidth]);

  const gap = containerWidth >= 1024 ? GAP_LG : GAP;

  return (
    <>
      <FloatingNavbar />
      <main className="relative min-h-screen bg-gradient-to-b from-[#f5f1eb] to-[#ede8e0]">
        <div className="pt-24 pb-20 lg:pt-32 lg:pb-32 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 lg:mb-16"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1a3a1a] mb-4">
                Gallery
              </h1>
              <p className="text-lg sm:text-xl text-[#2d2d2d] max-w-2xl mx-auto">
                Moments from practice
              </p>
              <p className="mt-4 text-base text-[#2d2d2d]">
                <a href="/" className="text-[#2d5a2d] hover:text-[#1a3a1a] font-medium underline underline-offset-2">Home</a>
                {" · "}
                <a href="/#what-we-offer" className="text-[#2d5a2d] hover:text-[#1a3a1a] font-medium underline underline-offset-2">Programs</a>
                {" · "}
                <a href="/#pricing" className="text-[#2d5a2d] hover:text-[#1a3a1a] font-medium underline underline-offset-2">Pricing</a>
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#9caf88] to-[#d4ddd4] mx-auto rounded-full mt-6" />
            </motion.div>

            <div ref={containerRef} className="w-full">
              {!showMasonry && <MasonrySkeleton />}

              {showMasonry && layout && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-4 lg:gap-6"
                    style={{ gap }}
                  >
                    {layout.columns.map((colIndices, colIdx) => (
                      <div
                        key={colIdx}
                        className="flex flex-col flex-1 min-w-0"
                        style={{ gap }}
                      >
                        {colIndices.map((index) => {
                          const item = GALLERY_IMAGES[index];
                          const height = layout.heights[index];
                          return (
                            <motion.div
                              key={item.src}
                              className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-zoom-in group"
                              style={{ height }}
                              onClick={() => setSelectedIndex(index)}
                              onKeyDown={(e) =>
                                (e.key === "Enter" || e.key === " ") &&
                                setSelectedIndex(index)
                              }
                              role="button"
                              tabIndex={0}
                              aria-label={`View ${item.alt}`}
                            >
                              {item.type === "video" ? (
                                <>
                                  <video
                                    src={item.src}
                                    className="w-full h-full object-cover block pointer-events-none select-none"
                                    muted
                                    loop
                                    playsInline
                                    autoPlay
                                    preload="auto"
                                  />
                                  {/* Play button overlay for videos */}
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                      <svg
                                        className="w-8 h-8 sm:w-10 sm:h-10 text-[#2d5a2d] ml-1"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M8 5v14l11-7z" />
                                      </svg>
                                    </div>
                                  </div>
                                  {/* Video indicator */}
                                  <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm pointer-events-none">
                                    <span className="text-white text-xs font-medium">VIDEO</span>
                                  </div>
                                </>
                              ) : (
                                <img
                                  src={item.src}
                                  alt={item.alt}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-cover block pointer-events-none select-none"
                                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                  draggable={false}
                                />
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    ))}
                  </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      <LightboxModal
        isOpen={selectedIndex !== null}
        selectedIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        images={GALLERY_IMAGES}
      />
    </>
  );
}
