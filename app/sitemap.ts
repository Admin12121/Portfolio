import dayjs from "dayjs";
import type { MetadataRoute } from "next";

import { SITE_INFO } from "@/config/site";
import { getAllBlogs } from "@/features/blog/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const allBlogs = getAllBlogs();

  const posts = allBlogs.map((blog) => ({
    url: `${SITE_INFO.url}${blog.url}`,
    lastModified: dayjs(blog.updatedAt).toISOString(),
  }));

  const routes = ["", "/blog"].map((route) => ({
    url: `${SITE_INFO.url}${route}`,
    lastModified: dayjs().toISOString(),
  }));

  return [...routes, ...posts];
}
