import { NextResponse } from "next/server";
import { getStudentSession } from "@/lib/studentAuth";

export async function GET() {
  const session = await getStudentSession();
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  return NextResponse.json({ student: session });
}
