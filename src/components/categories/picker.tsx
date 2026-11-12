import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import type { Category } from "@/data/types";
import { colors, radius, spacing } from "@/theme/app-theme";

type CategoryPickerProps = {
  categories: Category[];
  selectedCategoryId: string;
  visible: boolean;
  onClose: () => void;
  onSelect: (categoryId: string) => void;
};

export function CategoryPicker({
  categories,
  selectedCategoryId,
  visible,
  onClose,
  onSelect,
}: CategoryPickerProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Odaberi kategoriju</Text>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              style={styles.option}
              onPress={() => onSelect(category.id)}
            >
              <Text style={styles.optionText}>{category.name}</Text>
              {category.id === selectedCategoryId ? <Text style={styles.check}>✓</Text> : null}
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "#0007" },
  sheet: {
    padding: spacing.lg,
    paddingBottom: 40,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: spacing.md,
  },
  option: {
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: { color: colors.text, fontSize: 16 },
  check: { color: colors.accent, fontSize: 20, fontWeight: "900" },
});
