import CommentsInbox from "@/components/admin/CommentsInbox";

export default function AdminCommentsPage() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a3a1a] mb-6">Student questions</h1>
      <CommentsInbox />
    </div>
  );
}
