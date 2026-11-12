import { CategoryHeader } from "@/components/categories/header";
import { RecipeCard } from "@/components/recipes/card";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui";
import { useAuth } from "@/contexts/auth-context";
import { recipeRepository } from "@/data/recipe-repository";
import type { Category, Recipe } from "@/data/types";
import { firebaseErrorMessage } from "@/lib/firebase-errors";
import { colors, spacing } from "@/theme/app-theme";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const [category, setCategory] = useState<Category>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");

  const loadCategory = useCallback(async () => {
    setLoadError("");
    const [categoryResult, recipesResult] = await Promise.allSettled([
      recipeRepository.getCategory(id),
      recipeRepository.getRecipes(id),
    ]);

    if (categoryResult.status === "fulfilled") {
      setCategory(categoryResult.value);
    }

    if (recipesResult.status === "fulfilled") {
      setRecipes(recipesResult.value);
    }

    if (recipesResult.status === "rejected") {
      setLoadError(firebaseErrorMessage(recipesResult.reason));
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void loadCategory();
    }, [loadCategory]),
  );

  const handleAddRecipePress = () => {
    if (user) {
      router.push({
        pathname: "/recipe/new",
        params: { categoryId: id },
      });
      return;
    }

    router.push("/auth/login");
  };

  const handleRetryPress = () => {
    void loadCategory();
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    void loadCategory();
  };

  const handleRecipePress = (recipeId: string) => {
    router.push({ pathname: "/recipe/[id]", params: { id: recipeId } });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (loadError) {
    return (
      <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
        <ErrorState title="Recepti nisu učitani" message={loadError} onRetry={handleRetryPress} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            tintColor={colors.accent}
            onRefresh={handleRefresh}
          />
        }
        ListHeaderComponent={
          <CategoryHeader
            category={category}
            isAuthenticated={Boolean(user)}
            onAddRecipePress={handleAddRecipePress}
          />
        }
        ListEmptyComponent={
          <EmptyState title="Još nema recepata" message="U ovoj kategoriji još nema recepata." />
        }
        renderItem={({ item }) => <RecipeCard recipe={item} onPress={handleRecipePress} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
});
