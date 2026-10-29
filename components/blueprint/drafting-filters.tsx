/**
 * One SVG graphite source for the full portfolio, preloader and UI guide lines.
 * Mount once at the app shell; CSS applies filters to strokes only, never text.
 */
export function DraftingFilters() {
  return (
    <svg aria-hidden="true" focusable="false" className="drafting-filter-defs" width="0" height="0">
      <defs>
        <filter id="draft-graphite-fine" x="-3%" y="-3%" width="106%" height="106%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.7 0.7" numOctaves="2" seed="7" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="wavered" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.4 0.15" result="wear" />
          <feComposite in="wavered" in2="wear" operator="in" />
        </filter>
        <filter id="draft-graphite-strong" x="-3%" y="-3%" width="106%" height="106%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.55 0.55" numOctaves="2" seed="7" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="wavered" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.8 0.05" result="wear" />
          <feComposite in="wavered" in2="wear" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}
