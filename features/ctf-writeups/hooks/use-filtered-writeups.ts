import type { Writeup } from "@/features/ctf-writeups/types/writeup";
import { useSearchQuery } from "@/features/ctf-writeups/hooks/use-search-query";

const normalize = (text: string) => text.toLowerCase().replaceAll(" ", "");

const matchesQuery = (writeup: Writeup, normalizedQuery: string) => {
  const normalizedTitle = normalize(writeup.metadata.title);
  const normalizedDescription = normalize(writeup.metadata.description);

  return (
    normalizedTitle.includes(normalizedQuery) ||
    normalizedDescription.includes(normalizedQuery)
  );
};

const searchWriteups = (writeups: Writeup[], query: string | null) => {
  if (!query) return writeups;

  const normalizedQuery = normalize(query);
  return writeups.filter((writeup) => matchesQuery(writeup, normalizedQuery));
};

export function useFilteredWriteups(writeups: Writeup[]) {
  const { query } = useSearchQuery();
  return searchWriteups(writeups, query);
}