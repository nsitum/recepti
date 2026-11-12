import { CategoryCard } from "@/components/categories/card";
import { HomeFooter } from "@/components/home/footer";
import { HomeHeader } from "@/components/home/header";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui";
import { useAuth } from "@/contexts/auth-context";
import { recipeRepository } from "@/data/recipe-repository";
import type { Category } from "@/data/types";
import { colors, spacing } from "@/theme/app-theme";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { role, user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [loadError, setLoadError] = useState("");

  const loadCategories = async () => {
    setLoadError("");

    try {
      const loadedCategories = await recipeRepository.getCategories();
      setCategories(loadedCategories);
    } catch {
      setLoadError("Kategorije trenutno nije moguće učitati.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void recipeRepository
      .getCategories()
      .then(setCategories)
      .catch(() => setLoadError("Kategorije trenutno nije moguće učitati."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    void loadCategories();
  };

  const handleRetryPress = () => {
    void loadCategories();
  };

  const handleOpenAdminPress = () => {
    router.push("/admin/categories");
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push({ pathname: "/category/[id]", params: { id: categoryId } });
  };

  const handleFooterPress = () => {
    if (user) {
      router.push("/recipe/new");
      return;
    }

    router.push("/auth/login");
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (loadError) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ErrorState
          title="Kategorije nisu učitane"
          message={loadError}
          onRetry={handleRetryPress}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            tintColor={colors.accent}
            onRefresh={handleRefresh}
          />
        }
        ListHeaderComponent={
          <HomeHeader isAdmin={role === "admin"} onOpenAdmin={handleOpenAdminPress} />
        }
        ListEmptyComponent={
          <EmptyState title="Nema kategorija" message="Trenutačno nema dostupnih kategorija." />
        }
        renderItem={({ item }) => <CategoryCard category={item} onPress={handleCategoryPress} />}
        ListFooterComponent={
          <HomeFooter isAuthenticated={Boolean(user)} onPress={handleFooterPress} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
  columns: { gap: spacing.md },
});
