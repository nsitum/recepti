import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AuthLinks, FoodImage } from "@/components/ui";
import type { RatingStats, Recipe } from "@/data/types";
import { colors, radius, spacing } from "@/theme/app-theme";

type RecipeDetailsProps = {
  recipe: Recipe;
  categoryName: string;
  ratingStats: RatingStats;
  ratingError: string;
  children: ReactNode;
};

export function RecipeDetails({
  recipe,
  categoryName,
  ratingStats,
  ratingError,
  children,
}: RecipeDetailsProps) {
  const averageText =
    ratingStats.count > 0 && ratingStats.average !== null
      ? `★ ${ratingStats.average.toFixed(1)}`
      : "Nema ocjena";

  return (
    <ScrollView style={styles.safe} contentContainerStyle={styles.content}>
      <FoodImage uri={recipe.imageUrl} style={styles.hero} />
      <View style={styles.body}>
        <View style={styles.auth}>
          <AuthLinks />
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{categoryName}</Text>
        </View>
        <Text style={styles.title}>{recipe.title}</Text>
        <View style={styles.rating}>
          <Text style={[styles.score, ratingStats.count > 0 && styles.scoreActive]}>
            {averageText}
          </Text>
          <Text style={styles.count}>
            {ratingStats.count} {ratingStats.count === 1 ? "korisnik" : "korisnika"}
          </Text>
        </View>
        {ratingError ? <Text style={styles.error}>{ratingError}</Text> : null}
        <Text style={styles.section}>Priprema</Text>
        <Text style={styles.description}>{recipe.description}</Text>
        <Text style={styles.author}>Autor: {recipe.authorEmail}</Text>
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xl },
  hero: { width: "100%", aspectRatio: 4 / 3 },
  body: { padding: spacing.md, gap: spacing.md },
  auth: { alignItems: "flex-end" },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  badgeText: { color: colors.accentDark, fontWeight: "800" },
  title: { color: colors.text, fontSize: 32, lineHeight: 38, fontWeight: "900" },
  rating: { flexDirection: "row", alignItems: "baseline", gap: spacing.sm },
  score: { color: colors.textMuted, fontSize: 18, fontWeight: "900" },
  scoreActive: { color: colors.star },
  count: { color: colors.textMuted },
  error: { color: colors.danger, fontSize: 13 },
  section: { color: colors.text, fontSize: 19, fontWeight: "900" },
  description: { color: colors.text, fontSize: 16, lineHeight: 25 },
  author: { color: colors.textMuted, fontSize: 13 },
});
