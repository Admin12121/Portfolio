import {
  type InferMetaType,
  type InferPageType,
  loader,
} from "fumadocs-core/source";
import { blog as blogPages, writeups as writeupsPages } from "@/.source/server";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";

export const blog = loader(toFumadocsSource(blogPages, []), {
  baseUrl: "/blog",
});

export const writeups = loader(toFumadocsSource(writeupsPages, []), {
  baseUrl: "/writeups",
});

export type Page = InferPageType<typeof blog>;
export type Meta = InferMetaType<typeof blog>;
