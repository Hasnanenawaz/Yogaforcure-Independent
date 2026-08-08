"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube, Phone } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const quickLinks = [
  { href: "/#why-learn-with-me", label: "About" },
  { href: "/#what-we-offer", label: "Programs" },
  { href: "/#weekly-live-sessions", label: "Schedule" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a3a1a] text-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 text-center sm:text-left">
          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/logo.webp"
                alt="Yoga for Cure Logo"
                width={40}
                height={40}
                className="w-9 h-9 object-contain"
              />
              <span className="font-[family-name:var(--font-poppins)] text-lg font-bold text-[#faf8f5]">
                Yoga for Cure
              </span>
            </div>
            <p className="text-sm text-[#f5f1eb]/70 leading-relaxed max-w-xs">
              Online yoga for strength and flexibility, taught in clear
              English by an experienced Indian instructor.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://www.instagram.com/yoga_for_cure/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@yogaforcurevideos?si=ghzfooOK5a0c_0ho"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-[0.72rem] font-bold uppercase tracking-widest text-[#9caf88] mb-4">
              Quick Links
            </span>
            <nav
              className="flex flex-col gap-2.5"
              aria-label="Footer navigation"
            >
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#f5f1eb]/80 hover:text-[#e8745b] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-[0.72rem] font-bold uppercase tracking-widest text-[#9caf88] mb-4">
              Connect
            </span>
            <p className="text-sm text-[#f5f1eb]/70 leading-relaxed mb-4 max-w-xs">
              Have a question, or ready to start? Reach out on WhatsApp and
              we&apos;ll get back to you the same day.
            </p>
            <Link
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2d5a2d] text-[#faf8f5] text-sm font-semibold hover:bg-[#e8745b] transition-colors duration-300"
            >
              <Phone className="w-3.5 h-3.5" />
              Message on WhatsApp
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#faf8f5]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-[#f5f1eb]/60">
            © {currentYear} Yoga for Cure. Made with{" "}
            <span className="text-[#e8745b]">♥</span> for every body.
          </p>
          <p className="text-xs text-[#f5f1eb]/40">
            Created by Tanishk Khare
          </p>
        </div>
      </div>
    </footer>
  );
}
