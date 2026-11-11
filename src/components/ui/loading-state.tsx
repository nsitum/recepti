import { colors, spacing } from "@/theme/app-theme";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export function LoadingState() {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={styles.text}>Učitavanje…</Text>
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
  text: { color: colors.textMuted, textAlign: "center", lineHeight: 20 },
});
