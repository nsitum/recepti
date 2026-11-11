import { CategoriesFooter } from "@/components/categories/footer";
import { CategoriesHeader } from "@/components/categories/header";
import { EmptyState, LoadingState } from "@/components/ui/app-ui";
import { CategoryCard } from "@/components/categories/card";
import { useAuth } from "@/contexts/auth-context";
import { recipeRepository } from "@/data/recipe-repository";
import type { Category } from "@/data/types";
import { colors, spacing } from "@/theme/app-theme";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { role, user } = useAuth();
  const [items, setItems] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const categories = await recipeRepository.getCategories();
      setItems(categories);
    } catch {
      setError("Kategorije trenutno nije moguće učitati.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void recipeRepository
      .getCategories()
      .then(setItems)
      .catch(() => setError("Kategorije trenutno nije moguće učitati."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={colors.accent}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
        }
        ListHeaderComponent={
          <CategoriesHeader
            error={error}
            isAdmin={role === "admin"}
            onRetry={() => void load()}
            onOpenAdmin={() => router.push("/admin/categories")}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="Nema kategorija"
            message="Trenutačno nema dostupnih kategorija."
          />
        }
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            onPress={() =>
              router.push({
                pathname: "/category/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        ListFooterComponent={
          <CategoriesFooter
            isAuthenticated={Boolean(user)}
            onPress={() => router.push(user ? "/recipe/new" : "/auth/login")}
          />
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
