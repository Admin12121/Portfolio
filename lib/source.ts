import { blog } from '@/.source';
import { createMDXSource } from 'fumadocs-mdx/runtime/next';
import { loader } from 'fumadocs-core/source';
import { type InferMetaType, type InferPageType } from 'fumadocs-core/source';

export const source = loader(createMDXSource(blog), {
  baseUrl: '/blog',
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
