import type { Metadata } from "next";
import { Suspense } from "react";

import { WriteupList } from "@/features/ctf-writeups/components/post-list";
import { WriteupListWithSearch } from "@/features/ctf-writeups/components/post-list-with-search";
import { WriteupSearchInput } from "@/features/ctf-writeups/components/post-search-input";
import { getAllWriteups } from "@/features/ctf-writeups/data";
import { Separator } from "@/components/separator";
import Image from "next/image";

import {
  Panel,
  PanelHeader,
  PanelTitle,
} from "@/features/profile/components/panel";

export const metadata: Metadata = {
  title: "CTF Writeups",
  description: "A collection of CTF writeups, notes, and exploit walkthroughs.",
};

export default function Page() {
  const allWriteups = getAllWriteups();

  return (
    <main className="container-wrapper max-w-screen!">
      <div className="relative mx-auto px-0! container md:fixed:max-w-6xl">
        <Separator />

        <Panel id="writeups" className="min-h-[calc(100dvh-192px)]">
          <PanelHeader>
            <PanelTitle>CTF Writeups</PanelTitle>
          </PanelHeader>
          <div className=" border-b p-2">
            <Suspense
              fallback={
                <div className="flex h-9 w-full rounded-lg border border-input shadow-xs dark:bg-input/30" />
              }
            >
              <WriteupSearchInput />
            </Suspense>
          </div>

          <Suspense fallback={<WriteupList writeups={allWriteups} />}>
            <WriteupListWithSearch writeups={allWriteups} />
          </Suspense>

          <div className="h-4" />
        </Panel>
      </div>
    </main>
  );
}
