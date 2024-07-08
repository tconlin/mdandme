import { atom } from "jotai";
import { Post } from "@/lib/schema";
import type * as firestore from "firebase/firestore";

export const postsStore = atom<Post[]>([]);
export const lastVisiblePost = atom<firestore.DocumentReference | null>(null);
