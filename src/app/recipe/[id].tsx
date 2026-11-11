import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AuthLinks, EmptyState, FoodImage, LoadingState, PrimaryButton } from '@/components/ui/app-ui';
import { useAuth } from '@/contexts/auth-context';
import { ratingRepository } from '@/data/rating-repository';
import { recipeRepository } from '@/data/recipe-repository';
import type { RatingStats, RatingValue, Recipe } from '@/data/types';
import { firebaseErrorMessage } from '@/lib/firebase-errors';
import { colors, radius, spacing } from '@/theme/app-theme';

const EMPTY_STATS: RatingStats = { average: null, count: 0 };

export default function RecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); const { user, role } = useAuth(); const [recipe, setRecipe] = useState<Recipe>(); const [categoryName, setCategoryName] = useState(''); const [stats, setStats] = useState<RatingStats>(EMPTY_STATS); const [myRating, setMyRating] = useState<RatingValue | null>(null); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState(''); const [ratingError, setRatingError] = useState(''); const [success, setSuccess] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError(''); setRatingError('');
    try {
      const next = await recipeRepository.getRecipe(id); setRecipe(next); if (!next) return;
      const [categoryResult, statsResult, userRatingResult] = await Promise.allSettled([recipeRepository.getCategory(next.categoryId), ratingRepository.getStats(id), user ? ratingRepository.getUserRating(id, user.uid) : Promise.resolve(null)]);
      if (categoryResult.status === 'fulfilled') setCategoryName(categoryResult.value?.name ?? '');
      if (statsResult.status === 'fulfilled') setStats(statsResult.value); else setRatingError(firebaseErrorMessage(statsResult.reason));
      if (userRatingResult.status === 'fulfilled') setMyRating(userRatingResult.value); else setRatingError(firebaseErrorMessage(userRatingResult.reason));
    } catch (reason) { setError(firebaseErrorMessage(reason)); }
    finally { setLoading(false); }
  }, [id, user]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const saveRating = async (value: RatingValue) => {
    if (!user || !recipe || recipe.authorId === user.uid || saving) return;
    setSaving(true); setSuccess('');
    try { await ratingRepository.save(id, user.uid, value); setMyRating(value); setStats(await ratingRepository.getStats(id)); setRatingError(''); setSuccess('Ocjena je spremljena.'); }
    catch (reason) { Alert.alert('Ocjena nije spremljena', firebaseErrorMessage(reason)); }
    finally { setSaving(false); }
  };
  const deleteRecipe = async () => {
    if (!recipe || saving) return;
    setSaving(true);
    try { await recipeRepository.deleteRecipe(recipe.id); Alert.alert('Recept je obrisan', 'Obrisane su i sve njegove ocjene.', [{ text: 'U redu', onPress: () => router.replace({ pathname: '/category/[id]', params: { id: recipe.categoryId } }) }]); }
    catch (reason) { Alert.alert('Brisanje nije uspjelo', firebaseErrorMessage(reason)); setSaving(false); }
  };
  const confirmDelete = () => {
    if (!recipe || saving) return;
    Alert.alert('Obrisati recept?', `Trajno će se obrisati recept „${recipe.title}” i sve njegove ocjene. Ovu radnju nije moguće poništiti.`, [{ text: 'Odustani', style: 'cancel' }, { text: 'Obriši recept', style: 'destructive', onPress: () => void deleteRecipe() }]);
  };

  if (loading) return <LoadingState />;
  if (error) return <View style={styles.center}><EmptyState title="Recept nije učitan" message={error} /><PrimaryButton title="Pokušaj ponovno" onPress={() => void load()} /></View>;
  if (!recipe) return <EmptyState title="Recept nije pronađen" message="Recept je možda uklonjen." />;
  const ownRecipe = user?.uid === recipe.authorId; const averageText = stats.count && stats.average !== null ? `★ ${stats.average.toFixed(1)}` : 'Nema ocjena';

  return <ScrollView style={styles.safe} contentContainerStyle={styles.content}><FoodImage uri={recipe.imageUrl} style={styles.hero} /><View style={styles.body}><View style={styles.auth}><AuthLinks /></View><View style={styles.badge}><Text style={styles.badgeText}>{categoryName}</Text></View><Text style={styles.title}>{recipe.title}</Text><View style={styles.rating}><Text style={[styles.score, stats.count > 0 && styles.scoreActive]}>{averageText}</Text><Text style={styles.count}>{stats.count} {stats.count === 1 ? 'korisnik' : 'korisnika'}</Text></View>{ratingError ? <Text style={styles.error}>{ratingError}</Text> : null}<Text style={styles.section}>Priprema</Text><Text style={styles.description}>{recipe.description}</Text><Text style={styles.author}>Autor: {recipe.authorEmail}</Text>{user && !ownRecipe ? <View style={styles.ratingCard}><Text style={styles.section}>{myRating ? `Tvoja ocjena: ${myRating}` : 'Ocijeni recept'}</Text><View style={styles.stars}>{([1, 2, 3, 4, 5] as RatingValue[]).map((value) => <Pressable key={value} disabled={saving} accessibilityRole="button" accessibilityLabel={`Ocjena ${value}`} onPress={() => void saveRating(value)}><Text style={[styles.star, value <= (myRating ?? 0) && styles.starActive]}>{'★'}</Text></Pressable>)}</View><Text style={styles.hint}>{saving ? 'Spremanje ocjene…' : 'Ocjenu možeš promijeniti u bilo kojem trenutku.'}</Text>{success ? <Text style={styles.success}>{success}</Text> : null}</View> : ownRecipe ? <View style={styles.notice}><Text style={styles.noticeText}>Vlastiti recept nije moguće ocijeniti.</Text></View> : <PrimaryButton title="Prijavi se za ocjenjivanje" onPress={() => router.push('/auth/login')} />}{role === 'admin' ? <View style={styles.admin}><Text style={styles.section}>Administratorske akcije</Text><PrimaryButton title="Uredi recept" variant="outline" disabled={saving} onPress={() => router.push({ pathname: '/recipe/edit/[id]', params: { id } })} /><PrimaryButton title="Obriši recept" variant="danger" busy={saving} onPress={confirmDelete} /></View> : null}</View></ScrollView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, center: { flex: 1, padding: spacing.lg, justifyContent: 'center', gap: spacing.md }, content: { paddingBottom: spacing.xl }, hero: { width: '100%', aspectRatio: 4 / 3 }, body: { padding: spacing.md, gap: spacing.md }, auth: { alignItems: 'flex-end' }, badge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: colors.surfaceMuted }, badgeText: { color: colors.accentDark, fontWeight: '800' }, title: { color: colors.text, fontSize: 32, lineHeight: 38, fontWeight: '900' }, rating: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm }, score: { color: colors.textMuted, fontSize: 18, fontWeight: '900' }, scoreActive: { color: colors.star }, count: { color: colors.textMuted }, error: { color: colors.danger, fontSize: 13 }, section: { color: colors.text, fontSize: 19, fontWeight: '900' }, description: { color: colors.text, fontSize: 16, lineHeight: 25 }, author: { color: colors.textMuted, fontSize: 13 }, ratingCard: { padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, gap: spacing.sm }, stars: { flexDirection: 'row', justifyContent: 'space-between' }, star: { color: colors.border, fontSize: 42 }, starActive: { color: colors.star }, hint: { color: colors.textMuted, fontSize: 12 }, success: { color: '#237A55', fontWeight: '800' }, notice: { padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.surfaceMuted }, noticeText: { color: colors.textMuted }, admin: { paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.md } });
