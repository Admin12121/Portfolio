export type WriteupMetadata = {
  title: string;
  description: string;
  image?: string;
  category?: string;
  icon?: string;
  new?: boolean;
  pinned?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Writeup = {
  metadata: WriteupMetadata;
  slug: string;
  content: string;
};