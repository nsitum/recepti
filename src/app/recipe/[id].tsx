import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { AdminRecipeActions } from "@/components/admin/recipes/actions";
import { RatingCard } from "@/components/ratings/card";
import { RecipeDetails } from "@/components/recipes/details";
import { EmptyState, ErrorState, LoadingState, PrimaryButton } from "@/components/ui";
import { useAuth } from "@/contexts/auth-context";
import { ratingRepository } from "@/data/rating-repository";
import { recipeRepository } from "@/data/recipe-repository";
import type { RatingStats, RatingValue, Recipe } from "@/data/types";
import { firebaseErrorMessage } from "@/lib/firebase-errors";
import { colors, radius, spacing } from "@/theme/app-theme";

const EMPTY_RATING_STATS: RatingStats = { average: null, count: 0 };

export default function RecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, role } = useAuth();

  const [recipe, setRecipe] = useState<Recipe>();
  const [categoryName, setCategoryName] = useState("");
  const [ratingStats, setRatingStats] = useState<RatingStats>(EMPTY_RATING_STATS);
  const [userRating, setUserRating] = useState<RatingValue | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [ratingError, setRatingError] = useState("");
  const [ratingSuccessMessage, setRatingSuccessMessage] = useState("");

  const loadRecipe = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    setRatingError("");

    try {
      const loadedRecipe = await recipeRepository.getRecipe(id);
      setRecipe(loadedRecipe);

      if (!loadedRecipe) {
        return;
      }

      const [categoryResult, statsResult, userRatingResult] = await Promise.allSettled([
        recipeRepository.getCategory(loadedRecipe.categoryId),
        ratingRepository.getStats(id),
        user ? ratingRepository.getUserRating(id, user.uid) : Promise.resolve(null),
      ]);

      if (categoryResult.status === "fulfilled") {
        setCategoryName(categoryResult.value?.name ?? "");
      }

      if (statsResult.status === "fulfilled") {
        setRatingStats(statsResult.value);
      }

      if (statsResult.status === "rejected") {
        setRatingError(firebaseErrorMessage(statsResult.reason));
      }

      if (userRatingResult.status === "fulfilled") {
        setUserRating(userRatingResult.value);
      }

      if (userRatingResult.status === "rejected") {
        setRatingError(firebaseErrorMessage(userRatingResult.reason));
      }
    } catch (reason) {
      setLoadError(firebaseErrorMessage(reason));
    } finally {
      setIsLoading(false);
    }
  }, [id, user]);

  useFocusEffect(
    useCallback(() => {
      void loadRecipe();
    }, [loadRecipe]),
  );

  const handleRatingPress = async (rating: RatingValue) => {
    if (!user || !recipe || recipe.authorId === user.uid || isSaving) {
      return;
    }

    setIsSaving(true);
    setRatingSuccessMessage("");

    try {
      await ratingRepository.save(id, user.uid, rating);
      const updatedRatingStats = await ratingRepository.getStats(id);

      setUserRating(rating);
      setRatingStats(updatedRatingStats);
      setRatingError("");
      setRatingSuccessMessage("Ocjena je spremljena.");
    } catch (reason) {
      Alert.alert("Ocjena nije spremljena", firebaseErrorMessage(reason));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSuccessPress = () => {
    if (!recipe) {
      return;
    }

    router.replace({ pathname: "/category/[id]", params: { id: recipe.categoryId } });
  };

  const handleDeleteRecipe = async () => {
    if (!recipe || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await recipeRepository.deleteRecipe(recipe.id);
      Alert.alert("Recept je obrisan", "Obrisane su i sve njegove ocjene.", [
        { text: "U redu", onPress: handleDeleteSuccessPress },
      ]);
    } catch (reason) {
      Alert.alert("Brisanje nije uspjelo", firebaseErrorMessage(reason));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRecipePress = () => {
    if (!recipe || isSaving) {
      return;
    }

    Alert.alert(
      "Obrisati recept?",
      `Trajno će se obrisati recept „${recipe.title}” i sve njegove ocjene. Ovu radnju nije moguće poništiti.`,
      [
        { text: "Odustani", style: "cancel" },
        {
          text: "Obriši recept",
          style: "destructive",
          onPress: handleDeleteRecipe,
        },
      ],
    );
  };

  const handleRetryPress = () => {
    void loadRecipe();
  };

  const handleLoginPress = () => {
    router.push("/auth/login");
  };

  const handleEditRecipePress = () => {
    router.push({ pathname: "/recipe/edit/[id]", params: { id } });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (loadError) {
    return <ErrorState title="Recept nije učitan" message={loadError} onRetry={handleRetryPress} />;
  }

  if (!recipe) {
    return <EmptyState title="Recept nije pronađen" message="Recept je možda uklonjen." />;
  }

  const isOwnRecipe = user?.uid === recipe.authorId;

  return (
    <RecipeDetails
      recipe={recipe}
      categoryName={categoryName}
      ratingStats={ratingStats}
      ratingError={ratingError}
    >
      {user && !isOwnRecipe ? (
        <RatingCard
          currentRating={userRating}
          isSaving={isSaving}
          successMessage={ratingSuccessMessage}
          onRatingPress={handleRatingPress}
        />
      ) : isOwnRecipe ? (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>Vlastiti recept nije moguće ocijeniti.</Text>
        </View>
      ) : (
        <PrimaryButton title="Prijavi se za ocjenjivanje" onPress={handleLoginPress} />
      )}

      {role === "admin" ? (
        <AdminRecipeActions
          isBusy={isSaving}
          onEditPress={handleEditRecipePress}
          onDeletePress={handleDeleteRecipePress}
        />
      ) : null}
    </RecipeDetails>
  );
}

const styles = StyleSheet.create({
  notice: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  noticeText: { color: colors.textMuted },
});
