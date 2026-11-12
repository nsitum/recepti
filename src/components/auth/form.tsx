import { Field, InfoBanner, PrimaryButton } from "@/components/ui";
import { isFirebaseConfigured, requireFirebase } from "@/lib/firebase";
import { firebaseErrorMessage } from "@/lib/firebase-errors";
import { colors, spacing } from "@/theme/app-theme";
import { Link, router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const register = mode === "register";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const emailOk = /^\S+@\S+\.\S+$/.test(email.trim());
  const passwordOk = password.length >= 6;
  const valid = emailOk && passwordOk && (!register || confirm === password);

  const submit = async () => {
    setSubmitted(true);

    if (!valid || busy) {
      return;
    }

    setBusy(true);
    try {
      const { auth, db } = requireFirebase();
      if (register) {
        const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
        try {
          await setDoc(doc(db, "users", result.user.uid), {
            email: result.user.email,
            role: "user",
            createdAt: serverTimestamp(),
          });
        } catch (profileError) {
          await deleteUser(result.user);
          throw profileError;
        }
      }

      if (!register) {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }

      router.dismissAll();
    } catch (error) {
      Alert.alert(
        register ? "Registracija nije uspjela" : "Prijava nije uspjela",
        firebaseErrorMessage(error),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.kicker}>{register ? "NOVI RAČUN" : "DOBRO DOŠLI"}</Text>
        <Text style={styles.title}>{register ? "Pridruži se kuhinji" : "Prijavi se"}</Text>
        <Text style={styles.subtitle}>
          {register
            ? "Registriraj se e-mail adresom i lozinkom."
            : "Nastavi dodavati i ocjenjivati recepte."}
        </Text>
        {!isFirebaseConfigured ? (
          <InfoBanner>
            Firebase još nije konfiguriran. Kopiraj .env.example u .env i ponovno pokreni Expo
            server.
          </InfoBanner>
        ) : null}
        <Field
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={submitted && !emailOk ? "Unesite ispravnu e-mail adresu." : undefined}
        />
        <Field
          label="Lozinka"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete={register ? "new-password" : "current-password"}
          error={submitted && !passwordOk ? "Lozinka mora imati najmanje 6 znakova." : undefined}
        />
        {register ? (
          <Field
            label="Ponovite lozinku"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            error={submitted && confirm !== password ? "Lozinke se ne podudaraju." : undefined}
          />
        ) : null}
        <PrimaryButton
          title={register ? "Registriraj se" : "Prijavi se"}
          busy={busy}
          disabled={!isFirebaseConfigured}
          onPress={submit}
        />
        <Text style={styles.switch}>
          {register ? "Već imaš račun? " : "Nemaš račun? "}
          <Link href={register ? "/auth/login" : "/auth/register"} style={styles.link}>
            {register ? "Prijava" : "Registracija"}
          </Link>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },
  kicker: {
    color: colors.accent,
    letterSpacing: 2,
    fontSize: 11,
    fontWeight: "900",
  },
  title: { color: colors.text, fontSize: 32, fontWeight: "900" },
  subtitle: {
    color: colors.textMuted,
    lineHeight: 21,
    marginBottom: spacing.sm,
  },
  switch: { color: colors.textMuted, textAlign: "center" },
  link: { color: colors.accent, fontWeight: "900" },
});
