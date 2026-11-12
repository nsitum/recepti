import { AuthProvider } from "@/contexts/auth-context";
import { colors } from "@/theme/app-theme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "800" },
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="category/[id]" options={{ title: "Recepti" }} />
        <Stack.Screen name="recipe/[id]" options={{ title: "Detalji recepta" }} />
        <Stack.Screen name="recipe/new" options={{ title: "Novi recept", presentation: "modal" }} />
        <Stack.Screen name="recipe/edit/[id]" options={{ title: "Uredi recept" }} />
        <Stack.Screen name="auth/login" options={{ title: "Prijava", presentation: "modal" }} />
        <Stack.Screen
          name="auth/register"
          options={{ title: "Registracija", presentation: "modal" }}
        />
        <Stack.Screen name="admin/categories" options={{ title: "Kategorije" }} />
      </Stack>
    </AuthProvider>
  );
}
