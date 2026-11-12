import { StyleSheet, Text, View } from "react-native";
import { Field, InfoBanner, PrimaryButton } from "@/components/ui";
import { DEFAULT_CATEGORY_EMOJI } from "@/constants";
import { colors, spacing } from "@/theme/app-theme";

type AdminCategoriesHeaderProps = {
  categoryName: string;
  categoryEmoji: string;
  categoryDescription: string;
  categoryNameError?: string;
  categoryEmojiError?: string;
  isSaving: boolean;
  onCategoryNameChange: (value: string) => void;
  onCategoryEmojiChange: (value: string) => void;
  onCategoryDescriptionChange: (value: string) => void;
  onAddCategoryPress: () => void;
};

export function AdminCategoriesHeader({
  categoryName,
  categoryEmoji,
  categoryDescription,
  categoryNameError,
  categoryEmojiError,
  isSaving,
  onCategoryNameChange,
  onCategoryEmojiChange,
  onCategoryDescriptionChange,
  onAddCategoryPress,
}: AdminCategoriesHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Upravljanje kategorijama</Text>
      <InfoBanner title="Pažljivo s brisanjem">
        Brisanje kategorije trajno uklanja sve njezine recepte i njihove ocjene.
      </InfoBanner>
      <Field
        label="Naziv nove kategorije"
        value={categoryName}
        onChangeText={onCategoryNameChange}
        placeholder="npr. Brza jela"
        error={categoryNameError}
      />
      <Field
        label="Emoji"
        value={categoryEmoji}
        onChangeText={onCategoryEmojiChange}
        placeholder={DEFAULT_CATEGORY_EMOJI}
        error={categoryEmojiError}
      />
      <Field
        label="Opis (neobavezno)"
        value={categoryDescription}
        onChangeText={onCategoryDescriptionChange}
        placeholder="Kratak opis kategorije"
      />
      <PrimaryButton title="Dodaj kategoriju" busy={isSaving} onPress={onAddCategoryPress} />
      <Text style={styles.section}>Postojeće kategorije</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.md, marginBottom: spacing.lg },
  title: { color: colors.text, fontSize: 28, fontWeight: "900" },
  section: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "900",
    marginTop: spacing.sm,
  },
});
