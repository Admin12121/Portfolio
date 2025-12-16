'use client';

import type { ComponentProps } from 'react';
import * as React from 'react';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { cn } from '@/lib/utils';
import Link from 'fumadocs-core/link';

const HoverCard = HoverCardPrimitive.Root;

type HoverCardTriggerProps = ComponentProps<typeof HoverCardPrimitive.Trigger> & {
  children?: React.ReactNode;
};

function HoverCardTrigger({ children, ...props }: HoverCardTriggerProps) {
  const { asChild, ...rest } = props;

  // If children are provided, use them directly as the trigger.
  // Otherwise, render a Link trigger (without forwarding asChild to the DOM).
  return (
    <HoverCardPrimitive.Trigger asChild>
      {children ? (
        children
      ) : (
        <Link {...rest} />
      )}
    </HoverCardPrimitive.Trigger>
  );
}

const HoverCardContent = React.forwardRef<
  React.ComponentRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.HoverCardPortal>
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-72 rounded-lg border bg-fd-popover p-4 text-popover-fd-foreground shadow-md outline-none data-[state=open]:animate-fd-popover-in data-[state=closed]:animate-fd-popover-out origin-[--radix-hover-card-content-transform-origin]',
        className,
      )}
      {...props}
    />
  </HoverCardPrimitive.HoverCardPortal>
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };