import { FlickeringGrid } from "@/components/global/fliketgrid";
import { cn } from "@/lib/utils";

export function ProfileCover() {
  return (
    <div
      className={cn(
        "aspect-2/1 border-x border-edge select-none sm:aspect-3/1",
        "flex items-center justify-center text-black dark:text-white",
        "screen-line-before screen-line-after before:-top-px after:-bottom-px",
      )}
    >
      <span className="absolute w-dvw h-full">
        <div className="absolute z-99 size-1.5 rotate-45 border border-offgray-100 dark:border-offgray-900 bg-white dark:bg-[hsl(219,92%,2%)] bottom-[calc(-1*var(--node-vertical-offset))] left-[45.5px] hide lg:block"></div>
        <div className="absolute z-99 size-1.5 rotate-45 border border-offgray-100 dark:border-offgray-900 bg-white dark:bg-[hsl(219,92%,2%)] bottom-[calc(-1*var(--node-vertical-offset))] right-[45.5px] hide lg:block"></div>
        <span className="relative flex h-full z-1 sm:w-6 md:w-12 shrink-0 border-r lg:border-r-0">
          <div
            className="absolute top-0 bottom-0"
            style={{
              width: "10px",
              height: "100%",
              right: "-0.5px",
              transform: "translateX(50%)",
            }}
          >
            <div
              className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex flex-col"
              style={{ width: "1px" }}
            >
              <div
                className="w-px bg-[#e4e4e7] dark:bg-[#27272a]"
                style={{
                  flex: "2.6663 1 0%",
                }}
              ></div>
              <div
                className="w-px bg-[#e4e4e7] dark:bg-[#27272a]"
                style={{
                  flex: "3.20053 1 0%",
                }}
              ></div>
              <div
                className="w-px bg-[repeating-linear-gradient(#e4e4e7_0_4px,#fff_4px_8px)] dark:bg-[repeating-linear-gradient(#1d1e22_0_4px,#121316_4px_8px)]"
                style={{
                  flex: "2.59889 1 0%",
                }}
              ></div>
              <div
                className="w-px bg-[#e4e4e7] dark:bg-[#27272a]"
                style={{
                  flex: "2.419 1 0%",
                }}
              ></div>
            </div>
          </div>
        </span>
      </span>
      <div>
        <FlickeringGrid
          className="absolute inset-0 z-0 size-full"
          squareSize={4}
          gridGap={3}
          color="#6B7280"
          maxOpacity={0.5}
          flickerChance={0.1}
          height={385}
          width={1150}
        />
        <div className="absolute z-99 size-1.5 rotate-45 border border-offgray-100 dark:border-offgray-900 bg-white dark:bg-[hsl(219,92%,2%)] bottom-[calc(-1*var(--node-vertical-offset))] -left-[3.5px] hide lg:block"></div>
        <div className="absolute z-99 size-1.5 rotate-45 border border-offgray-100 dark:border-offgray-900 bg-white dark:bg-[hsl(219,92%,2%)] bottom-[calc(-1*var(--node-vertical-offset))] -right-[3.5px] hide lg:block"></div>
      </div>
      <span className="absolute w-dvw h-full">
        <span className="relative z-1 flex h-full sm:w-6 md:w-12 shrink-0 border-l lg:border-l-0  left-[calc(100%-49px)]">
          <div
            className="absolute top-0 bottom-0 default-border-text-color"
            style={{
              width: "10px",
              height: "100%",
              left: "-0.5px",
              transform: "translateX(-50%)",
            }}
          >
            <div
              className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex flex-col"
              style={{ width: "1px" }}
            >
              <div
                className="w-px bg-[repeating-linear-gradient(#e4e4e7_0_4px,#fff_4px_8px)] dark:bg-[repeating-linear-gradient(#1d1e22_0_4px,#121316_4px_8px)]"
                style={{
                  flex: "1.96368 1 0%",
                }}
              ></div>
              <div
                className="w-px bg-[#e4e4e7] dark:bg-[#27272a]"
                style={{
                  flex: "3.34049 1 0%",
                }}
              ></div>
            </div>
          </div>
        </span>
      </span>
    </div>
  );
}
