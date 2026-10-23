import { ChevronDownIcon } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleAnimatedContent,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleWithContext,
} from "@/components/ui/collapsible";


export function CollapsibleList<T>({
  items,
  max = 3,
  animated = false,

  keyExtractor,
  renderItem,
}: {
  items: T[];
  max?: number;
  animated?: boolean;

  keyExtractor?: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
}) {
  const Root = animated ? CollapsibleWithContext : Collapsible;
  const Content = animated ? CollapsibleAnimatedContent : CollapsibleContent;

  return (
    <Root>
      {items.slice(0, max).map((award, index) => (
        <Slot
          key={typeof keyExtractor === "function" ? keyExtractor(award) : index}
          className="border-b border-edge"
          data-draft-edges="bottom"
        >
          {renderItem(award)}
        </Slot>
      ))}

      <Content>
        {items.slice(max).map((award, index) => (
          <Slot
            key={
              typeof keyExtractor === "function"
                ? keyExtractor(award)
                : max + index
            }
            className="border-b border-edge"
          data-draft-edges="bottom"
          >
            {renderItem(award)}
          </Slot>
        ))}
      </Content>

      {items.length > max && (
        <div className="flex h-12 items-center justify-center pb-px">
          <CollapsibleTrigger asChild>
            <Button
              className="group/collapsible-trigger flex"
              variant="default"
            >
              <span className="hidden group-data-[state=closed]/collapsible-trigger:block">
                Show More
              </span>

              <span className="hidden group-data-[state=open]/collapsible-trigger:block">
                Show Less
              </span>

              <ChevronDownIcon
                className="group-data-[state=open]/collapsible-trigger:rotate-180"
                aria-hidden
              />
            </Button>
          </CollapsibleTrigger>
        </div>
      )}
    </Root>
  );
}
