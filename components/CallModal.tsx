"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check } from "lucide-react";
import { useState } from "react";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PHONE_NUMBER = "+918310764597";
const FORMATTED_PHONE = "+91 83107 64597";

export default function CallModal({ isOpen, onClose }: CallModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PHONE_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-labelledby="call-modal-title"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            <div className="bg-[#faf8f5] rounded-2xl shadow-2xl border border-[#9caf88]/30 max-w-md w-full p-6 sm:p-8 relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-[#1a3a1a] hover:bg-[#e8ede8]/40 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="text-center">
                <h2
                  id="call-modal-title"
                  className="text-2xl sm:text-3xl font-bold text-[#1a3a1a] mb-4"
                >
                  Call Now
                </h2>

                <div className="mb-6">
                  <p className="text-sm text-[#2d2d2d] mb-2">Phone Number</p>
                  <p className="text-3xl sm:text-4xl font-semibold text-[#2d5a2d] tracking-wide">
                    {FORMATTED_PHONE}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#2d5a2d] text-[#faf8f5] font-semibold rounded-full hover:bg-[#1a3a1a] transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copy Number
                      </>
                    )}
                  </button>

                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-transparent border-2 border-[#2d5a2d] text-[#2d5a2d] font-semibold rounded-full hover:bg-[#e4eee7] transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


