import { getAllPosts } from "@/features/blog/data";
import { getAllWriteups } from "@/features/ctf-writeups/data";
import { PROJECTS } from "@/features/profile/data/projects";
import { USER } from "@/features/profile/data/user";

const aboutText = `## About

${USER.about.trim()}

### Personal Information

- First Name: ${USER.firstName}
- Last Name: ${USER.lastName}
- Display Name: ${USER.displayName}
- Location: ${USER.address}
- Website: ${USER.website}
`;

const projectsText = `## Projects

${PROJECTS.map((item) => {
  const skills = `\n\nSkills: ${item.skills.join(", ")}`;
  const description = item.description ? `\n\n${item.description.trim()}` : "";
  return `### ${item.title}\n\nProject URL: ${item.link}${skills}${description}`;
}).join("\n\n")}
`;

function getBlogContent() {
  const allBlogs = getAllPosts();
  const blogTexts = allBlogs.map((blog) => {
    return `### ${blog.metadata.title}

${blog.metadata.description}

Published: ${new Date(blog.metadata.createdAt).toLocaleDateString()}
Last Updated: ${new Date(blog.metadata.updatedAt).toLocaleDateString()}
URL: ${blog.slug}
${blog.metadata.category ? `Category: ${blog.metadata.category}` : ""}`;
  });
  return blogTexts.join("\n\n");
}

function getWriteupsContent() {
  const allWriteups = getAllWriteups();
  const writeupTexts = allWriteups.map((writeup) => {
    return `### ${writeup.metadata.title}

${writeup.metadata.description}

Published: ${new Date(writeup.metadata.createdAt).toLocaleDateString()}
Last Updated: ${new Date(writeup.metadata.updatedAt).toLocaleDateString()}
URL: ${writeup.slug}
${writeup.metadata.category ? `Category: ${writeup.metadata.category}` : ""}`;
  });
  return writeupTexts.join("\n\n");
}

function getContent() {
  const blogContent = getBlogContent();
  const writeupsContent = getWriteupsContent();

  return `${aboutText}

${projectsText}

## Blog

${blogContent}

## CTF Writeups

${writeupsContent}`;
}

export const dynamic = "force-static";

export async function GET() {
  return new Response(getContent(), {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}
