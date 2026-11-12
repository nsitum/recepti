import { useLocalSearchParams } from "expo-router";
import { RecipeForm } from "@/components/recipes/form";

export default function NewRecipeScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();

  return <RecipeForm initialCategoryId={categoryId} />;
}
