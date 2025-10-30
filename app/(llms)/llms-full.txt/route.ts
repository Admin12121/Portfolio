import { getAllBlogs } from "@/features/blog/data";
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
  const allBlogs = getAllBlogs();
  const blogTexts = allBlogs.map((blog) => {
    return `### ${blog.title}

${blog.description}

Published: ${new Date(blog.createdAt).toLocaleDateString()}
Last Updated: ${new Date(blog.updatedAt).toLocaleDateString()}
URL: ${blog.url}
${blog.category ? `Category: ${blog.category}` : ""}`;
  });
  return blogTexts.join("\n\n");
}

function getContent() {
  const blogContent = getBlogContent();

  return `${aboutText}

${projectsText}

## Blog

${blogContent}`;
}

export const dynamic = "force-static";

export async function GET() {
  return new Response(getContent(), {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}
