"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ChevronDown, Phone, User, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import CallModal from "./CallModal";

type StudentInfo = { name: string; email: string };

const navLinks = [
  { href: "/", label: "Home" },
  {
    href: "#programs",
    label: "Programs",
    dropdown: [
      { href: "#live-group-sessions", label: "Online Group Live Sessions" },
      { href: "#youtube-membership", label: "YouTube Membership" },
      { href: "#corporate-wellness", label: "Corporate Wellness" },
      { href: "#one-on-one-sessions", label: "1-on-1 Personal Sessions" },
    ],
  },
  { href: "#courses", label: "Courses" },
  { href: "#about", label: "About" },
  { href: "#schedule", label: "Schedule" },
  { href: "#pricing", label: "Pricing" },
  { href: "#gallery", label: "Gallery" },
  { href: "#faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
];

export default function FloatingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const { scrollY } = useScroll();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/student/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setStudent(data?.student ?? null))
      .catch(() => setStudent(null));
  }, []);

  async function handleLogout() {
    await fetch("/api/student/logout", { method: "POST" });
    setStudent(null);
    setIsMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Detect when scrolled past hero section
  useMotionValueEvent(scrollY, "change", (latest) => {
    const heroHeight = window.innerWidth >= 1024 
      ? window.innerHeight 
      : window.innerWidth >= 640 
        ? window.innerHeight * 0.85 
        : window.innerHeight;
    setIsPastHero(latest > heroHeight - 50);
  });

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  // Smooth scroll handler with navbar offset
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
    // Close dropdown if open
    setActiveDropdown(null);

    // Map href to actual section ID
    const hrefToIdMap: Record<string, string> = {
      "#about": "why-learn-with-me",
      "#schedule": "weekly-live-sessions",
      "#live-group-sessions": "live-group-sessions",
      "#youtube-membership": "youtube-membership",
      "#corporate-wellness": "corporate-wellness",
      "#one-on-one-sessions": "one-on-one-sessions",
      "#pricing": "pricing",
      "#gallery": "gallery",
    };

    // Get the target ID (use mapping if available, otherwise extract from href)
    const targetId = hrefToIdMap[href] || href.replace("#", "");

    // If we're not on the home page, navigate to home page first with hash
    if (pathname !== "/") {
      // Navigate to home page with hash
      window.location.href = `/${href}`;
      return;
    }

    // If we're already on the home page, scroll directly
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      // Calculate offset: navbar height + some padding
      // Floating navbar is approximately 60-80px tall, add 20px padding
      const navbarOffset = 100;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;

      // Smooth scroll with native behavior
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Floating Navbar Container - Only sticky while in hero section */}
      {!isPastHero && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[1400px] px-4 sm:px-6"
        >
        <div className="rounded-full bg-[#faf8f5]/80 backdrop-blur-md border border-[#9caf88]/30 shadow-lg px-4 sm:px-6 py-3 mx-auto">
          <div className="flex items-center justify-between w-full gap-2">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 group shrink-0"
              aria-label="Yoga for Cure by Neha"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2"
              >
                <Image
                  src="/logo.webp"
                  alt="Yoga for Cure Logo"
                  width={48}
                  height={48}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
                  priority
                />
                <span className="font-[family-name:var(--font-poppins)] text-base sm:text-lg md:text-xl font-bold text-[#1a3a1a] group-hover:text-[#2d5a2d] transition-colors whitespace-nowrap">
                  Yoga for Cure
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-0.5 flex-1 justify-center min-w-0">
              {navLinks.map((link) => (
                <div key={link.href} className="relative">
                  {link.dropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(link.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button
                        type="button"
                        onClick={() => handleDropdownToggle(link.label)}
                        className="flex items-center gap-1 px-2.5 py-2 text-[#1a3a1a] font-medium hover:text-[#2d5a2d] transition-colors rounded-full group whitespace-nowrap"
                      >
                        {link.label}
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-200 ${
                            activeDropdown === link.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === link.label && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-[#faf8f5]/95 backdrop-blur-md shadow-lg border border-[#9caf88]/30 py-2 overflow-hidden"
                          >
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="block px-5 py-3 text-[#1a3a1a] hover:bg-[#9caf88]/30 hover:text-[#2d5a2d] transition-colors text-sm font-medium"
                                onClick={(e) => handleSmoothScroll(e, item.href)}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={(e) => {
                        // Handle smooth scroll for all hash links
                        if (link.href.startsWith("#")) {
                          handleSmoothScroll(e, link.href);
                        } else if (link.href === "/") {
                          // For home, scroll to top if already on home page
                          if (window.location.pathname === "/") {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                          // Otherwise, let Next.js handle navigation
                        }
                        // For /pricing and other links, let them navigate normally
                      }}
                      className="relative px-2.5 py-2 text-[#1a3a1a] font-medium hover:text-[#2d5a2d] transition-colors rounded-full group whitespace-nowrap"
                    >
                      {link.label}
                      <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-[#e8745b] rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            <motion.div className="hidden xl:flex items-center gap-1.5 shrink-0">
              {student ? (
                <>
                  <Link
                    href="/learn"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#2d5a2d] text-[#2d5a2d] font-medium rounded-full hover:bg-[#2d5a2d] hover:text-[#faf8f5] transition-colors duration-300 whitespace-nowrap text-sm"
                  >
                    <User className="w-4 h-4" />
                    {student.name.split(" ")[0]}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Log out"
                    className="p-2 rounded-full text-[#1a3a1a] hover:bg-[#e8ede8]/40 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center px-3.5 py-2 border border-[#2d5a2d] text-[#2d5a2d] font-medium rounded-full hover:bg-[#2d5a2d] hover:text-[#faf8f5] transition-colors duration-300 whitespace-nowrap text-sm"
                >
                  Log in
                </Link>
              )}
              <button
                onClick={() => {
                  if (isMobile) {
                    window.location.href = "tel:918310764597";
                  } else {
                    setIsCallModalOpen(true);
                  }
                }}
                className="inline-flex items-center px-3.5 py-2 bg-[#2d5a2d] text-[#faf8f5] font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-[#1a3a1a] transition-all duration-300 whitespace-nowrap text-sm cursor-pointer"
              >
                <Phone className="w-4 h-4 mr-1.5" />
                Call Now
              </button>
              <Link
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  // Ensure WhatsApp link opens properly
                  e.stopPropagation();
                }}
                className="inline-flex items-center px-3.5 py-2 bg-[#2d5a2d] text-[#faf8f5] font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-[#1a3a1a] transition-all duration-300 whitespace-nowrap text-sm"
              >
                Book Consultation
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 text-[#1a3a1a] rounded-full hover:bg-[#e8ede8]/40 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 xl:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 sm:px-6 xl:hidden"
            >
              <div className="rounded-3xl bg-[#faf8f5]/95 backdrop-blur-md shadow-xl border border-[#9caf88]/30 overflow-hidden">
                <nav className="px-6 py-6 space-y-2">
                  {navLinks.map((link) => (
                    <div key={link.href}>
                      {link.dropdown ? (
                        <div>
                          <button
                            type="button"
                            onClick={() => handleDropdownToggle(link.label)}
                            className="w-full flex items-center justify-between px-4 py-3 text-[#1a3a1a] font-medium rounded-full hover:bg-[#e8ede8]/40 transition-colors"
                          >
                            {link.label}
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                activeDropdown === link.label
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {activeDropdown === link.label && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 space-y-1">
                                  {link.dropdown.map((item) => (
                                    <Link
                                      key={item.href}
                                      href={item.href}
                                      className="block px-4 py-2.5 text-sm text-[#1a3a1a] rounded-full hover:bg-[#9caf88]/30 hover:text-[#2d5a2d] transition-colors"
                                      onClick={(e) => handleSmoothScroll(e, item.href)}
                                    >
                                      {item.label}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={link.href}
                          className="block px-4 py-3 text-[#1a3a1a] font-medium rounded-full hover:bg-[#e8ede8]/40 transition-colors"
                          onClick={(e) => {
                            // Handle smooth scroll for hash links (#about, #schedule, #programs dropdown items)
                            if (link.href.startsWith("#")) {
                              e.preventDefault();
                              setIsMobileMenuOpen(false);
                              // Small delay to allow menu to close, then handle navigation/scroll
                              setTimeout(() => {
                                handleSmoothScroll(e, link.href);
                              }, 100);
                            } else if (link.href === "/") {
                              // For home, scroll to top if already on home page
                              if (window.location.pathname === "/") {
                                e.preventDefault();
                                setIsMobileMenuOpen(false);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              } else {
                                // Otherwise, let Next.js handle navigation
                                setIsMobileMenuOpen(false);
                              }
                            } else {
                              // For /pricing and other links, just close menu
                              setIsMobileMenuOpen(false);
                            }
                          }}
                        >
                          {link.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Mobile CTA Buttons */}
                <div className="px-6 pb-6 space-y-3">
                  {student ? (
                    <>
                      <Link
                        href="/learn"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 border border-[#2d5a2d] text-[#2d5a2d] font-semibold rounded-full hover:bg-[#2d5a2d] hover:text-[#faf8f5] transition-colors duration-300"
                      >
                        <User className="w-5 h-5" />
                        My Courses
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 text-[#6b6b6b] font-medium hover:text-[#1a3a1a] transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 border border-[#2d5a2d] text-[#2d5a2d] font-semibold rounded-full hover:bg-[#2d5a2d] hover:text-[#faf8f5] transition-colors duration-300"
                    >
                      Log in
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (isMobile) {
                        window.location.href = "tel:918310764597";
                      } else {
                        setIsCallModalOpen(true);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#9caf88] text-[#1a3a1a] font-semibold rounded-full shadow-md hover:bg-[#8ba077] transition-all duration-300"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </button>
                  <Link
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-6 py-3.5 bg-[#2d5a2d] text-[#faf8f5] font-semibold rounded-full shadow-md hover:bg-[#1a3a1a] transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Call Modal */}
      <CallModal isOpen={isCallModalOpen} onClose={() => setIsCallModalOpen(false)} />
    </>
  );
}
