import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthLinks, EmptyState, LoadingState, PrimaryButton } from '@/components/app-ui';
import { RecipeCard } from '@/components/recipe-card';
import { useAuth } from '@/contexts/auth-context';
import { recipeRepository } from '@/data/recipe-repository';
import type { Category, Recipe } from '@/data/types';
import { firebaseErrorMessage } from '@/lib/firebase-errors';
import { colors, spacing } from '@/theme/app-theme';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); const { user } = useAuth(); const [category, setCategory] = useState<Category>(); const [items, setItems] = useState<Recipe[]>([]); const [loading, setLoading] = useState(true); const [refreshing, setRefreshing] = useState(false); const [error, setError] = useState('');
  const load = useCallback(async () => { setError(''); const [categoryResult, recipesResult] = await Promise.allSettled([recipeRepository.getCategory(id), recipeRepository.getRecipes(id)]); if (categoryResult.status === 'fulfilled') setCategory(categoryResult.value); if (recipesResult.status === 'fulfilled') setItems(recipesResult.value); else setError(firebaseErrorMessage(recipesResult.reason)); setLoading(false); setRefreshing(false); }, [id]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  if (loading) return <LoadingState />;
  // @ts-expect-error React Native accepts null for ListEmptyComponent although its current type omits it.
  return <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}><FlatList data={items} keyExtractor={(item) => item.id} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} tintColor={colors.accent} onRefresh={() => { setRefreshing(true); void load(); }} />} ListHeaderComponent={<View style={styles.header}><View style={styles.auth}><AuthLinks /></View><Text style={styles.kicker}>KATEGORIJA</Text><Text style={styles.title}>{category?.name ?? 'Nepoznata kategorija'}</Text><Text style={styles.subtitle}>{category?.description}</Text><PrimaryButton title={user ? 'Dodaj recept u ovu kategoriju' : 'Prijavi se za dodavanje recepta'} onPress={() => user ? router.push({ pathname: '/recipe/new', params: { categoryId: id } }) : router.push('/auth/login')} />{error ? <View style={styles.errorBox}><Text style={styles.error}>{error}</Text><PrimaryButton title="Pokušaj ponovno" variant="outline" onPress={() => void load()} /></View> : null}</View>} ListEmptyComponent={!error ? <EmptyState title="Još nema recepata" message="U ovoj kategoriji još nema recepata." /> : null} renderItem={({ item }) => <RecipeCard recipe={item} onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: item.id } })} />} /></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.md }, header: { gap: spacing.md, marginBottom: spacing.sm }, auth: { alignItems: 'flex-end' }, kicker: { color: colors.accent, letterSpacing: 1.8, fontSize: 11, fontWeight: '900' }, title: { color: colors.text, fontSize: 30, lineHeight: 36, fontWeight: '900' }, subtitle: { color: colors.textMuted, fontSize: 16 }, errorBox: { gap: spacing.sm }, error: { color: colors.danger, fontWeight: '700' } });
