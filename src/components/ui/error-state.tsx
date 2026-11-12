import { StyleSheet, View } from "react-native";
import { spacing } from "@/theme/app-theme";
import { EmptyState } from "./empty-state";
import { PrimaryButton } from "./primary-button";

type ErrorStateProps = {
  title: string;
  message: string;
  onRetry: () => void;
  retryTitle?: string;
};

export function ErrorState({
  title,
  message,
  onRetry,
  retryTitle = "Pokušaj ponovno",
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <EmptyState title={title} message={message} />
      <PrimaryButton title={retryTitle} variant="outline" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, gap: spacing.md },
});
