import { BlockDisplay } from "@/components/block-display";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert } from "lucide-react";

export default function Lab() {
  return (
    <main className="container-wrapper section-soft flex-1 ">
      <div className="container border-x min-h-[calc(100dvh-160px)] md:py-12">
        <div className="flex flex-col gap-6 md:gap-24">
          <Alert className="relative">
            <CircleAlert className="absolute top-4 left-3 size-6!  stroke-indigo-500"/>
            <AlertDescription>
              This page is intended for educational and lawful and ethical
              investigative purposes only. Accessing, interacting, or utilizing
              available resources on the page for illegal purposes may be
              unlawful depending on your jurisdiction. The author is not
              responsible for any misuse of this tool or the data gathered using
              it.
            </AlertDescription>
          </Alert>
          <BlockDisplay />
        </div>
      </div>
    </main>
  );
}
