import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createStudentSession } from "@/lib/studentAuth";
import { checkRateLimit } from "@/lib/rateLimit";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const { allowed, retryAfterMs } = checkRateLimit(
      `student-login:${normalizedEmail}`,
      MAX_ATTEMPTS,
      WINDOW_MS,
    );
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Try again in a few minutes." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } },
      );
    }

    const student = await prisma.student.findUnique({ where: { email: normalizedEmail } });
    if (!student || !student.isActive) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, student.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await createStudentSession({
      studentId: student.id,
      name: student.name,
      email: student.email,
    });

    return NextResponse.json({ success: true, name: student.name, email: student.email });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
