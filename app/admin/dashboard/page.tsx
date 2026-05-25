import BlogListAdmin from "@/components/admin/BlogListAdmin";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a3a1a] mb-6">
        Your blogs
      </h1>
      <BlogListAdmin />
    </div>
  );
}
