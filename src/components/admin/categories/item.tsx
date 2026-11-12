import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/ui";
import type { Category } from "@/data/types";
import { colors, radius, spacing } from "@/theme/app-theme";

type AdminCategoryItemProps = {
  category: Category;
  isDeleting: boolean;
  isDeleteDisabled: boolean;
  onDeletePress: (category: Category) => void;
};

export function AdminCategoryItem({
  category,
  isDeleting,
  isDeleteDisabled,
  onDeletePress,
}: AdminCategoryItemProps) {
  const handleDeletePress = () => {
    onDeletePress(category);
  };

  return (
    <View style={styles.row}>
      <View style={styles.nameRow}>
        <Text style={styles.emoji}>{category.emoji}</Text>
        <View style={styles.nameBlock}>
          <Text style={styles.name}>{category.name}</Text>
          {category.description ? (
            <Text numberOfLines={2} style={styles.description}>
              {category.description}
            </Text>
          ) : null}
        </View>
      </View>
      <PrimaryButton
        title="Obriši"
        variant="danger"
        busy={isDeleting}
        disabled={isDeleteDisabled}
        onPress={handleDeletePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 84,
    padding: spacing.sm,
    paddingLeft: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  nameRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  nameBlock: { flex: 1, gap: spacing.xs },
  emoji: { fontSize: 24 },
  name: { color: colors.text, fontWeight: "800" },
  description: { color: colors.textMuted, fontSize: 12, lineHeight: 17 },
});
