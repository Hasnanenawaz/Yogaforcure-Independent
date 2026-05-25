"use client";

import Link from "next/link";
import { Instagram, Youtube } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a3a1a] text-[#faf8f5] py-8 px-4">
      <div className="max-w-7xl mx-auto text-center flex flex-col items-center justify-center">
        {/* Internal links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mb-4 text-sm sm:text-base" aria-label="Footer navigation">
          <Link href="/#why-learn-with-me" className="text-[#faf8f5] hover:text-[#9caf88] transition-colors">
            About
          </Link>
          <Link href="/#what-we-offer" className="text-[#faf8f5] hover:text-[#9caf88] transition-colors">
            Programs
          </Link>
          <Link href="/#weekly-live-sessions" className="text-[#faf8f5] hover:text-[#9caf88] transition-colors">
            Schedule
          </Link>
          <Link href="/#pricing" className="text-[#faf8f5] hover:text-[#9caf88] transition-colors">
            Pricing
          </Link>
          <Link href="/gallery" className="text-[#faf8f5] hover:text-[#9caf88] transition-colors">
            Gallery
          </Link>
          <Link href="/blog" className="text-[#faf8f5] hover:text-[#9caf88] transition-colors">
            Blog
          </Link>
        </nav>
        <p className="text-sm sm:text-base">
          © {currentYear} Yoga for Cure
        </p>
        <p className="text-xs sm:text-sm mt-2 text-[#9caf88]">
          Made with <span className="text-[#e8b4a0]">♥</span> by Yoga for Cure
        </p>
        
        {/* Social Media Links */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <a
            href="https://www.instagram.com/yoga_for_cure/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-white hover:scale-110 transition-transform duration-300"
            aria-label="Follow us on Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://youtube.com/@yogaforcurevideos?si=ghzfooOK5a0c_0ho"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white hover:scale-110 transition-transform duration-300"
            aria-label="Subscribe to our YouTube channel"
          >
            <Youtube className="w-5 h-5" />
          </a>
        </div>

        <p className="text-[#1a3a1a] text-[5px] mt-4">
          Created by Tanishk Khare
        </p>
      </div>
    </footer>
  );
}
