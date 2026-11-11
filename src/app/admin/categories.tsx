import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState, Field, InfoBanner, LoadingState, PrimaryButton } from '@/components/ui/app-ui';
import { useAuth } from '@/contexts/auth-context';
import { recipeRepository } from '@/data/recipe-repository';
import type { Category } from '@/data/types';
import { firebaseErrorMessage } from '@/lib/firebase-errors';
import { colors, radius, spacing } from '@/theme/app-theme';

export default function CategoriesAdminScreen() {
  const { role, loading: authLoading } = useAuth();
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState(''); const [emoji, setEmoji] = useState('🍽️'); const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false); const [deletingId, setDeletingId] = useState(''); const [submitted, setSubmitted] = useState(false); const [error, setError] = useState('');

  const load = useCallback(async () => { setError(''); setLoading(true); try { setItems(await recipeRepository.getCategories()); } catch (reason) { setError(firebaseErrorMessage(reason)); } finally { setLoading(false); } }, []);
  useEffect(() => { recipeRepository.getCategories().then(setItems).catch((reason) => setError(firebaseErrorMessage(reason))).finally(() => setLoading(false)); }, []);
  if (loading || authLoading) return <LoadingState />;
  if (role !== 'admin') return <EmptyState title="Pristup nije dopušten" message="Upravljanje kategorijama dostupno je samo administratoru." />;

  const add = async () => {
    setSubmitted(true); const cleanName = name.trim(); const cleanEmoji = emoji.trim();
    if (!cleanName || cleanName.length > 80 || !cleanEmoji || busy) return;
    setBusy(true);
    try { await recipeRepository.createCategory({ name: cleanName, emoji: cleanEmoji, description: description.trim() }); setName(''); setEmoji('🍽️'); setDescription(''); setSubmitted(false); await load(); Alert.alert('Kategorija je dodana', `Kategorija „${cleanName}” sada je dostupna u aplikaciji.`); }
    catch (reason) { Alert.alert('Dodavanje nije uspjelo', firebaseErrorMessage(reason)); }
    finally { setBusy(false); }
  };
  const remove = async (item: Category) => {
    if (deletingId) return; setDeletingId(item.id);
    try { await recipeRepository.deleteCategory(item.id); setItems((current) => current.filter((category) => category.id !== item.id)); Alert.alert('Kategorija je obrisana', 'Obrisani su i svi pripadajući recepti i ocjene.'); }
    catch (reason) { Alert.alert('Brisanje nije uspjelo', firebaseErrorMessage(reason)); }
    finally { setDeletingId(''); }
  };
  const confirmRemove = (item: Category) => Alert.alert('Obrisati kategoriju?', `Trajno će se obrisati kategorija „${item.name}”, svi njezini recepti i sve njihove ocjene. Ovu radnju nije moguće poništiti.`, [{ text: 'Odustani', style: 'cancel' }, { text: 'Obriši sve', style: 'destructive', onPress: () => void remove(item) }]);

  return <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}><FlatList data={items} keyExtractor={(item) => item.id} contentContainerStyle={styles.content} ListHeaderComponent={<View style={styles.header}><Text style={styles.title}>Upravljanje kategorijama</Text><InfoBanner title="Pažljivo s brisanjem">Brisanje kategorije trajno uklanja sve njezine recepte i njihove ocjene.</InfoBanner>{error ? <View style={styles.errorBox}><Text style={styles.error}>{error}</Text><PrimaryButton title="Pokušaj ponovno" variant="outline" onPress={() => void load()} /></View> : null}<Field label="Naziv nove kategorije" value={name} onChangeText={setName} placeholder="npr. Brza jela" error={submitted && (!name.trim() || name.trim().length > 80) ? 'Unesite naziv do 80 znakova.' : undefined} /><Field label="Emoji" value={emoji} onChangeText={setEmoji} placeholder="🍽️" error={submitted && !emoji.trim() ? 'Unesite emoji ili simbol.' : undefined} /><Field label="Opis (neobavezno)" value={description} onChangeText={setDescription} placeholder="Kratak opis kategorije" /><PrimaryButton title="Dodaj kategoriju" busy={busy} onPress={() => void add()} /><Text style={styles.section}>Postojeće kategorije</Text></View>} ListEmptyComponent={!error ? <EmptyState title="Nema kategorija" message="Dodajte prvu kategoriju pomoću obrasca iznad." /> : undefined} renderItem={({ item }) => <View style={styles.row}><View style={styles.nameRow}><Text style={styles.emoji}>{item.emoji}</Text><View style={styles.nameBlock}><Text style={styles.name}>{item.name}</Text>{item.description ? <Text numberOfLines={2} style={styles.description}>{item.description}</Text> : null}</View></View><PrimaryButton title="Obriši" variant="danger" busy={deletingId === item.id} disabled={Boolean(deletingId)} onPress={() => confirmRemove(item)} /></View>} /></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.sm }, header: { gap: spacing.md, marginBottom: spacing.lg }, title: { color: colors.text, fontSize: 28, fontWeight: '900' }, section: { color: colors.text, fontSize: 19, fontWeight: '900', marginTop: spacing.sm }, errorBox: { gap: spacing.sm }, error: { color: colors.danger }, row: { minHeight: 84, padding: spacing.sm, paddingLeft: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm }, nameRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, nameBlock: { flex: 1, gap: spacing.xs }, emoji: { fontSize: 24 }, name: { color: colors.text, fontWeight: '800' }, description: { color: colors.textMuted, fontSize: 12, lineHeight: 17 } });
