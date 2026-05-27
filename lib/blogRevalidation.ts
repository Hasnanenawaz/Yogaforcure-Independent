import { revalidatePath } from "next/cache";

/**
 * Centralized cache invalidation for blog content.
 *
 * We invalidate both the list + detail pages and sitemap because:
 * - `/blog` is ISR-cached and must reflect new/updated posts.
 * - `/blog/[slug]` metadata + HTML must update after edits/publish toggles.
 * - `/sitemap.xml` must include new published slugs for SEO.
 */
export function revalidateBlogPaths(slug?: string) {
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/blog/${slug}`);
}

