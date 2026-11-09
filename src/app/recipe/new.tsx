import { useLocalSearchParams } from 'expo-router';
import { RecipeForm } from '@/components/recipe-form';
export default function NewRecipeScreen() { const { categoryId } = useLocalSearchParams<{ categoryId?: string }>(); return <RecipeForm initialCategoryId={categoryId} />; }
