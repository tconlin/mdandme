import { atom } from "jotai";
import { Post } from "@/lib/schema";
import { Firebase } from "@/lib/db/firebaseTypes";

export const postsStore = atom<Post[]>([]);
export const lastVisiblePost = atom<Firebase["DocumentReference"] | null>(null);
