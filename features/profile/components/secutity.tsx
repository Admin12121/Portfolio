"use client";

import securityPaths from "../data/security-paths.json";

// Fill the enclosed cavity that formed the cloned Zed mark inside the shield.
const shieldFillRanges = [
  { y: 226, ranges: [[290, 464]] },
  { y: 232, ranges: [[290, 464]] },
  { y: 238, ranges: [[284, 290], [452, 464]] },
  { y: 244, ranges: [[284, 290], [446, 458]] },
  { y: 250, ranges: [[284, 290], [440, 452]] },
  { y: 256, ranges: [[284, 290], [320, 446]] },
  { y: 262, ranges: [[284, 290], [320, 440], [470, 470]] },
  { y: 268, ranges: [[284, 290], [320, 326], [422, 434], [464, 470]] },
  { y: 274, ranges: [[284, 290], [320, 326], [416, 422], [464, 470]] },
  { y: 280, ranges: [[284, 290], [320, 326], [410, 422], [464, 470]] },
  { y: 286, ranges: [[284, 290], [320, 326], [356, 416], [464, 470]] },
  { y: 292, ranges: [[284, 290], [320, 326], [350, 410], [434, 440], [464, 470]] },
  { y: 298, ranges: [[284, 290], [320, 326], [350, 356], [386, 398], [434, 440], [464, 470]] },
  { y: 304, ranges: [[284, 290], [320, 326], [350, 356], [386, 398], [434, 440], [464, 470]] },
  { y: 310, ranges: [[284, 290], [320, 326], [380, 392], [434, 440], [464, 470]] },
  { y: 316, ranges: [[284, 290], [320, 326], [374, 386], [434, 440], [464, 470]] },
  { y: 322, ranges: [[284, 290], [320, 326], [368, 380], [398, 404], [434, 440], [464, 470]] },
  { y: 328, ranges: [[284, 290], [320, 326], [362, 368], [398, 404], [434, 440], [464, 470]] },
  { y: 334, ranges: [[284, 290], [320, 326], [356, 404], [434, 440], [464, 470]] },
  { y: 340, ranges: [[284, 290], [350, 404], [434, 440], [464, 470]] },
  { y: 346, ranges: [[284, 290], [344, 356], [434, 440], [464, 470]] },
  { y: 352, ranges: [[284, 290], [338, 344], [434, 440], [464, 470]] },
  { y: 358, ranges: [[284, 290], [332, 344], [434, 440], [464, 470]] },
  { y: 364, ranges: [[284, 290], [326, 338], [434, 440], [464, 470]] },
  { y: 370, ranges: [[320, 440], [464, 470]] },
  { y: 376, ranges: [[314, 434], [464, 470]] },
  { y: 382, ranges: [[308, 320], [464, 470]] },
  { y: 388, ranges: [[302, 314], [464, 470]] },
  { y: 394, ranges: [[296, 308], [464, 470]] },
  { y: 400, ranges: [[290, 470]] },
  { y: 406, ranges: [[290, 464]] },
] as const;

// Balance the remaining asymmetric interior dots so the logo trace disappears.
const shieldBalanceRanges = [
  { y: 226, ranges: [[290, 290]] },
  { y: 232, ranges: [[290, 290]] },
  { y: 238, ranges: [[290, 290], [452, 464]] },
  { y: 244, ranges: [[290, 290], [446, 458]] },
  { y: 250, ranges: [[290, 290], [440, 452]] },
  { y: 256, ranges: [[290, 290], [446, 446]] },
  { y: 268, ranges: [[320, 320], [422, 428], [464, 464]] },
  { y: 274, ranges: [[320, 326], [416, 422], [464, 464]] },
  { y: 280, ranges: [[320, 326], [410, 422], [464, 464]] },
  { y: 286, ranges: [[320, 326], [410, 416], [464, 464]] },
  { y: 292, ranges: [[464, 464]] },
  { y: 298, ranges: [[350, 356], [386, 398], [464, 464]] },
  { y: 304, ranges: [[350, 356], [386, 398], [464, 464]] },
  { y: 310, ranges: [[386, 392], [464, 464]] },
  { y: 316, ranges: [[464, 464]] },
  { y: 322, ranges: [[368, 374], [398, 404], [464, 464]] },
  { y: 328, ranges: [[368, 368], [404, 404], [464, 464]] },
  { y: 334, ranges: [[464, 464]] },
  { y: 340, ranges: [[350, 350], [434, 440], [464, 464]] },
  { y: 346, ranges: [[344, 356], [434, 440], [464, 464]] },
  { y: 352, ranges: [[338, 344], [434, 440], [464, 464]] },
  { y: 358, ranges: [[332, 344], [434, 440], [464, 464]] },
  { y: 364, ranges: [[332, 338], [440, 440], [464, 464]] },
  { y: 370, ranges: [[464, 470]] },
  { y: 376, ranges: [[314, 320], [464, 470]] },
  { y: 382, ranges: [[308, 320], [464, 470]] },
  { y: 388, ranges: [[302, 314], [464, 470]] },
  { y: 394, ranges: [[302, 308], [470, 470]] },
  { y: 406, ranges: [[290, 290]] },
] as const;

function createDotPath(x: number, y: number) {
  return `M${x} ${y}C${x + 1.10457} ${y} ${x + 2} ${y - 0.89543} ${x + 2} ${y - 2}C${x + 2} ${y - 3.10457} ${x + 1.10457} ${y - 4} ${x} ${y - 4}C${x - 1.10457} ${y - 4} ${x - 2} ${y - 3.10457} ${x - 2} ${y - 2}C${x - 2} ${y - 0.89543} ${x - 1.10457} ${y} ${x} ${y}Z`;
}

function createRangePath(
  rows: readonly { y: number; ranges: readonly (readonly [number, number])[] }[],
) {
  return rows
    .map(({ y, ranges }) =>
      ranges
        .map(([start, end]) => {
          let rowPath = "";

          for (let x = start; x <= end; x += 6) {
            rowPath += createDotPath(x, y);
          }

          return rowPath;
        })
        .join(""),
    )
    .join("");
}

const shieldFillPath =
  createRangePath(shieldFillRanges) + createRangePath(shieldBalanceRanges);

export default function Security() {
  return (
    <div className="mt-4 relative w-full flex justify-center items-center z-99">
      <div
        className="size-[240px] lg:size-[300px] p-4 flex items-center justify-center"
        style={{ opacity: "1" }}
      >
        <svg
          data-blueprint-emblem=""
          viewBox="0 0 760 706"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-full text-blue-400/50  dark:text-blue-300/20"
        >
          <g clipPath="url(#clip0_4426_20413)">
            {securityPaths[0].map((d, index) => (
              <path key={index} d={d} fill="currentColor" />
            ))}
            <path d={shieldFillPath} fill="currentColor" />
          </g>
          <defs>
            <clipPath id="clip0_4426_20413">
              <rect width="760" height="706" fill="white"></rect>
            </clipPath>
          </defs>
        </svg>
      </div>
      <svg
        viewBox="0 0 760 706"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mask-b-from-20% mask-b-to-80% [z-index:-1] pointer-events-none select-none absolute -top-40 translate-x-1/2 right-1/2 scale-120 text-blue-100/80 dark:text-blue-900/12 hide lg:block"
      >
        <g clipPath="url(#clip0_4426_27020)">
          {securityPaths[1].map((d, index) => (
            <path key={index} d={d} fill="currentColor" />
          ))}
        </g>
        <defs>
          <clipPath id="clip0_4426_27020">
            <rect width="760" height="706" fill="white"></rect>
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
