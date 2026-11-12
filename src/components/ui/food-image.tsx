import { colors, spacing } from "@/theme/app-theme";
import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, Text, View, type ImageStyle, type StyleProp } from "react-native";

type FoodImageProps = { uri: string; style?: StyleProp<ImageStyle> };

export function FoodImage({ uri, style }: FoodImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <View style={[styles.fallback, style]}>
        <Text style={styles.emoji}>🍽️</Text>
        <Text style={styles.message}>Slika nije dostupna</Text>
      </View>
    );
  return (
    <Image
      source={{ uri }}
      contentFit="cover"
      transition={200}
      onError={() => setFailed(true)}
      style={[styles.image, style]}
    />
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: colors.surfaceMuted },
  fallback: {
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  emoji: { fontSize: 32 },
  message: { color: colors.textMuted, textAlign: "center", lineHeight: 20 },
});
