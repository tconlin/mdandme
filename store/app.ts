import { atom } from "jotai";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export const bottomSheetRef = atom<BottomSheetModal | null>(null);
