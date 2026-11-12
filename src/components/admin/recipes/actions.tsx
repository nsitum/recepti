import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/ui";
import { colors, spacing } from "@/theme/app-theme";

type AdminRecipeActionsProps = {
  isBusy: boolean;
  onEditPress: () => void;
  onDeletePress: () => void;
};

export function AdminRecipeActions({
  isBusy,
  onEditPress,
  onDeletePress,
}: AdminRecipeActionsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administratorske akcije</Text>
      <PrimaryButton
        title="Uredi recept"
        variant="outline"
        disabled={isBusy}
        onPress={onEditPress}
      />
      <PrimaryButton title="Obriši recept" variant="danger" busy={isBusy} onPress={onDeletePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  title: { color: colors.text, fontSize: 19, fontWeight: "900" },
});
