import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CategoryPicker } from "@/components/categories/picker";
import { EmptyState, ErrorState, Field, LoadingState, PrimaryButton } from "@/components/ui";
import { HTTPS_URL_REGEX } from "@/constants";
import { useAuth } from "@/contexts/auth-context";
import { recipeRepository } from "@/data/recipe-repository";
import type { Category, Recipe } from "@/data/types";
import { firebaseErrorMessage } from "@/lib/firebase-errors";
import { colors, radius, spacing } from "@/theme/app-theme";

type RecipeFormProps = {
  recipe?: Recipe;
  initialCategoryId?: string;
};

export function RecipeForm({ recipe, initialCategoryId }: RecipeFormProps) {
  const { user, role, isLoading: isAuthLoading } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState(recipe?.categoryId ?? initialCategoryId ?? "");

  const [title, setTitle] = useState(recipe?.title ?? "");
  const [description, setDescription] = useState(recipe?.description ?? "");
  const [imageUrl, setImageUrl] = useState(recipe?.imageUrl ?? "");
  const [isCategoryPickerVisible, setIsCategoryPickerVisible] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  const loadCategories = () => {
    setLoadError("");
    setIsLoading(true);
    recipeRepository
      .getCategories()
      .then(setCategories)
      .catch((error) => setLoadError(firebaseErrorMessage(error)))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    void recipeRepository
      .getCategories()
      .then(setCategories)
      .catch((error) => setLoadError(firebaseErrorMessage(error)))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || isAuthLoading) {
    return <LoadingState />;
  }

  if (!user) {
    return (
      <EmptyState title="Prijava je potrebna" message="Prijavi se kako bi mogao dodati recept." />
    );
  }

  if (recipe && role !== "admin") {
    return (
      <EmptyState
        title="Pristup nije dopušten"
        message="Samo administrator može uređivati recepte."
      />
    );
  }

  const selectedCategory = categories.find((category) => category.id === categoryId);
  const isHttpsUrlValid = HTTPS_URL_REGEX.test(imageUrl.trim());
  const isValid = Boolean(
    selectedCategory && title.trim() && description.trim() && isHttpsUrlValid,
  );

  const handleOpenCategoryPicker = () => {
    setIsCategoryPickerVisible(true);
  };

  const handleCloseCategoryPicker = () => {
    setIsCategoryPickerVisible(false);
  };

  const handleCategorySelect = (selectedCategoryId: string) => {
    setCategoryId(selectedCategoryId);
    setIsCategoryPickerVisible(false);
  };

  const handleUpdateSuccessPress = () => {
    if (!recipe) {
      return;
    }

    router.replace({ pathname: "/recipe/[id]", params: { id: recipe.id } });
  };

  const handleCreateSuccessPress = () => {
    router.replace({ pathname: "/category/[id]", params: { id: categoryId } });
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);

    if (!isValid || !selectedCategory || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const input = {
        categoryId,
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
      };

      if (recipe) {
        await recipeRepository.updateRecipe(recipe.id, input);
        Alert.alert("Promjene su spremljene", "Recept je uspješno ažuriran.", [
          {
            text: "U redu",
            onPress: handleUpdateSuccessPress,
          },
        ]);
        return;
      }

      await recipeRepository.createRecipe(input, user.uid, user.email ?? "Nepoznati korisnik");
      Alert.alert(
        "Recept je objavljen",
        `Recept je dodan u kategoriju „${selectedCategory.name}”.`,
        [
          {
            text: "U redu",
            onPress: handleCreateSuccessPress,
          },
        ],
      );
    } catch (error) {
      Alert.alert("Spremanje nije uspjelo", firebaseErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  if (loadError) {
    return (
      <ErrorState title="Kategorije nisu učitane" message={loadError} onRetry={loadCategories} />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.kicker}>{recipe ? "UREĐIVANJE" : "NOVI RECEPT"}</Text>
        <Text style={styles.title}>{recipe ? "Uredi recept" : "Podijeli svoj recept"}</Text>
        <Text style={styles.subtitle}>
          {recipe
            ? "Promijeni podatke recepta. Autor i datum nastanka ostat će nepromijenjeni."
            : "Sva polja su obavezna. Autor se automatski postavlja prema prijavljenom računu."}
        </Text>
        <View style={styles.field}>
          <Text style={styles.label}>Kategorija</Text>
          <Pressable
            style={[styles.select, isSubmitted && !categoryId && styles.invalid]}
            onPress={handleOpenCategoryPicker}
          >
            <Text style={selectedCategory ? styles.selectText : styles.placeholder}>
              {selectedCategory?.name ?? "Odaberi kategoriju"}
            </Text>
            <Text>⌄</Text>
          </Pressable>
          {isSubmitted && !categoryId ? (
            <Text style={styles.error}>Odaberite kategoriju.</Text>
          ) : null}
        </View>
        <Field
          label="Naslov"
          value={title}
          onChangeText={setTitle}
          placeholder="npr. Rižoto od kozica"
          error={isSubmitted && !title.trim() ? "Unesite naslov." : undefined}
        />
        <Field
          label="Opis pripreme"
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Opišite postupak..."
          error={isSubmitted && !description.trim() ? "Unesite opis pripreme." : undefined}
        />
        <Field
          label="HTTPS URL slike"
          value={imageUrl}
          onChangeText={setImageUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          placeholder="https://..."
          error={isSubmitted && !isHttpsUrlValid ? "Unesite ispravan HTTPS URL." : undefined}
        />
        <PrimaryButton
          title={recipe ? "Spremi promjene" : "Objavi recept"}
          busy={isSaving}
          onPress={handleSubmit}
        />
      </ScrollView>
      <CategoryPicker
        categories={categories}
        selectedCategoryId={categoryId}
        visible={isCategoryPickerVisible}
        onClose={handleCloseCategoryPicker}
        onSelect={handleCategorySelect}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: 48, gap: spacing.md },
  kicker: { color: colors.accent, letterSpacing: 2, fontSize: 11, fontWeight: "900" },
  title: { color: colors.text, fontSize: 30, fontWeight: "900" },
  subtitle: { color: colors.textMuted, lineHeight: 21 },
  field: { gap: spacing.sm },
  label: { color: colors.text, fontWeight: "800" },
  select: {
    minHeight: 50,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: { color: colors.text, fontSize: 16 },
  placeholder: { color: colors.textMuted, fontSize: 16 },
  invalid: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: 13 },
});
