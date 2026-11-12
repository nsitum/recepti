import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdminCategoryItem } from "@/components/admin/categories/item";
import {
  EmptyState,
  ErrorState,
  Field,
  InfoBanner,
  LoadingState,
  PrimaryButton,
} from "@/components/ui";
import { DEFAULT_CATEGORY_EMOJI, MAX_CATEGORY_NAME_LENGTH } from "@/constants";
import { useAuth } from "@/contexts/auth-context";
import { recipeRepository } from "@/data/recipe-repository";
import type { Category } from "@/data/types";
import { firebaseErrorMessage } from "@/lib/firebase-errors";
import { colors, spacing } from "@/theme/app-theme";

export default function CategoriesAdminScreen() {
  const { role, loading: authLoading } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryEmoji, setCategoryEmoji] = useState(DEFAULT_CATEGORY_EMOJI);
  const [categoryDescription, setCategoryDescription] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [deletingCategoryId, setDeletingCategoryId] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [loadError, setLoadError] = useState("");

  const loadCategories = useCallback(async () => {
    setLoadError("");
    setIsLoading(true);

    try {
      const loadedCategories = await recipeRepository.getCategories();
      setCategories(loadedCategories);
    } catch (reason) {
      setLoadError(firebaseErrorMessage(reason));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    recipeRepository
      .getCategories()
      .then(setCategories)
      .catch((reason) => setLoadError(firebaseErrorMessage(reason)))
      .finally(() => setIsLoading(false));
  }, []);

  const handleRetryPress = () => {
    void loadCategories();
  };

  if (isLoading || authLoading) {
    return <LoadingState />;
  }

  if (role !== "admin") {
    return (
      <EmptyState
        title="Pristup nije dopušten"
        message="Upravljanje kategorijama dostupno je samo administratoru."
      />
    );
  }

  if (loadError) {
    return (
      <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
        <ErrorState
          title="Kategorije nisu učitane"
          message={loadError}
          onRetry={handleRetryPress}
        />
      </SafeAreaView>
    );
  }

  const handleAddCategory = async () => {
    setIsSubmitted(true);

    const cleanName = categoryName.trim();
    const cleanEmoji = categoryEmoji.trim();
    const isNameValid = cleanName.length > 0 && cleanName.length <= MAX_CATEGORY_NAME_LENGTH;

    if (!isNameValid || !cleanEmoji || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await recipeRepository.createCategory({
        name: cleanName,
        emoji: cleanEmoji,
        description: categoryDescription.trim(),
      });

      setCategoryName("");
      setCategoryEmoji(DEFAULT_CATEGORY_EMOJI);
      setCategoryDescription("");
      setIsSubmitted(false);

      await loadCategories();

      Alert.alert(
        "Kategorija je dodana",
        `Kategorija „${cleanName}” sada je dostupna u aplikaciji.`,
      );
    } catch (reason) {
      Alert.alert("Dodavanje nije uspjelo", firebaseErrorMessage(reason));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (deletingCategoryId) {
      return;
    }

    setDeletingCategoryId(category.id);

    try {
      await recipeRepository.deleteCategory(category.id);
      setCategories((currentCategories) =>
        currentCategories.filter((currentCategory) => currentCategory.id !== category.id),
      );
      Alert.alert("Kategorija je obrisana", "Obrisani su i svi pripadajući recepti i ocjene.");
    } catch (reason) {
      Alert.alert("Brisanje nije uspjelo", firebaseErrorMessage(reason));
    } finally {
      setDeletingCategoryId("");
    }
  };

  const handleDeleteCategoryPress = (category: Category) => {
    Alert.alert(
      "Obrisati kategoriju?",
      `Trajno će se obrisati kategorija „${category.name}”, svi njezini recepti i sve njihove ocjene. Ovu radnju nije moguće poništiti.`,
      [
        { text: "Odustani", style: "cancel" },
        {
          text: "Obriši sve",
          style: "destructive",
          onPress: () => void handleDeleteCategory(category),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Upravljanje kategorijama</Text>
            <InfoBanner title="Pažljivo s brisanjem">
              Brisanje kategorije trajno uklanja sve njezine recepte i njihove ocjene.
            </InfoBanner>
            <Field
              label="Naziv nove kategorije"
              value={categoryName}
              onChangeText={setCategoryName}
              placeholder="npr. Brza jela"
              error={
                isSubmitted &&
                (!categoryName.trim() || categoryName.trim().length > MAX_CATEGORY_NAME_LENGTH)
                  ? `Unesite naziv do ${MAX_CATEGORY_NAME_LENGTH} znakova.`
                  : undefined
              }
            />
            <Field
              label="Emoji"
              value={categoryEmoji}
              onChangeText={setCategoryEmoji}
              placeholder={DEFAULT_CATEGORY_EMOJI}
              error={isSubmitted && !categoryEmoji.trim() ? "Unesite emoji ili simbol." : undefined}
            />
            <Field
              label="Opis (neobavezno)"
              value={categoryDescription}
              onChangeText={setCategoryDescription}
              placeholder="Kratak opis kategorije"
            />
            <PrimaryButton title="Dodaj kategoriju" busy={isSaving} onPress={handleAddCategory} />
            <Text style={styles.section}>Postojeće kategorije</Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Nema kategorija"
            message="Dodajte prvu kategoriju pomoću obrasca iznad."
          />
        }
        renderItem={({ item }) => (
          <AdminCategoryItem
            category={item}
            isDeleting={deletingCategoryId === item.id}
            isDeleteDisabled={Boolean(deletingCategoryId)}
            onDeletePress={handleDeleteCategoryPress}
          />
        )}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.sm },
  header: { gap: spacing.md, marginBottom: spacing.lg },
  title: { color: colors.text, fontSize: 28, fontWeight: "900" },
  section: { color: colors.text, fontSize: 19, fontWeight: "900", marginTop: spacing.sm },
});
