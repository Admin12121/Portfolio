// import { blog } from '@/.source';
// import { createMDXSource } from 'fumadocs-mdx/runtime/next';
// import { loader } from 'fumadocs-core/source';
// import { type InferMetaType, type InferPageType } from 'fumadocs-core/source';

// export const source = loader(createMDXSource(blog), {
//   baseUrl: '/blog',
// });

// export type Page = InferPageType<typeof source>;
// export type Meta = InferMetaType<typeof source>;

import {
  type InferMetaType,
  type InferPageType,
  type LoaderPlugin,
  loader,
  multiple,
} from 'fumadocs-core/source';
import { blog as blogPages, docs } from '@/.source/server';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';

export const source = loader(
  multiple({
    docs: docs.toFumadocsSource(),
  }),
  {
    baseUrl: '/docs',
    plugins: [ lucideIconsPlugin()],
  },
);

export const blog = loader(toFumadocsSource(blogPages, []), {
  baseUrl: '/blog',
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
