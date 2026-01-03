import {
  defineCollections,
  defineConfig,
  frontmatterSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod';
import {
  rehypeCodeDefaultOptions,
} from 'fumadocs-core/mdx-plugins';
import lastModified from 'fumadocs-mdx/plugins/last-modified';
import jsonSchema from 'fumadocs-mdx/plugins/json-schema';

export const blog = defineCollections({
  type: 'doc',
  dir: 'features/blog/content',
  schema: frontmatterSchema.extend({
    author: z.string(),
    date: z.string().or(z.date()),
  }),
  async: true,
});

export default defineConfig({
  plugins: [
    jsonSchema({
      insert: true,
    }),
    lastModified(),
  ],
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
      ],
    },
  },
});