import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, where, writeBatch, type DocumentData } from 'firebase/firestore';
import { requireFirebase } from '@/lib/firebase';
import type { Category, Recipe } from './types';

export type NewRecipe = Pick<Recipe, 'categoryId' | 'title' | 'description' | 'imageUrl'>;
export type NewCategory = Pick<Category, 'name' | 'emoji' | 'description'>;
const MAX_BATCH_WRITES = 500;
export interface RecipeRepository {
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  getRecipes(categoryId: string): Promise<Recipe[]>;
  getRecipe(id: string): Promise<Recipe | undefined>;
  createRecipe(input: NewRecipe, authorId: string, authorEmail: string): Promise<string>;
  updateRecipe(id: string, input: NewRecipe): Promise<void>;
  deleteRecipe(id: string): Promise<void>;
  createCategory(input: NewCategory): Promise<string>;
  deleteCategory(id: string): Promise<void>;
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
  async updateRecipe(id, input) {
    const { db } = requireFirebase();
    const batch = writeBatch(db);
    batch.update(doc(db, 'recipes', id), { ...input, updatedAt: serverTimestamp() });
    await batch.commit();
  },
  async deleteRecipe(id) {
    const { db } = requireFirebase();
    const ratings = await getDocs(query(collection(db, 'ratings'), where('recipeId', '==', id)));
    if (ratings.size + 1 > MAX_BATCH_WRITES) throw new Error('Recept ima previše ocjena za sigurno brisanje u mobilnoj aplikaciji.');
    const batch = writeBatch(db);
    ratings.docs.forEach((rating) => batch.delete(rating.ref));
    batch.delete(doc(db, 'recipes', id));
    await batch.commit();
  },
  async createCategory(input) {
    const { db } = requireFirebase();
    const result = await addDoc(collection(db, 'categories'), { ...input, createdAt: serverTimestamp() });
    return result.id;
  },
  async deleteCategory(id) {
    const { db } = requireFirebase();
    const recipes = await getDocs(query(collection(db, 'recipes'), where('categoryId', '==', id)));
    const ratingSnapshots = await Promise.all(recipes.docs.map((recipe) => getDocs(query(collection(db, 'ratings'), where('recipeId', '==', recipe.id)))));
    const writeCount = 1 + recipes.size + ratingSnapshots.reduce((sum, ratings) => sum + ratings.size, 0);
    if (writeCount > MAX_BATCH_WRITES) throw new Error('Kategorija sadrži previše podataka za sigurno brisanje u mobilnoj aplikaciji.');
    const batch = writeBatch(db);
    ratingSnapshots.forEach((ratings) => ratings.docs.forEach((rating) => batch.delete(rating.ref)));
    recipes.docs.forEach((recipe) => batch.delete(recipe.ref));
    batch.delete(doc(db, 'categories', id));
    await batch.commit();
  },
};
