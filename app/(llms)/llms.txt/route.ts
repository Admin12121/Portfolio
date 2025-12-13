import { SITE_INFO } from "@/config/site";
import { getAllBlogs } from "@/features/blog/data";

const allPosts = getAllBlogs();

const content = `# biki.com.np

> A minimal dev portfolio, component registry, and blog to showcase my work as a Ethical Hacker.

- [About](${SITE_INFO.url}/about.md): A quick intro to me, my tech stack, and how to connect.
- [Projects](${SITE_INFO.url}/projects.md): Selected projects that show my skills and creativity.
- [Certifications](${SITE_INFO.url}/certifications.md): Certifications and credentials I've earned.
- [Private Chat](https://chat.biki.com.np): Secure, private chat application (access restricted).

## Blog

${allPosts.map((item) => `- [${item.title}](${SITE_INFO.url}/blog/${item.url}.mdx): ${item.description}`).join("\n")}
`;

export const dynamic = "force-static";

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}
