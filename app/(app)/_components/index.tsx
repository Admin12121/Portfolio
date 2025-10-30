// import { source } from "@/lib/source";
// import { FlickeringGrid } from "@/components/global/fliketgrid";
// import { BlurFade } from "@/components/global/fadeinout";
import { cn } from "@/lib/utils";
import { ProfileHeader } from "@/features/profile/components/profile-header";
import { About } from "@/features/profile/components/about";
import { GitHubContributions } from "@/features/profile/components/github-contributions";
import { Projects } from "@/features/profile/components/projects";
// import { Certifications } from "@/features/profile/components/certifications";
import { ProfileCover } from "@/features/profile/components/profile-cover";
import { Blogs } from "@/features/blog/components";

export default function Home() {
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

        {/* <Certifications />
        <Separator /> */}

        <Blogs />
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
        className
      )}
    />
  );
}
