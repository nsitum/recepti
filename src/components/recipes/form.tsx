import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EmptyState, Field, LoadingState, PrimaryButton } from '@/components/ui';
import { useAuth } from '@/contexts/auth-context';
import { recipeRepository } from '@/data/recipe-repository';
import type { Category, Recipe } from '@/data/types';
import { firebaseErrorMessage } from '@/lib/firebase-errors';
import { colors, radius, spacing } from '@/theme/app-theme';

export function RecipeForm({ recipe, initialCategoryId }: { recipe?: Recipe; initialCategoryId?: string }) {
  const { user, role, loading: authLoading } = useAuth(); const [categories, setCategories] = useState<Category[]>([]); const [categoryId, setCategoryId] = useState(recipe?.categoryId ?? initialCategoryId ?? ''); const [title, setTitle] = useState(recipe?.title ?? ''); const [description, setDescription] = useState(recipe?.description ?? ''); const [imageUrl, setImageUrl] = useState(recipe?.imageUrl ?? ''); const [picker, setPicker] = useState(false); const [submitted, setSubmitted] = useState(false); const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false); const [loadError, setLoadError] = useState('');
  const loadCategories = () => { setLoadError(''); setLoading(true); recipeRepository.getCategories().then(setCategories).catch((error) => setLoadError(firebaseErrorMessage(error))).finally(() => setLoading(false)); };
  useEffect(() => { void recipeRepository.getCategories().then(setCategories).catch((error) => setLoadError(firebaseErrorMessage(error))).finally(() => setLoading(false)); }, []);
  if (loading || authLoading) return <LoadingState />;
  if (!user) return <EmptyState title="Prijava je potrebna" message="Prijavi se kako bi mogao dodati recept." />;
  if (recipe && role !== 'admin') return <EmptyState title="Pristup nije dopušten" message="Samo administrator može uređivati recepte." />;
  const selected = categories.find((item) => item.id === categoryId); const httpsOk = /^https:\/\/\S+$/i.test(imageUrl.trim()); const valid = Boolean(selected && title.trim() && description.trim() && httpsOk);
  const submit = async () => {
    setSubmitted(true); if (!valid || !selected || busy) return; setBusy(true);
    try {
      const input = { categoryId, title: title.trim(), description: description.trim(), imageUrl: imageUrl.trim() };
      if (recipe) {
        await recipeRepository.updateRecipe(recipe.id, input);
        Alert.alert('Promjene su spremljene', 'Recept je uspješno ažuriran.', [{ text: 'U redu', onPress: () => router.replace({ pathname: '/recipe/[id]', params: { id: recipe.id } }) }]);
      } else {
        await recipeRepository.createRecipe(input, user.uid, user.email ?? 'Nepoznati korisnik');
        Alert.alert('Recept je objavljen', `Recept je dodan u kategoriju „${selected.name}”.`, [{ text: 'U redu', onPress: () => router.replace({ pathname: '/category/[id]', params: { id: categoryId } }) }]);
      }
    } catch (error) { Alert.alert('Spremanje nije uspjelo', firebaseErrorMessage(error)); }
    finally { setBusy(false); }
  };
  if (loadError) return <View style={styles.center}><EmptyState title="Kategorije nisu učitane" message={loadError} /><PrimaryButton title="Pokušaj ponovno" onPress={loadCategories} /></View>;
  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><Text style={styles.kicker}>{recipe ? 'UREĐIVANJE' : 'NOVI RECEPT'}</Text><Text style={styles.title}>{recipe ? 'Uredi recept' : 'Podijeli svoj recept'}</Text><Text style={styles.subtitle}>{recipe ? 'Promijeni podatke recepta. Autor i datum nastanka ostat će nepromijenjeni.' : 'Sva polja su obavezna. Autor se automatski postavlja prema prijavljenom računu.'}</Text><View style={styles.field}><Text style={styles.label}>Kategorija</Text><Pressable style={[styles.select, submitted && !categoryId && styles.invalid]} onPress={() => setPicker(true)}><Text style={selected ? styles.selectText : styles.placeholder}>{selected?.name ?? 'Odaberi kategoriju'}</Text><Text>⌄</Text></Pressable>{submitted && !categoryId ? <Text style={styles.error}>Odaberite kategoriju.</Text> : null}</View><Field label="Naslov" value={title} onChangeText={setTitle} placeholder="npr. Rižoto od kozica" error={submitted && !title.trim() ? 'Unesite naslov.' : undefined} /><Field label="Opis pripreme" value={description} onChangeText={setDescription} multiline placeholder="Opišite postupak..." error={submitted && !description.trim() ? 'Unesite opis pripreme.' : undefined} /><Field label="HTTPS URL slike" value={imageUrl} onChangeText={setImageUrl} autoCapitalize="none" autoCorrect={false} keyboardType="url" placeholder="https://..." error={submitted && !httpsOk ? 'Unesite ispravan HTTPS URL.' : undefined} /><PrimaryButton title={recipe ? 'Spremi promjene' : 'Objavi recept'} busy={busy} onPress={submit} /></ScrollView><Modal visible={picker} transparent animationType="fade" onRequestClose={() => setPicker(false)}><Pressable style={styles.overlay} onPress={() => setPicker(false)}><View style={styles.sheet}><Text style={styles.sheetTitle}>Odaberi kategoriju</Text>{categories.map((item) => <Pressable key={item.id} style={styles.option} onPress={() => { setCategoryId(item.id); setPicker(false); }}><Text style={styles.selectText}>{item.name}</Text>{item.id === categoryId ? <Text style={styles.check}>✓</Text> : null}</Pressable>)}</View></Pressable></Modal></KeyboardAvoidingView>;
}
const styles = StyleSheet.create({ flex: { flex: 1 }, center: { flex: 1, padding: spacing.lg, justifyContent: 'center', gap: spacing.md }, content: { padding: spacing.md, paddingBottom: 48, gap: spacing.md }, kicker: { color: colors.accent, letterSpacing: 2, fontSize: 11, fontWeight: '900' }, title: { color: colors.text, fontSize: 30, fontWeight: '900' }, subtitle: { color: colors.textMuted, lineHeight: 21 }, field: { gap: spacing.sm }, label: { color: colors.text, fontWeight: '800' }, select: { minHeight: 50, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.surface, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, selectText: { color: colors.text, fontSize: 16 }, placeholder: { color: colors.textMuted, fontSize: 16 }, invalid: { borderColor: colors.danger }, error: { color: colors.danger, fontSize: 13 }, overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#0007' }, sheet: { padding: spacing.lg, paddingBottom: 40, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, backgroundColor: colors.background }, sheetTitle: { color: colors.text, fontSize: 21, fontWeight: '900', marginBottom: spacing.md }, option: { minHeight: 48, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, check: { color: colors.accent, fontSize: 20, fontWeight: '900' } });
