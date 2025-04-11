/* eslint-disable @typescript-eslint/no-explicit-any */
export type PostType = {
  id: string;
  title: string;
  slug: string;
  date: string;
  description: string;
  excerpt?: string;
  content?: any;
  author: {
    name: string;
    image: string;
    bio: string;
  };
  coverImage: string;
  tags: string[];
  featured?: boolean;
  icon?: string | null;
};
