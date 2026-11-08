import { useLocalSearchParams } from 'expo-router';
import { DemoRecipeForm } from '@/components/demo-recipe-form';
export default function NewRecipeScreen() { const { categoryId } = useLocalSearchParams<{ categoryId?: string }>(); return <DemoRecipeForm initialCategoryId={categoryId} />; }
