import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdminCategoryItem } from "@/components/admin/categories/item";
import { AdminCategoriesHeader } from "@/components/admin/categories/header";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui";
import { DEFAULT_CATEGORY_EMOJI, MAX_CATEGORY_NAME_LENGTH } from "@/constants";
import { useAuth } from "@/contexts/auth-context";
import { recipeRepository } from "@/data/recipe-repository";
import type { Category } from "@/data/types";
import { firebaseErrorMessage } from "@/lib/firebase-errors";
import { colors, spacing } from "@/theme/app-theme";

export default function CategoriesAdminScreen() {
  const { role, isLoading: isAuthLoading } = useAuth();

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

  if (isLoading || isAuthLoading) {
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
    const handleConfirmDeletePress = () => {
      void handleDeleteCategory(category);
    };

    Alert.alert(
      "Obrisati kategoriju?",
      `Trajno će se obrisati kategorija „${category.name}”, svi njezini recepti i sve njihove ocjene. Ovu radnju nije moguće poništiti.`,
      [
        { text: "Odustani", style: "cancel" },
        {
          text: "Obriši sve",
          style: "destructive",
          onPress: handleConfirmDeletePress,
        },
      ],
    );
  };

  const categoryNameError =
    isSubmitted && (!categoryName.trim() || categoryName.trim().length > MAX_CATEGORY_NAME_LENGTH)
      ? `Unesite naziv do ${MAX_CATEGORY_NAME_LENGTH} znakova.`
      : undefined;

  const categoryEmojiError =
    isSubmitted && !categoryEmoji.trim() ? "Unesite emoji ili simbol." : undefined;

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <AdminCategoriesHeader
            categoryName={categoryName}
            categoryEmoji={categoryEmoji}
            categoryDescription={categoryDescription}
            categoryNameError={categoryNameError}
            categoryEmojiError={categoryEmojiError}
            isSaving={isSaving}
            onCategoryNameChange={setCategoryName}
            onCategoryEmojiChange={setCategoryEmoji}
            onCategoryDescriptionChange={setCategoryDescription}
            onAddCategoryPress={handleAddCategory}
          />
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
});
