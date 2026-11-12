import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme/app-theme";
import { AuthLinks } from "@/components/ui";

type HomeHeaderProps = {
  error: string;
  isAdmin: boolean;
  onRetry: () => void;
  onOpenAdmin: () => void;
};

export function HomeHeader({
  error,
  isAdmin,
  onRetry,
  onOpenAdmin,
}: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.top}>
        <View>
          <Text style={styles.eyebrow}>DOMAĆA KUHINJA</Text>
          <Text style={styles.brand}>Recepti</Text>
        </View>
        <AuthLinks />
      </View>
      <Text style={styles.hero}>Što danas kuhamo?</Text>
      <Text style={styles.subtitle}>
        Odaberi kategoriju i pronađi ideju za svoj sljedeći obrok.
      </Text>
      {error ? (
        <Pressable style={styles.error} onPress={onRetry}>
          <Text style={styles.errorText}>
            {error} Dodirni za ponovni pokušaj.
          </Text>
        </Pressable>
      ) : null}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Kategorije</Text>
        {isAdmin ? (
          <Pressable onPress={onOpenAdmin}>
            <Text style={styles.admin}>Administracija</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.md, marginBottom: spacing.sm },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "900",
  },
  brand: { color: colors.text, fontSize: 28, fontWeight: "900" },
  hero: {
    marginTop: spacing.lg,
    color: colors.text,
    fontSize: 34,
    lineHeight: 39,
    fontWeight: "900",
  },
  subtitle: { color: colors.textMuted, fontSize: 16, lineHeight: 22 },
  sectionRow: {
    marginTop: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { color: colors.text, fontSize: 21, fontWeight: "900" },
  admin: { color: colors.accent, fontWeight: "800" },
  error: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: "#FDE7E5",
  },
  errorText: { color: colors.danger, fontWeight: "700" },
});
