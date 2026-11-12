import { Pressable, StyleSheet, Text } from "react-native";
import type { Category } from "@/data/types";
import { colors, radius, spacing } from "@/theme/app-theme";

type CategoryCardProps = {
  category: Category;
  onPress: () => void;
};

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <Text style={styles.emoji}>{category.emoji}</Text>
      <Text style={styles.title}>{category.name}</Text>
      <Text numberOfLines={2} style={styles.description}>
        {category.description}
      </Text>
      <Text style={styles.arrow}>Pogledaj →</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  title: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: "900",
  },
  description: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  arrow: { color: colors.accent, fontWeight: "800", fontSize: 12 },
});
