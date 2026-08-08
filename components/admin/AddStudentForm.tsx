"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function AddStudentForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ name: string; email: string } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create student.");
        return;
      }
      setResult(data.student);
      router.refresh();
    } catch {
      setError("Failed to create student.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setResult(null);
    setError(null);
  }

  if (result) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-[#2d5a2d] shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold text-[#1a3a1a] mb-1">Student created</h2>
            <p className="text-sm text-[#2d2d2d]">
              {result.name} ({result.email}) can now log in at{" "}
              <span className="font-medium">/login</span>. Share the password with them over
              WhatsApp, then grant them course access from Enrollments.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex px-5 py-2.5 rounded-full border border-[#2d5a2d] text-[#2d5a2d] text-sm font-medium hover:bg-[#2d5a2d] hover:text-white transition-colors"
        >
          Add another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#ede8e0] rounded-2xl p-6 sm:p-8 flex flex-col gap-5"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#1a3a1a] mb-1.5">
          Full name
        </label>
        <input
          id="name"
          type="text"
          required
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Priya Sharma"
          className="w-full px-4 py-2.5 rounded-lg border border-[#ede8e0] focus:outline-none focus:ring-2 focus:ring-[#9caf88]"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#1a3a1a] mb-1.5">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="student@example.com"
          className="w-full px-4 py-2.5 rounded-lg border border-[#ede8e0] focus:outline-none focus:ring-2 focus:ring-[#9caf88]"
        />
        <p className="text-xs text-[#6b6b6b] mt-1.5">Used as their login ID.</p>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-[#1a3a1a] mb-1.5">
          Phone number
        </label>
        <input
          id="phone"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="9876543210"
          className="w-full px-4 py-2.5 rounded-lg border border-[#ede8e0] focus:outline-none focus:ring-2 focus:ring-[#9caf88]"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#1a3a1a] mb-1.5">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          className="w-full px-4 py-2.5 rounded-lg border border-[#ede8e0] focus:outline-none focus:ring-2 focus:ring-[#9caf88]"
        />
        <p className="text-xs text-[#6b6b6b] mt-1.5">
          Set this yourself and share it with the student over WhatsApp after payment.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#e8745b] text-white font-semibold shadow-[0_8px_20px_rgba(232,116,91,0.32)] hover:shadow-[0_14px_28px_rgba(232,116,91,0.4)] transition-all disabled:opacity-60"
      >
        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
        Create student
      </button>
    </form>
  );
}
