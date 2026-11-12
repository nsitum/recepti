import { useAuth } from "@/contexts/auth-context";
import { colors, radius, spacing } from "@/theme/app-theme";
import { router } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

export function AuthLinks() {
  const { user, role, isLoading, logout } = useAuth();

  const handleLoginPress = () => {
    router.push("/auth/login");
  };

  const handleRegisterPress = () => {
    router.push("/auth/register");
  };

  if (isLoading) {
    return <ActivityIndicator size="small" color={colors.accent} />;
  }

  if (user) {
    return (
      <View style={styles.links}>
        <Text numberOfLines={1} style={styles.muted}>
          {role === "admin" ? "Administrator" : user.email}
        </Text>
        <Pressable onPress={logout}>
          <Text style={styles.link}>Odjava</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.links}>
      <Pressable onPress={handleLoginPress}>
        <Text style={styles.link}>Prijava</Text>
      </Pressable>
      <Pressable onPress={handleRegisterPress}>
        <Text style={styles.register}>Registracija</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  links: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  muted: { color: colors.textMuted, textAlign: "center", lineHeight: 20 },
  link: { color: colors.accent, fontWeight: "800" },
  register: {
    color: "#fff",
    fontWeight: "800",
    backgroundColor: colors.accent,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
});
