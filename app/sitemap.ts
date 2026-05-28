import dayjs from "dayjs";
import type { MetadataRoute } from "next";

import { SITE_INFO } from "@/config/site";
import { getAllPosts } from "@/features/blog/data";
import { getAllWriteups } from "@/features/writeups/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const allPosts = getAllPosts();
  const allWriteups = getAllWriteups();

  const posts = allPosts.map((post) => ({
    url: `${SITE_INFO.url}${post.slug}`,
    lastModified: dayjs(post.metadata.updatedAt).toISOString(),
  }));

  const writeups = allWriteups.map((writeup) => ({
    url: `${SITE_INFO.url}/writeups/${writeup.slug}`,
    lastModified: dayjs(writeup.metadata.updatedAt).toISOString(),
  }));

  const routes = ["", "/blog", "/writeups"].map((route) => ({
    url: `${SITE_INFO.url}${route}`,
    lastModified: dayjs().toISOString(),
  }));

  return [...routes, ...posts, ...writeups];
}
