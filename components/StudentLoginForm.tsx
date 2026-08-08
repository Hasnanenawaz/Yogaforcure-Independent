"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import Link from "next/link";

export default function StudentLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.push("/learn");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#1a3a1a] mb-1.5">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full px-4 py-3 rounded-lg border border-[#ede8e0] bg-white text-[#1a3a1a] focus:outline-none focus:ring-2 focus:ring-[#2d5a2d]/30 focus:border-[#2d5a2d]"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#1a3a1a] mb-1.5">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full px-4 py-3 rounded-lg border border-[#ede8e0] bg-white text-[#1a3a1a] focus:outline-none focus:ring-2 focus:ring-[#2d5a2d]/30 focus:border-[#2d5a2d]"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-lg bg-[#2d5a2d] text-white font-semibold hover:bg-[#1a3a1a] transition-colors disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Log in"}
      </button>
      <p className="text-center text-sm text-[#6b6b6b]">
        Forgot password?{" "}
        <Link
          href={getWhatsAppUrl("Hi, I forgot my course login password.")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#e8745b] hover:text-[var(--coral-light)] font-medium"
        >
          Contact us on WhatsApp
        </Link>
      </p>
    </form>
  );
}
