import { Pressable, StyleSheet, Text, View } from "react-native";
import { RATING_VALUES } from "@/constants";
import type { RatingValue } from "@/data/types";
import { colors, radius, spacing } from "@/theme/app-theme";

type RatingCardProps = {
  currentRating: RatingValue | null;
  isSaving: boolean;
  successMessage: string;
  onRatingPress: (rating: RatingValue) => void;
};

export function RatingCard({
  currentRating,
  isSaving,
  successMessage,
  onRatingPress,
}: RatingCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {currentRating ? `Tvoja ocjena: ${currentRating}` : "Ocijeni recept"}
      </Text>
      <View style={styles.stars}>
        {RATING_VALUES.map((rating) => (
          <Pressable
            key={rating}
            disabled={isSaving}
            accessibilityRole="button"
            accessibilityLabel={`Ocjena ${rating}`}
            onPress={() => onRatingPress(rating)}
          >
            <Text style={[styles.star, rating <= (currentRating ?? 0) && styles.starActive]}>
              ★
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.hint}>
        {isSaving ? "Spremanje ocjene…" : "Ocjenu možeš promijeniti u bilo kojem trenutku."}
      </Text>
      {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  title: { color: colors.text, fontSize: 19, fontWeight: "900" },
  stars: { flexDirection: "row", justifyContent: "space-between" },
  star: { color: colors.border, fontSize: 42 },
  starActive: { color: colors.star },
  hint: { color: colors.textMuted, fontSize: 12 },
  success: { color: "#237A55", fontWeight: "800" },
});
