import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme/app-theme";
import { PrimaryButton } from "@/components/ui";

type CategoriesFooterProps = {
  isAuthenticated: boolean;
  onPress: () => void;
};

export function CategoriesFooter({
  isAuthenticated,
  onPress,
}: CategoriesFooterProps) {
  return (
    <View style={styles.footer}>
      <Text style={styles.title}>Imaš recept za podijeliti?</Text>
      <Text style={styles.subtitle}>
        {isAuthenticated
          ? "Dodaj svoj recept u zajedničku zbirku."
          : "Prijavi se kako bi mogao dodati recept."}
      </Text>
      <PrimaryButton
        title={isAuthenticated ? "Dodaj recept" : "Prijavi se"}
        onPress={onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    gap: spacing.md,
  },
  title: { color: colors.text, fontSize: 20, fontWeight: "900" },
  subtitle: { color: colors.textMuted, fontSize: 16, lineHeight: 22 },
});
