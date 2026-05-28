import { notFound } from "next/navigation";

import { getAllWriteups } from "@/features/ctf-writeups/data";
import { getLLMText } from "@/features/ctf-writeups/lib/get-llm-text";

export async function generateStaticParams() {
  const writeups = getAllWriteups();

  return writeups.map((writeup) => ({
    slug: writeup.slug,
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const allWriteups = getAllWriteups();
  const writeup = allWriteups.find((item) => item.slug === slug);

  if (!writeup) {
    notFound();
  }

  return new Response(await getLLMText(writeup), {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}