import {
  type InferMetaType,
  type InferPageType,
  loader,
} from "fumadocs-core/source";
import { blog as blogPages, ctfWriteups as ctfWriteupsPages } from "@/.source/server";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";

export const blog = loader(toFumadocsSource(blogPages, []), {
  baseUrl: "/blog",
});

export const ctfWriteups = loader(toFumadocsSource(ctfWriteupsPages, []), {
  baseUrl: "/ctf-writeups",
});

export type Page = InferPageType<typeof blog>;
export type Meta = InferMetaType<typeof blog>;
