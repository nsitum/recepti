import { colors, spacing } from "@/theme/app-theme";
import { StyleSheet, Text, View } from "react-native";

type EmptyStateProps = { title: string; message: string };

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.xl,
  },
  title: { color: colors.text, fontSize: 20, fontWeight: "900" },
  message: { color: colors.textMuted, textAlign: "center", lineHeight: 20 },
});
