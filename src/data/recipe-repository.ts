import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, where, type DocumentData } from 'firebase/firestore';
import { requireFirebase } from '@/lib/firebase';
import type { Category, Recipe } from './types';

export type NewRecipe = Pick<Recipe, 'categoryId' | 'title' | 'description' | 'imageUrl'>;
export interface RecipeRepository {
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  getRecipes(categoryId: string): Promise<Recipe[]>;
  getRecipe(id: string): Promise<Recipe | undefined>;
  createRecipe(input: NewRecipe, authorId: string, authorEmail: string): Promise<string>;
}

const categoryFromDoc = (id: string, data: DocumentData): Category => ({ id, name: String(data.name ?? ''), emoji: String(data.emoji ?? '🍽️'), description: String(data.description ?? '') });
const recipeFromDoc = (id: string, data: DocumentData): Recipe => ({ id, categoryId: String(data.categoryId ?? ''), title: String(data.title ?? ''), description: String(data.description ?? ''), imageUrl: String(data.imageUrl ?? ''), authorId: String(data.authorId ?? ''), authorEmail: String(data.authorEmail ?? 'Nepoznati autor'), createdAt: data.createdAt, updatedAt: data.updatedAt });

export const recipeRepository: RecipeRepository = {
  async getCategories() {
    const { db } = requireFirebase(); const snapshot = await getDocs(query(collection(db, 'categories'), orderBy('name')));
    return snapshot.docs.map((item) => categoryFromDoc(item.id, item.data()));
  },
  async getCategory(id) {
    const { db } = requireFirebase(); const snapshot = await getDoc(doc(db, 'categories', id));
    return snapshot.exists() ? categoryFromDoc(snapshot.id, snapshot.data()) : undefined;
  },
  async getRecipes(categoryId) {
    const { db } = requireFirebase(); const snapshot = await getDocs(query(collection(db, 'recipes'), where('categoryId', '==', categoryId), orderBy('createdAt', 'desc')));
    return snapshot.docs.map((item) => recipeFromDoc(item.id, item.data()));
  },
  async getRecipe(id) {
    const { db } = requireFirebase(); const snapshot = await getDoc(doc(db, 'recipes', id));
    return snapshot.exists() ? recipeFromDoc(snapshot.id, snapshot.data()) : undefined;
  },
  async createRecipe(input, authorId, authorEmail) {
    const { db } = requireFirebase(); const result = await addDoc(collection(db, 'recipes'), { ...input, authorId, authorEmail, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return result.id;
  },
};
