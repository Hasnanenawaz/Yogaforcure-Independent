"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil } from "lucide-react";

type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
};

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-[#ede8e0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5a2d]/30 text-sm";

function EditRow({ student, onDone }: { student: Student; onDone: (updated: Student) => void }) {
  const [name, setName] = useState(student.name);
  const [phone, setPhone] = useState(student.phone);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const body: Record<string, string> = { name: name.trim(), phone: phone.trim() };
      if (password) body.password = password;
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save");
        return;
      }
      onDone(data.student);
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr className="border-b border-[#ede8e0]/60 bg-white">
      <td className="px-4 py-3" colSpan={5}>
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#1a3a1a] mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#1a3a1a] mb-1">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#1a3a1a] mb-1">
              Reset password (optional)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              className={inputClass}
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        <div className="flex items-center gap-2 mt-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2d5a2d] text-white text-sm font-medium hover:bg-[#1a3a1a] disabled:opacity-60"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save
          </button>
          <button
            type="button"
            onClick={() => onDone(student)}
            className="px-4 py-2 rounded-lg text-sm text-[#6b6b6b] hover:bg-[#f5f1eb]"
          >
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function StudentListAdmin() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/students")
      .then((res) => (res.ok ? res.json() : { students: [] }))
      .then((data) => setStudents(data.students))
      .finally(() => setLoading(false));
  }, []);

  async function handleToggleActive(student: Student) {
    setBusyId(student.id);
    const res = await fetch(`/api/admin/students/${student.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !student.isActive }),
    });
    if (res.ok) {
      const data = await res.json();
      setStudents((list) => list.map((s) => (s.id === student.id ? data.student : s)));
    }
    setBusyId(null);
  }

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
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) =>
            editingId === student.id ? (
              <EditRow
                key={student.id}
                student={student}
                onDone={(updated) => {
                  setStudents((list) => list.map((s) => (s.id === updated.id ? updated : s)));
                  setEditingId(null);
                }}
              />
            ) : (
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
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(student.id)}
                      className="p-1.5 rounded-md border border-[#ede8e0] text-[#2d2d2d] hover:bg-white"
                      aria-label="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(student)}
                      disabled={busyId === student.id}
                      className="px-3 py-1.5 rounded-md border border-[#ede8e0] text-xs font-medium text-[#2d2d2d] hover:bg-white disabled:opacity-60"
                    >
                      {student.isActive ? "Disable" : "Enable"}
                    </button>
                  </div>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
