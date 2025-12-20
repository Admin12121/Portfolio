import { ProfileHeader } from "@/features/profile/components/profile-header";
import { About } from "@/features/profile/components/about";
import { GitHubContributions } from "@/features/profile/components/github-contributions";
import { Projects } from "@/features/profile/components/projects";
import { ProfileCover } from "@/features/profile/components/profile-cover";
import { Blogs } from "@/features/blog/components";
import { Separator } from "@/components/separator";

// import { Certifications } from "@/features/profile/components/certifications";

export default function page() {
  return (
    <main className="container-wrapper max-w-screen! overflow-x-hidden">
      <div className="relative mx-auto px-0! container md:fixed:max-w-3xl">
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
};