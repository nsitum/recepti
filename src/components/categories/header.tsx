import { StyleSheet, Text, View } from "react-native";
import { AuthLinks, PrimaryButton } from "@/components/ui";
import type { Category } from "@/data/types";
import { colors, spacing } from "@/theme/app-theme";

type CategoryHeaderProps = {
  category?: Category;
  isAuthenticated: boolean;
  onAddRecipePress: () => void;
};

export function CategoryHeader({
  category,
  isAuthenticated,
  onAddRecipePress,
}: CategoryHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.auth}>
        <AuthLinks />
      </View>
      <Text style={styles.kicker}>KATEGORIJA</Text>
      <Text style={styles.title}>
        {category?.name ?? "Nepoznata kategorija"}
      </Text>
      <Text style={styles.subtitle}>{category?.description}</Text>
      <PrimaryButton
        title={
          isAuthenticated
            ? "Dodaj recept u ovu kategoriju"
            : "Prijavi se za dodavanje recepta"
        }
        onPress={onAddRecipePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.md, marginBottom: spacing.sm },
  auth: { alignItems: "flex-end" },
  kicker: {
    color: colors.accent,
    letterSpacing: 1.8,
    fontSize: 11,
    fontWeight: "900",
  },
  title: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
  },
  subtitle: { color: colors.textMuted, fontSize: 16 },
});
