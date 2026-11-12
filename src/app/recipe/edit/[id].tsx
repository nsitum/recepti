import { RecipeForm } from "@/components/recipes/form";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui";
import { recipeRepository } from "@/data/recipe-repository";
import type { Recipe } from "@/data/types";
import { firebaseErrorMessage } from "@/lib/firebase-errors";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [recipe, setRecipe] = useState<Recipe>();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadRecipe = async () => {
    setLoadError("");
    setIsLoading(true);

    try {
      const loadedRecipe = await recipeRepository.getRecipe(id);
      setRecipe(loadedRecipe);
    } catch (reason) {
      setLoadError(firebaseErrorMessage(reason));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    recipeRepository
      .getRecipe(id)
      .then(setRecipe)
      .catch((reason) => setLoadError(firebaseErrorMessage(reason)))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleRetryPress = () => {
    void loadRecipe();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (loadError) {
    return <ErrorState title="Recept nije učitan" message={loadError} onRetry={handleRetryPress} />;
  }

  if (!recipe) {
    return <EmptyState title="Recept nije pronađen" message="Uređivanje nije dostupno." />;
  }

  return <RecipeForm recipe={recipe} />;
}
