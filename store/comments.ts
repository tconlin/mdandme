import { atom } from "jotai";
import { Comment } from "@/lib/schema";

export const commentStore = atom<Comment[]>([]);
export const commentCountStore = atom<number>(0);
