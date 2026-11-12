import { RecipeForm } from "@/components/recipes/form";
import { EmptyState, LoadingState } from "@/components/ui";
import { recipeRepository } from "@/data/recipe-repository";
import type { Recipe } from "@/data/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [recipe, setRecipe] = useState<Recipe>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recipeRepository
      .getRecipe(id)
      .then(setRecipe)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <LoadingState />;
  }

  if (!recipe) {
    return (
      <EmptyState
        title="Recept nije pronađen"
        message="Uređivanje nije dostupno."
      />
    );
  }

  return <RecipeForm recipe={recipe} />;
}
