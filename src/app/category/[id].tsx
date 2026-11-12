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
  const [items, setItems] = useState<Recipe[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    const [categoryResult, recipesResult] = await Promise.allSettled([
      recipeRepository.getCategory(id),
      recipeRepository.getRecipes(id),
    ]);

    if (categoryResult.status === "fulfilled") {
      setCategory(categoryResult.value);
    }

    if (recipesResult.status === "fulfilled") {
      setItems(recipesResult.value);
    }

    if (recipesResult.status === "rejected") {
      setError(firebaseErrorMessage(recipesResult.reason));
    }

    setLoading(false);
    setRefreshing(false);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
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
    void load();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    void load();
  };

  const handleRecipePress = (recipeId: string) => {
    router.push({ pathname: "/recipe/[id]", params: { id: recipeId } });
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
        <ErrorState
          title="Recepti nisu učitani"
          message={error}
          onRetry={handleRetryPress}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
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
          <EmptyState
            title="Još nema recepata"
            message="U ovoj kategoriji još nema recepata."
          />
        }
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() => handleRecipePress(item.id)}
          />
        )}
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
