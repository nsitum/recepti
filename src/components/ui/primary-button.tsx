import { colors, radius, spacing } from "@/theme/app-theme";
import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps } from "react-native";

type PrimaryButtonProps = PressableProps & {
  title: string;
  variant?: "primary" | "outline" | "danger";
  busy?: boolean;
};

export function PrimaryButton({
  title,
  variant = "primary",
  busy = false,
  ...props
}: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      disabled={busy || props.disabled}
      style={({ pressed }) => [
        styles.button,
        variant === "outline" && styles.outline,
        variant === "danger" && styles.danger,
        pressed && styles.pressed,
        (busy || props.disabled) && styles.disabled,
      ]}
    >
      {busy ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.text, variant === "outline" && styles.outlineText]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { color: "#fff", fontSize: 16, fontWeight: "800" },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.accent,
  },
  outlineText: { color: colors.accent },
  danger: { backgroundColor: colors.danger },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.45 },
});
