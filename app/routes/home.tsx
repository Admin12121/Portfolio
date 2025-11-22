"use client"
import type { Route } from "./+types/home";
import { cn } from "@/lib/utils";
import { useLoaderData } from "react-router";
import { blogsLoader } from "@/features/blog/components/blog-loader";
import type { Blog } from "@/features/blog/types/blog";
import { ProfileCover } from "@/features/profile/components/profile-cover";
import { ProfileHeader } from "@/features/profile/components/profile-header";
import { About } from "@/features/profile/components/about";
import { GitHubContributions } from "@/features/profile/components/github-contributions";
import { Projects } from "@/features/profile/components/projects";
import { Blogs } from "@/features/blog/components";
// import { Certifications } from "@/features/profile/components/certifications";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const loader = blogsLoader;

export default function Home() {
  const { blogs } = useLoaderData() as { blogs: Blog[] };

  return (
    <main className="max-w-screen overflow-x-hidden px-2">
      <div className="mx-auto md:max-w-3xl">
        <ProfileCover />
        <ProfileHeader />
        <Separator />
        <About />
        <Separator />
        <GitHubContributions />
        <Separator />
        <Projects />
        <Separator />
        <Blogs blogs={blogs}/>
        <Separator />
      </div>
    </main>
  );
}

function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-8 w-full border-x border-edge",
        "before:absolute before:-left-[100vw] before:-z-1 before:h-8 before:w-[200vw]",
        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56",
        className,
      )}
    />
  );
}
