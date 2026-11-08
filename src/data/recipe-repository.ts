import { categories, recipes } from './mock-data';
import type { Category, Recipe } from './types';

// Sučelje ostaje isto kada mock implementaciju u 2. fazi zamijeni Firestore.
export interface RecipeRepository {
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  getRecipes(categoryId: string): Promise<Recipe[]>;
  getRecipe(id: string): Promise<Recipe | undefined>;
}

const pause = () => new Promise((resolve) => setTimeout(resolve, 180));
export const mockRecipeRepository: RecipeRepository = {
  async getCategories() { await pause(); return categories; },
  async getCategory(id) { await pause(); return categories.find((item) => item.id === id); },
  async getRecipes(categoryId) { await pause(); return recipes.filter((item) => item.categoryId === categoryId); },
  async getRecipe(id) { await pause(); return recipes.find((item) => item.id === id); },
};
