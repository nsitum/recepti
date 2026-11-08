import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthLinks, EmptyState, LoadingState, PrimaryButton } from '@/components/app-ui';
import { RecipeCard } from '@/components/recipe-card';
import { mockRecipeRepository } from '@/data/recipe-repository';
import type { Category, Recipe } from '@/data/types';
import { colors, spacing } from '@/theme/app-theme';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); const [category, setCategory] = useState<Category>(); const [items, setItems] = useState<Recipe[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { Promise.all([mockRecipeRepository.getCategory(id), mockRecipeRepository.getRecipes(id)]).then(([nextCategory, nextItems]) => { setCategory(nextCategory); setItems(nextItems); }).catch(() => setError('Recepte trenutno nije moguće učitati.')).finally(() => setLoading(false)); }, [id]);
  if (loading) return <LoadingState />;
  return <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}><FlatList data={items} keyExtractor={(item) => item.id} contentContainerStyle={styles.content} ListHeaderComponent={<View style={styles.header}><View style={styles.auth}><AuthLinks /></View><Text style={styles.kicker}>KATEGORIJA</Text><Text style={styles.title}>{category?.name ?? 'Nepoznata kategorija'}</Text><Text style={styles.subtitle}>{category?.description}</Text><PrimaryButton title="Dodaj recept u ovu kategoriju" onPress={() => router.push({ pathname: '/recipe/new', params: { categoryId: id } })} />{error ? <Text style={styles.error}>{error}</Text> : null}</View>} ListEmptyComponent={<EmptyState title="Još nema recepata" message="U ovoj demonstracijskoj kategoriji još nema recepata." />} renderItem={({ item }) => <RecipeCard recipe={item} onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: item.id } })} />} /></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.md }, header: { gap: spacing.md, marginBottom: spacing.sm }, auth: { alignItems: 'flex-end' }, kicker: { color: colors.accent, letterSpacing: 1.8, fontSize: 11, fontWeight: '900' }, title: { color: colors.text, fontSize: 30, lineHeight: 36, fontWeight: '900' }, subtitle: { color: colors.textMuted, fontSize: 16 }, error: { color: colors.danger, fontWeight: '700' } });
