"use client";

import { useEffect, useState } from "react";

type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
};

export default function StudentListAdmin() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/students")
      .then((res) => (res.ok ? res.json() : { students: [] }))
      .then((data) => setStudents(data.students))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-[#2d2d2d]">Loading students…</p>;
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 bg-[#faf8f5] rounded-2xl border border-[#ede8e0] px-4">
        <p className="text-[#2d2d2d]">No students yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-[#faf8f5] rounded-2xl border border-[#ede8e0]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[#ede8e0] text-[#6b6b6b] uppercase text-xs tracking-wide">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-b border-[#ede8e0]/60 last:border-0">
              <td className="px-4 py-3 text-[#1a3a1a] font-medium">{student.name}</td>
              <td className="px-4 py-3 text-[#2d2d2d] break-all">{student.email}</td>
              <td className="px-4 py-3 text-[#2d2d2d]">{student.phone}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full ${
                    student.isActive
                      ? "text-[#2d5a2d] bg-green-50"
                      : "text-red-600 bg-red-50"
                  }`}
                >
                  {student.isActive ? "Active" : "Disabled"}
                </span>
              </td>
              <td className="px-4 py-3 text-[#6b6b6b]">
                {new Date(student.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
