import { getAllBlogs } from "@/features/blog/data";

export async function blogsLoader() {
  return { blogs: getAllBlogs() };
}
