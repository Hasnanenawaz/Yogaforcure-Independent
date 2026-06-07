"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";

const MIN_DISPLAY_MS = 600;   // Brief brand exposure
const MAX_WAIT_MS = 2500;     // Fallback so user isn’t blocked forever
const FADE_OUT_MS = 600;

export default function SplashScreen({
  heroReady = false,
  onReveal,
}: {
  heroReady?: boolean;
  onReveal?: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(true);
  const startTimeRef = useRef<number>(Date.now());
  const revealedRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
    startTimeRef.current = Date.now();
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "unset";
      document.documentElement.style.overflowX = "unset";
    };
  }, []);

  useEffect(() => {
    if (revealedRef.current) return;

    const elapsed = Date.now() - startTimeRef.current;
    const minRemaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

    const tryReveal = () => {
      if (revealedRef.current) return;
      revealedRef.current = true;
      setIsVisible(false);
      onReveal?.();
      setTimeout(() => {
        setIsMounted(false);
      }, FADE_OUT_MS);
    };

    if (heroReady) {
      const t = setTimeout(tryReveal, minRemaining);
      return () => clearTimeout(t);
    }

    const maxWait = setTimeout(tryReveal, Math.max(minRemaining, MAX_WAIT_MS - elapsed));
    return () => clearTimeout(maxWait);
  }, [heroReady, onReveal]);

  if (!isMounted) return null;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_OUT_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden"
          style={{ left: 0, right: 0, top: 0, bottom: 0 }}
        >
          <motion.div
            initial={prefersReducedMotion ? false : { scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
            transition={prefersReducedMotion
              ? { duration: 0.15 }
              : { duration: 0.8, ease: [0.4, 0, 0.2, 1], opacity: { duration: 0.6 } }
            }
            className="relative w-[200px] sm:w-[250px] md:w-[280px] lg:w-[300px] mx-auto"
          >
            <div className="relative w-full aspect-[3/4] sm:aspect-[2/3] md:aspect-[3/4]">
              <Image
                src="/gallery_yoga/yogachar.webp"
                alt="Yoga meditation"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 640px) 200px, (max-width: 1024px) 250px, 300px"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
