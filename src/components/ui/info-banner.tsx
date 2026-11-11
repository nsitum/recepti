import { colors, radius, spacing } from "@/theme/app-theme";
import { StyleSheet, Text, View } from "react-native";

type InfoBannerProps = { children: string; title?: string };

export function InfoBanner({
  children,
  title = "Važna napomena",
}: InfoBannerProps) {
  return (
    <View style={styles.banner}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: "#FFF0DC",
    gap: spacing.xs,
  },
  title: { color: colors.text, fontWeight: "900" },
  message: { color: colors.textMuted, textAlign: "center", lineHeight: 20 },
});
