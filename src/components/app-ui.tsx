import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, type PressableProps, type TextInputProps } from 'react-native';
import { useAuth } from '@/contexts/auth-context';
import { colors, radius, spacing } from '@/theme/app-theme';

export function PrimaryButton({ title, variant = 'primary', busy = false, ...props }: PressableProps & { title: string; variant?: 'primary' | 'outline' | 'danger'; busy?: boolean }) {
  return <Pressable accessibilityRole="button" {...props} disabled={busy || props.disabled} style={({ pressed }) => [styles.button, variant === 'outline' && styles.outline, variant === 'danger' && styles.danger, pressed && styles.pressed, (busy || props.disabled) && styles.disabled]}>{busy ? <ActivityIndicator color="#fff" /> : <Text style={[styles.buttonText, variant === 'outline' && styles.outlineText]}>{title}</Text>}</Pressable>;
}
export function Field({ label, error, ...props }: TextInputProps & { label: string; error?: string }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput placeholderTextColor={colors.textMuted} {...props} style={[styles.input, props.multiline && styles.multiline, error && styles.inputError, props.style]} />{error ? <Text style={styles.error}>{error}</Text> : null}</View>;
}
export function AuthLinks() {
  const { user, role, loading, logout } = useAuth();
  if (loading) return <ActivityIndicator size="small" color={colors.accent} />;
  if (user) return <View style={styles.authLinks}><Text numberOfLines={1} style={styles.muted}>{role === 'admin' ? 'Administrator' : user.email}</Text><Pressable onPress={logout}><Text style={styles.link}>Odjava</Text></Pressable></View>;
  return <View style={styles.authLinks}><Pressable onPress={() => router.push('/auth/login')}><Text style={styles.link}>Prijava</Text></Pressable><Pressable onPress={() => router.push('/auth/register')}><Text style={styles.register}>Registracija</Text></Pressable></View>;
}
export function LoadingState() { return <View style={styles.center}><ActivityIndicator size="large" color={colors.accent} /><Text style={styles.muted}>Učitavanje…</Text></View>; }
export function EmptyState({ title, message }: { title: string; message: string }) { return <View style={styles.center}><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.muted}>{message}</Text></View>; }
export function InfoBanner({ children, title = 'Važna napomena' }: { children: string; title?: string }) { return <View style={styles.info}><Text style={styles.infoTitle}>{title}</Text><Text style={styles.muted}>{children}</Text></View>; }
export function FoodImage({ uri, style }: { uri: string; style?: object }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <View style={[styles.imageFallback, style]}><Text style={styles.fallbackEmoji}>🍽️</Text><Text style={styles.muted}>Slika nije dostupna</Text></View>;
  return <Image source={{ uri }} contentFit="cover" transition={200} onError={() => setFailed(true)} style={[styles.image, style]} />;
}
const styles = StyleSheet.create({ button: { minHeight: 50, paddingHorizontal: spacing.lg, borderRadius: radius.md, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }, buttonText: { color: '#fff', fontSize: 16, fontWeight: '800' }, outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.accent }, outlineText: { color: colors.accent }, danger: { backgroundColor: colors.danger }, pressed: { opacity: .75 }, disabled: { opacity: .45 }, field: { gap: spacing.sm }, label: { color: colors.text, fontWeight: '800' }, input: { minHeight: 50, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.surface, color: colors.text, fontSize: 16 }, multiline: { minHeight: 140, paddingTop: spacing.md, textAlignVertical: 'top' }, inputError: { borderColor: colors.danger }, error: { color: colors.danger, fontSize: 13 }, authLinks: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, link: { color: colors.accent, fontWeight: '800' }, register: { color: '#fff', fontWeight: '800', backgroundColor: colors.accent, paddingHorizontal: 13, paddingVertical: 8, borderRadius: radius.pill, overflow: 'hidden' }, center: { flex: 1, minHeight: 220, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.xl }, muted: { color: colors.textMuted, textAlign: 'center', lineHeight: 20 }, emptyTitle: { color: colors.text, fontSize: 20, fontWeight: '900' }, info: { padding: spacing.md, borderRadius: radius.md, backgroundColor: '#FFF0DC', gap: spacing.xs }, infoTitle: { color: colors.text, fontWeight: '900' }, image: { backgroundColor: colors.surfaceMuted }, imageFallback: { backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center', gap: spacing.sm }, fallbackEmoji: { fontSize: 32 } });
