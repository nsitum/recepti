import { CategoriesFooter } from "@/components/categories/footer";
import { CategoriesHeader } from "@/components/categories/header";
import { EmptyState, LoadingState } from "@/components/ui/app-ui";
import { useAuth } from "@/contexts/auth-context";
import { recipeRepository } from "@/data/recipe-repository";
import type { Category } from "@/data/types";
import { colors, radius, spacing } from "@/theme/app-theme";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
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
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            onPress={() =>
              router.push({
                pathname: "/category/[id]",
                params: { id: item.id },
              })
            }
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text numberOfLines={2} style={styles.cardDescription}>
              {item.description}
            </Text>
            <Text style={styles.arrow}>Pogledaj →</Text>
          </Pressable>
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
  card: {
    flex: 1,
    minHeight: 200,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  emoji: { fontSize: 34 },
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: "900",
  },
  cardDescription: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  arrow: { color: colors.accent, fontWeight: "800", fontSize: 12 },
});
