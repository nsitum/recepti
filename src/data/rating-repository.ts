import {
  average,
  collection,
  count,
  doc,
  getAggregateFromServer,
  getDoc,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { requireFirebase } from "@/lib/firebase";
import type { RatingStats, RatingValue } from "./types";

const ratingId = (recipeId: string, userId: string) => `${recipeId}_${userId}`;

export const ratingRepository = {
  async getStats(recipeId: string): Promise<RatingStats> {
    const { db } = requireFirebase();
    const ratings = query(collection(db, "ratings"), where("recipeId", "==", recipeId));
    const snapshot = await getAggregateFromServer(ratings, {
      count: count(),
      average: average("value"),
    });
    const data = snapshot.data();
    return { count: data.count, average: data.average ?? null };
  },
  async getUserRating(recipeId: string, userId: string): Promise<RatingValue | null> {
    const { db } = requireFirebase();
    const snapshot = await getDoc(doc(db, "ratings", ratingId(recipeId, userId)));
    if (!snapshot.exists()) {
      return null;
    }

    const value = snapshot.data().value;
    return Number.isInteger(value) && value >= 1 && value <= 5 ? (value as RatingValue) : null;
  },
  async save(recipeId: string, userId: string, value: RatingValue): Promise<void> {
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new Error("Ocjena mora biti cijeli broj od 1 do 5.");
    }

    const { db } = requireFirebase();
    await setDoc(doc(db, "ratings", ratingId(recipeId, userId)), {
      recipeId,
      userId,
      value,
      updatedAt: serverTimestamp(),
    });
  },
};
