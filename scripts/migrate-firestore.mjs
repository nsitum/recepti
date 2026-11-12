import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { categories, seedRecipeEntries } from "./seed-firestore.mjs";

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error(
    "Nedostaje GOOGLE_APPLICATION_CREDENTIALS. Postavi je na apsolutnu putanju service-account JSON datoteke koja je izvan projekta.",
  );
  process.exit(1);
}

const options = { credential: applicationDefault() };

if (process.env.FIREBASE_PROJECT_ID) {
  options.projectId = process.env.FIREBASE_PROJECT_ID;
}

const app = getApps()[0] ?? initializeApp(options);
const db = getFirestore(app);

const categoryUpdates = categories.map((category, index) => ({
  ref: db.collection("categories").doc(category.id),
  data: {
    name: category.name,
    sortOrder: index + 1,
  },
}));

const recipeUpdates = seedRecipeEntries.map((recipe) => ({
  ref: db.collection("recipes").doc(`seed-${recipe.category.id}-${recipe.id}`),
  data: { imageUrl: recipe.imageUrl },
}));

const updates = [...categoryUpdates, ...recipeUpdates];
const snapshots = await db.getAll(...updates.map((update) => update.ref));
const batch = db.batch();
let updatedCategories = 0;
let updatedRecipes = 0;

updates.forEach((update, index) => {
  if (!snapshots[index].exists) {
    return;
  }

  batch.update(update.ref, update.data);

  if (index < categoryUpdates.length) {
    updatedCategories += 1;
    return;
  }

  updatedRecipes += 1;
});

if (updatedCategories > 0 || updatedRecipes > 0) {
  await batch.commit();
}

console.log(
  `Migracija dovršena. Ažurirano kategorija: ${updatedCategories}, seed recepata: ${updatedRecipes}. Korisnički podaci nisu mijenjani.`,
);
