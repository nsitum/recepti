export type Category = { id: string; name: string; emoji: string; description: string };
export type Recipe = {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  imageUrl: string;
  authorId: string;
  authorEmail: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};
export type RatingValue = 1 | 2 | 3 | 4 | 5;
export type RatingStats = { average: number | null; count: number };
