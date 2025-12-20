import { BlockDisplay } from "@/components/block-display";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert } from "lucide-react";
import type { Metadata } from "next";
import { createMetadata, getPageImage } from "@/lib/metadata";
import { ShimmeringText } from "@/components/global/shimmering-text";

export default function page() {
  return (
    <main className="container-wrapper section-soft flex-1 ">
      <div className="container border-x min-h-[calc(100dvh-160px)] md:py-12">
        <div className="w-dvw! left-0 top-0 fixed z-[50] h-dvh flex items-center justify-center px-5 lg:hidden">
          <div className="w-dvw left-0 absolute z-[60] backdrop-blur-sm h-dvh! top-0" />
          <div
            className="flex-col mx-auto bg-background rounded-4xl relative z-[92] w-full max-w-4xl cursor-default overflow-hidden border p-10 "
          >
            <h1 className="text-4xl font-semibold leading-8 tracking-tighter">
              This page requires a minimum screen width of 1024px for the best
              experience. Please use a larger device or resize your browser
              window.
              <div className="h-px w-full"></div>
            </h1>
            <div className="relative h-60 mt-5">
              <ShimmeringText text="Please use a larger device or resize your browser window." />
              <h1 className="absolute left-1/2 -bottom-9 translate-x-[-50%] translate-y-10 text-zinc-900 w-full text-center text-9xl">
                Admin12121
              </h1>
            </div>
          </div>
        </div>
        <div className="flex-col gap-6 md:gap-24"></div>
        <Alert className="relative">
          <CircleAlert className="absolute top-4 left-3 size-6! stroke-indigo-500" />
          <AlertDescription>
            This page is intended for educational and lawful and ethical
            investigative purposes only. Accessing, interacting, or utilizing
            available resources on the page for illegal purposes may be unlawful
            depending on your jurisdiction. The author is not responsible for
            any misuse of this tool or the data gathered using it.
          </AlertDescription>
        </Alert>
        <BlockDisplay />
      </div>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const image = {
    url: getPageImage("lab").url,
    width: 1920,
    height: 1080,
    alt: "Lab Page",
  };

  return createMetadata({
    title: "Red Teaming Lab",
    description: "Explore various tools and resources in the red teaming lab.",
    openGraph: {
      url: `/lab`,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      images: [image],
    },
  });
}
