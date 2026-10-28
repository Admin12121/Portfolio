import { ProfileHeader } from "@/features/profile/components/profile-header";
import { About } from "@/features/profile/components/about";
import { GitHubContributions } from "@/features/profile/components/github-contributions";
import { Projects } from "@/features/profile/components/projects";
import { ProfileCover } from "@/features/profile/components/profile-cover";
import { FrameWidthDimension } from "@/features/profile/components/frame-width-dimension";
import { Blogs } from "@/features/blog/components";
import { Separator } from "@/components/separator";

import { Certifications } from "@/features/profile/components/certifications";
import { Recognition } from "@/features/profile/components/recognition";
import { BlueprintPreloader } from "@/components/blueprint/blueprint-preloader";
import { USER } from "@/features/profile/data/user";

export default function page() {
  return (
    <>
    <BlueprintPreloader
      rootSelector="[data-blueprint-root]"
      maxBlocks={58}
    />
    <main data-blueprint-root="" className="container-wrapper max-w-screen! overflow-x-hidden p-0">
      <div className="relative mx-auto px-0! container md:fixed:max-w-6xl">
        <FrameWidthDimension />
        <ProfileCover />
        <ProfileHeader />
        <Separator />

        <About />
        <Separator />

        <GitHubContributions />
        <Separator />

        <Recognition />
        <Separator />

        <Projects />
        <Separator />

        <Certifications />
        <Separator />

        <Blogs />
        <Separator />
      </div>
    </main>
    </>
  );
}
