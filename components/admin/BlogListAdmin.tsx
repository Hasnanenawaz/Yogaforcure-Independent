"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  updatedAt: string;
  images: { url: string }[];
};

export default function BlogListAdmin() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/blogs");
    if (res.ok) setBlogs(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    if (res.ok) setBlogs((b) => b.filter((x) => x.id !== id));
  }

  async function handleTogglePublish(blog: Blog) {
    setTogglingId(blog.id);
    const res = await fetch(`/api/blogs/${blog.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !blog.published }),
    });
    if (res.ok) {
      const updated = await res.json();
      setBlogs((list) =>
        list.map((b) => (b.id === blog.id ? { ...b, published: updated.published } : b))
      );
    }
    setTogglingId(null);
  }

  if (loading) {
    return <p className="text-[#2d2d2d]">Loading blogs…</p>;
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 bg-[#faf8f5] rounded-2xl border border-[#ede8e0] px-4">
        <p className="text-[#2d2d2d] mb-4">No blogs yet.</p>
        <Link
          href="/admin/dashboard/blogs/new"
          className="inline-flex px-6 py-3 rounded-full bg-[#2d5a2d] text-white font-medium hover:bg-[#1a3a1a]"
        >
          Create your first blog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <article
          key={blog.id}
          className="bg-[#faf8f5] rounded-2xl border border-[#ede8e0]/80 p-4 sm:p-6 flex flex-col gap-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
            {blog.images[0] && (
              <div className="shrink-0 w-full sm:w-28 h-40 sm:h-28 rounded-xl overflow-hidden bg-[#ede8e0]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blog.images[0].url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-base sm:text-lg font-semibold text-[#1a3a1a] break-words">
                  {blog.title}
                </h2>
                {blog.published ? (
                  <span className="inline-flex items-center gap-1 text-xs text-[#2d5a2d] bg-green-50 px-2 py-0.5 rounded-full shrink-0">
                    <Eye className="w-3 h-3" /> Published
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-[#2d2d2d] bg-[#ede8e0] px-2 py-0.5 rounded-full shrink-0">
                    <EyeOff className="w-3 h-3" /> Draft
                  </span>
                )}
              </div>
              <p className="text-sm text-[#2d2d2d] line-clamp-2">{blog.excerpt}</p>
              <p className="text-xs text-[#9caf88] mt-2">
                Updated {new Date(blog.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-2 border-t border-[#ede8e0]/80">
            <button
              type="button"
              onClick={() => handleTogglePublish(blog)}
              disabled={togglingId === blog.id}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg font-medium transition-colors disabled:opacity-60 ${
                blog.published
                  ? "border border-[#ede8e0] text-[#2d2d2d] hover:bg-[#f5f1eb]"
                  : "bg-[#9caf88]/20 text-[#1a3a1a] border border-[#9caf88]/40 hover:bg-[#9caf88]/30"
              }`}
            >
              {togglingId === blog.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : blog.published ? (
                <>
                  <EyeOff className="w-4 h-4" /> Unpublish
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" /> Publish
                </>
              )}
            </button>

            {blog.published && (
              <Link
                href={`/blog/${blog.slug}`}
                target="_blank"
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm rounded-lg border border-[#ede8e0] hover:bg-[#f5f1eb] text-center"
              >
                View live
              </Link>
            )}

            <Link
              href={`/admin/dashboard/blogs/${blog.id}/edit`}
              className="inline-flex items-center justify-center gap-1 px-4 py-2.5 text-sm rounded-lg bg-[#2d5a2d] text-white hover:bg-[#1a3a1a] text-center"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit
            </Link>

            <button
              type="button"
              onClick={() => handleDelete(blog.id, blog.title)}
              className="inline-flex items-center justify-center gap-1 px-4 py-2.5 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
