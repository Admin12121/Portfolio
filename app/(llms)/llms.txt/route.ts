import { SITE_INFO } from "@/config/site";
import { getAllPosts } from "@/features/blog/data";
import { getAllWriteups } from "@/features/ctf-writeups/data";

const allPosts = getAllPosts();
const allWriteups = getAllWriteups();

const content = `# admin12121.com

> A minimal dev portfolio and blog to showcase my work as a Ethical Hacker.

- [About](${SITE_INFO.url}/about.md): A quick intro to me, my tech stack, and how to connect.
- [Projects](${SITE_INFO.url}/projects.md): Selected projects that show my skills and creativity.
- [Certifications](${SITE_INFO.url}/certifications.md): Certifications and credentials I've earned.
- [Private Chat](https://chat.admin12121.com): Secure, private chat application (access restricted).

## Blog

${allPosts.map((item) => `- [${item.metadata.title}](${SITE_INFO.url}/blog/${item.slug}.mdx): ${item.metadata.description}`).join("\n")}

## CTF Writeups

- [CTF Writeups](${SITE_INFO.url}/ctf-writeups): CTF writeups and exploit notes.

${allWriteups.map((item) => `- [${item.metadata.title}](${SITE_INFO.url}/ctf-writeups/${item.slug}.mdx): ${item.metadata.description}`).join("\n")}
`;

export const dynamic = "force-static";

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}
