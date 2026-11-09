export type Category = { id: string; name: string; emoji: string; description: string };
export type Recipe = {
  id: string; categoryId: string; title: string; description: string; imageUrl: string;
  authorId: string; authorEmail: string; createdAt?: unknown; updatedAt?: unknown;
};
