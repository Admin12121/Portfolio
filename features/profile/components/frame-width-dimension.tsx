import { cn } from "@/lib/utils"
import {
  Dimension,
  DimensionExtensionLine,
  DimensionLine,
} from "@/components/dimension"

function FrameWidthDimension({ className }: { className?: string }) {
  return (
    <div
      data-draft-edges="left right"
      className={cn(
        "relative blackout h-8 border-x border-edge min-[49rem]:block",
        className
      )}
    >
      <Dimension className="absolute -inset-x-px inset-y-0">
        <DimensionExtensionLine className="inset-y-1 left-0" />
        <DimensionExtensionLine className="inset-y-1 right-0" />
        <DimensionLine className="absolute inset-x-0 top-1/2 -translate-y-1/2">
          1152
        </DimensionLine>
      </Dimension>
    </div>
  )
}

export { FrameWidthDimension }
