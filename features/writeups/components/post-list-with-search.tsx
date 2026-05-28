"use client";

import type { Writeup } from "@/features/writeups/types/writeup";
import { useFilteredWriteups } from "@/features/writeups/hooks/use-filtered-writeups";
import { WriteupList } from "./post-list";

export function WriteupListWithSearch({ writeups }: { writeups: Writeup[] }) {
  const filteredWriteups = useFilteredWriteups(writeups);
  return <WriteupList writeups={filteredWriteups} />;
}