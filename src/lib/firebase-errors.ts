import { FirebaseError } from "firebase/app";
const messages: Record<string, string> = {
  "auth/email-already-in-use": "Za ovu e-mail adresu već postoji račun.",
  "auth/invalid-credential": "E-mail ili lozinka nisu ispravni.",
  "auth/invalid-email": "Unesite ispravnu e-mail adresu.",
  "auth/too-many-requests": "Previše pokušaja. Pričekajte i pokušajte ponovno.",
  "auth/weak-password": "Lozinka mora imati najmanje 6 znakova.",
  "auth/network-request-failed": "Provjerite internetsku vezu i pokušajte ponovno.",
  "permission-denied": "Nemate dopuštenje za ovu radnju.",
  "failed-precondition":
    "Firestore indeks još nije spreman. Pričekajte da u Firebase Consoleu dobije status Enabled pa pokušajte ponovno.",
};
export function firebaseErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    return messages[error.code] ?? "Firebase radnja nije uspjela.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Dogodila se neočekivana pogreška.";
}
