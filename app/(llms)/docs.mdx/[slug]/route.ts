import { notFound } from "next/navigation";

import { getAllBlogs } from "@/features/blog/data";
import { getLLMText } from "@/features/blog/lib/get-llm-text";
import { source } from "@/lib/source";
import type { Post } from "@/features/blog/types/blog";

export async function generateStaticParams() {
  const posts = getAllBlogs();

  return posts.map((post) => ({
    slug: post.url.replace("/blog/", ""),
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const allBlogs = getAllBlogs();
  const blog = allBlogs.find(
    (b) => b.url === `/blog/${slug}` || b.url === slug,
  );

  if (!blog) {
    notFound();
  }

  try {
    const pageSlug = blog.url.replace("/blog/", "");
    const page = source.getPage([pageSlug]);

    if (!page) {
      return new Response(
        `# ${blog.title}\n\n${blog.description}\n\nPublished: ${new Date(blog.createdAt).toLocaleDateString()}\nLast Updated: ${new Date(blog.updatedAt).toLocaleDateString()}`,
        {
          headers: {
            "Content-Type": "text/markdown;charset=utf-8",
          },
        },
      );
    }

    let textContent = "";
    
    const structuredContents = (page as any)?.data?.structuredData?.contents;
    if (Array.isArray(structuredContents)) {
      textContent = structuredContents
        .map((content: any) => {
          if (typeof content === "string") return content;
          if (content?.text) return content.text;
          if (content?.heading) return content.heading;
          return "";
        })
        .filter(Boolean)
        .join("\n\n");
    } else {
      const processed = (page as any)?.data?.processedMarkdown;
      if (typeof processed === "string") {
        textContent = processed;
      } else {
        textContent = [blog.title, blog.description].filter(Boolean).join("\n\n");
      }
    }

    const post: Post = {
      metadata: blog,
      url: blog.url,
      content: textContent,
    };

    return new Response(await getLLMText(post), {
      headers: {
        "Content-Type": "text/markdown;charset=utf-8",
      },
    });
  } catch (_error) {
    return new Response(
      `# ${blog.title}\n\n${blog.description}\n\nPublished: ${new Date(blog.createdAt).toLocaleDateString()}\nLast Updated: ${new Date(blog.updatedAt).toLocaleDateString()}`,
      {
        headers: {
          "Content-Type": "text/markdown;charset=utf-8",
        },
      },
    );
  }
}