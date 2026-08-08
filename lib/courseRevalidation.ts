import { revalidatePath } from "next/cache";

export function revalidateCoursePaths(slug: string) {
  revalidatePath("/");
  revalidatePath(`/courses/${slug}`);
}
