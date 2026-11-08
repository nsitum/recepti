import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AuthLinks,
  EmptyState,
  LoadingState,
  PrimaryButton,
} from "@/components/app-ui";
import { mockRecipeRepository } from "@/data/recipe-repository";
import type { Category } from "@/data/types";
import { colors, radius, spacing } from "@/theme/app-theme";
import { useAuth } from "@/contexts/auth-context";

export default function HomeScreen() {
  const { role } = useAuth();
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const load = async () => {
    setError("");
    try {
      setItems(await mockRecipeRepository.getCategories());
    } catch {
      setError("Kategorije trenutno nije moguće učitati.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    void mockRecipeRepository
      .getCategories()
      .then(setItems)
      .catch(() => setError("Kategorije trenutno nije moguće učitati."))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <LoadingState />;
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
          <View style={styles.header}>
            <View style={styles.top}>
              <View>
                <Text style={styles.eyebrow}>DOMAĆA KUHINJA</Text>
                <Text style={styles.brand}>Recepti</Text>
              </View>
              <AuthLinks />
            </View>
            <Text style={styles.hero}>Što danas kuhamo?</Text>
            <Text style={styles.subtitle}>
              Odaberi kategoriju i pronađi ideju za svoj sljedeći obrok.
            </Text>
            {error ? (
              <Pressable style={styles.error} onPress={load}>
                <Text style={styles.errorText}>
                  {error} Dodirni za ponovni pokušaj.
                </Text>
              </Pressable>
            ) : null}
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Kategorije</Text>
              {role === "admin" ? (
                <Pressable onPress={() => router.push("/admin/categories")}>
                  <Text style={styles.admin}>Administracija</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
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
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>Imaš recept za podijeliti?</Text>
            <Text style={styles.subtitle}>
              Obrazac možeš pregledati već sada. Spremanje će se povezati u 3.
              fazi.
            </Text>
            <PrimaryButton
              title="Otvori obrazac"
              onPress={() => router.push("/recipe/new")}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
  header: { gap: spacing.md, marginBottom: spacing.sm },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "900",
  },
  brand: { color: colors.text, fontSize: 28, fontWeight: "900" },
  hero: {
    marginTop: spacing.lg,
    color: colors.text,
    fontSize: 34,
    lineHeight: 39,
    fontWeight: "900",
  },
  subtitle: { color: colors.textMuted, fontSize: 16, lineHeight: 22 },
  sectionRow: {
    marginTop: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { color: colors.text, fontSize: 21, fontWeight: "900" },
  admin: { color: colors.accent, fontWeight: "800" },
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
  footer: {
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    gap: spacing.md,
  },
  footerTitle: { color: colors.text, fontSize: 20, fontWeight: "900" },
  error: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: "#FDE7E5",
  },
  errorText: { color: colors.danger, fontWeight: "700" },
});
