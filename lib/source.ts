import {
  type InferMetaType,
  type InferPageType,
  loader,
} from "fumadocs-core/source";
import { blog as blogPages } from "@/.source/server";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";

export const blog = loader(toFumadocsSource(blogPages, []), {
  baseUrl: "/blog",
});

export type Page = InferPageType<typeof blog>;
export type Meta = InferMetaType<typeof blog>;
