import { colors, radius, spacing } from "@/theme/app-theme";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

type FieldProps = TextInputProps & { label: string; error?: string };

export function Field({ label, error, ...props }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        {...props}
        style={[
          styles.input,
          props.multiline && styles.multiline,
          error && styles.inputError,
          props.style,
        ]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing.sm },
  label: { color: colors.text, fontWeight: "800" },
  input: {
    minHeight: 50,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
  },
  multiline: {
    minHeight: 140,
    paddingTop: spacing.md,
    textAlignVertical: "top",
  },
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: 13 },
});
