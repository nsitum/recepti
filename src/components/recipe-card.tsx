import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FoodImage } from './app-ui';
import { colors, radius, spacing } from '@/theme/app-theme';
import type { Recipe } from '@/data/types';

export function RecipeCard({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) {
  return <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}><FoodImage uri={recipe.imageUrl} style={styles.image} /><View style={styles.body}><Text style={styles.title}>{recipe.title}</Text><Text numberOfLines={2} style={styles.description}>{recipe.description}</Text><Text style={styles.action}>Otvori recept  →</Text></View></Pressable>;
}
const styles = StyleSheet.create({ card: { overflow: 'hidden', borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, pressed: { opacity: .75 }, image: { width: '100%', aspectRatio: 16 / 10 }, body: { padding: spacing.md, gap: spacing.sm }, title: { color: colors.text, fontSize: 21, fontWeight: '900' }, description: { color: colors.textMuted, lineHeight: 20 }, action: { color: colors.accent, fontWeight: '800' } });
