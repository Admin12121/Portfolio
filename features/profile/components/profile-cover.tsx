import { cn } from "@/lib/utils";
import Security from "./secutity";

export function ProfileCover() {
  return (
    <div
      data-blueprint-cover="" data-draft-frame=""
      className={cn(
        "aspect-2/1 border-x border-edge select-none sm:aspect-3/1",
        "flex items-center justify-center text-black dark:text-white",
        "border-edge border-b before:-top-px after:-bottom-px",
      )}
    >
        <Security />
    </div>
  );
}
