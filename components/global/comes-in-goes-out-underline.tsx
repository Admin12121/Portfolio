"use client"

import { ElementType, useEffect, useRef, useState, useMemo, HTMLAttributes, ReactNode } from "react"
import cn from "clsx"
import {
  motion,
  useAnimationControls,
  type ValueAnimationTransition,
} from "motion/react"

interface ComesInGoesOutUnderlineProps extends HTMLAttributes<HTMLElement> {
  /**
   * The content to be displayed and animated
   */
  children: ReactNode

  /**
   * HTML Tag to render the component as
   * @default span
   */
  as?: ElementType

  /**
   * Direction of the animation
   * @default "left"
   */
  direction?: "left" | "right"

  /**
   * Optional class name for styling
   */
  className?: string

  /**
   * Height of the underline as a ratio of font size
   * @default 0.1
   */
  underlineHeightRatio?: number

  /**
   * Padding of the underline as a ratio of font size
   * @default 0.01
   */
  underlinePaddingRatio?: number

  /**
   * Animation transition configuration
   * @default { duration: 0.4, ease: "easeInOut" }
   */
  transition?: ValueAnimationTransition
  [key: string]: any
}

const ComesInGoesOutUnderline = ({
  children,
  as,
  direction = "left",
  className,
  underlineHeightRatio = 0.1,
  underlinePaddingRatio = 0.01,
  transition = {
    duration: 0.4,
    ease: "easeInOut",
  },
  ...props
}: ComesInGoesOutUnderlineProps) => {
  const controls = useAnimationControls()
  const textRef = useRef<HTMLSpanElement>(null)
  const MotionComponent = useMemo(() => motion.create(as ?? "span"), [as])

  useEffect(() => {
    const updateUnderlineStyles = () => {
      if (textRef.current) {
        const fontSize = parseFloat(getComputedStyle(textRef.current).fontSize)
        const underlineHeight = fontSize * underlineHeightRatio
        const underlinePadding = fontSize * underlinePaddingRatio
        textRef.current.style.setProperty(
          "--underline-height",
          `${underlineHeight}px`
        )
        textRef.current.style.setProperty(
          "--underline-padding",
          `${underlinePadding}px`
        )
      }
    }

    updateUnderlineStyles()
    window.addEventListener("resize", updateUnderlineStyles)

    return () => window.removeEventListener("resize", updateUnderlineStyles)
  }, [underlineHeightRatio, underlinePaddingRatio])

  // animate on hover enter/leave: expand on enter, collapse on leave
  const enter = async () => {
    await controls.start({
      width: "100%",
      transition,
      transitionEnd: {
        left: direction === "left" ? "auto" : 0,
        right: direction === "left" ? 0 : "auto",
      },
    })
  }

  const leave = async () => {
    await controls.start({
      width: 0,
      transition,
      transitionEnd: {
        left: direction === "left" ? 0 : "",
        right: direction === "left" ? "" : 0,
      },
    })
  }

  return (
    <MotionComponent
      className={cn("relative inline-block cursor-pointer", className)}
      onHoverStart={enter}
      onHoverEnd={leave}
      ref={textRef}
      {...props}
    >
      <span>{children}</span>
      <motion.span
        className={cn("absolute bg-current w-0", {
          "left-0": direction === "left",
          "right-0": direction === "right",
        })}
        style={{
          height: "var(--underline-height)",
          bottom: "calc(1 * var(--underline-padding))",
        }}
        initial={{ width: 0 }}
        animate={controls}
        aria-hidden="true"
      />
    </MotionComponent>
  )
}

ComesInGoesOutUnderline.displayName = "ComesInGoesOutUnderline"

export default ComesInGoesOutUnderline
