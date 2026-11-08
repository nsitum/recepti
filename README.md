# Recepti

Mobilna aplikacija za kolegij Mobilne tehnologije, izrađena pomoću Expo SDK-a 58, React Nativea, TypeScripta i Expo Routera.

## Lokalno pokretanje

```bash
npm install
npx expo start
```

## Firebase konfiguracija

1. Kopirajte `.env.example` u `.env`.
2. U Firebase Consoleu otvorite postavke registrirane Web aplikacije i prepišite vrijednosti u `.env`.
3. U **Authentication → Sign-in method** uključite **Email/Password**.
4. Objavite `firestore.rules` i `firestore.indexes.json`, primjerice Firebase CLI naredbom `firebase deploy --only firestore`.
5. Nakon promjene `.env` datoteke ponovno pokrenite Expo server.

Expo u mobilni bundle ugrađuje `EXPO_PUBLIC_` vrijednosti. To nisu administratorske tajne; ovlasti provode Firestore Security Rules. Service-account JSON nikada se ne stavlja u aplikaciju ni repozitorij.

## Model podataka

- `categories/{categoryId}`: `name`, `emoji`, `description`, `createdAt`
- `recipes/{recipeId}`: `categoryId`, `title`, `description`, `imageUrl`, `authorId`, `authorEmail`, `createdAt`, `updatedAt`
- `ratings/{recipeId}_{uid}`: `recipeId`, `userId`, `value`, `updatedAt`
- `users/{uid}`: `email`, `role`, `createdAt`

Dokument ocjene ima deterministički ID pa korisnik može imati najviše jednu ocjenu po receptu. Recept namjerno nema polja prosjeka, zbroja ni broja ocjena. U fazi ocjenjivanja ta će se statistika čitati Firestore agregacijskim upitom iz izvornih ocjena, čime nema klijentskog prepisivanja agregata ni nedosljednosti pri istodobnim promjenama.

Brisanje recepta ili kategorije ne briše povezane Firestore dokumente automatski. Administratorski tok u fazi 5 mora eksplicitno pronaći i obrisati ocjene, zatim recepte, pa kategoriju. Za vrlo velik produkcijski skup koristila bi se pozadinska Cloud Function; ona nije potrebna za ovu izvedbu.

## Početni podaci

Skripta `scripts/seed-firestore.mjs` sadrži 8 kategorija i 40 recepata. Dokumenti koriste determinističke ID-eve. Skripta stvara samo dokumente koji nedostaju, ne mijenja postojeće dokumente, ne briše korisničke unose i ne stvara ocjene.

1. U Firebase Consoleu izradite service-account ključ za lokalnu administraciju i spremite ga **izvan ovog projekta**.
2. U PowerShellu postavite varijable samo za trenutnu sesiju:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\sigurna-lokacija\firebase-admin.json'
$env:FIREBASE_PROJECT_ID = 'firebase-project-id'
npm run seed
```

Ponovno pokretanje `npm run seed` sigurno je: postojeći seed i korisnički dokumenti ostaju netaknuti.

## Administratorska uloga

Registracija uvijek stvara `users/{uid}` s `role: "user"`. Security Rules korisniku zabranjuju samostalnu promjenu uloge. Za prvog administratora nakon registracije ručno promijenite `role` u `admin` kroz Firebase Console. Mobilna aplikacija ne sadrži administratorske vjerodajnice.

## Provjere

```bash
npx tsc --noEmit
npx expo lint
npx expo-doctor
node --check scripts/seed-firestore.mjs
```
