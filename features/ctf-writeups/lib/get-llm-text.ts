import dayjs from "dayjs";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";

import type { Writeup } from "@/features/ctf-writeups/types/writeup";
import remarkComponent from "@/lib/remark-component";

const processor = remark().use(remarkMdx).use(remarkComponent).use(remarkGfm);

export async function getLLMText(writeup: Writeup) {
  const processed = await processor.process({
    value: writeup.content,
  });

  return `# ${writeup.metadata.title}

${writeup.metadata.description}

${processed.value}

Last updated on ${dayjs(writeup.metadata.updatedAt).format("MMMM D, YYYY")}`;
}