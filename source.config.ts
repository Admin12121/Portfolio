import { defineConfig, defineDocs, defineCollections, frontmatterSchema } from "fumadocs-mdx/config";
import { z } from 'zod';

export const docs = defineDocs({
  dir: "content/blog",
  docs : {
    schema: frontmatterSchema.extend({
      author: z.string(),
      date: z.string().or(z.date()),
    }),
  }
});

export default defineConfig();

export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: frontmatterSchema.extend({
    author: z.string(),
    date: z.string().or(z.date()),
  }),
});
