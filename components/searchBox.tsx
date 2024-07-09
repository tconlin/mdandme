import { View, TextInput } from "react-native";
import { COLORS } from "@/constants/colors";
import { useState } from "react";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";

export function SearchBox({ placeholder, ...props }: { placeholder: string }) {
  const [inputValue, setInputValue] = useState("");

  //TODO: Add search functionality

  return (
    <View className="my-2 flex-row justify-center align-middle items-center border border-gray-200 h-12 w-full rounded-full py-2">
      <MagnifyingGlassIcon width={18} height={18} color={COLORS.gray["200"]} />
      <TextInput
        className="text-gray-200 rounded-full w-5/6 pl-4 h-12 text-sm"
        value={inputValue}
        onChangeText={(newValue) => {
          setInputValue(newValue);
        }}
        cursorColor={COLORS.gray["400"]}
        selectionColor={COLORS.gray["400"]}
        placeholderTextColor={COLORS.gray["400"]}
        placeholder={placeholder}
        clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        autoComplete="off"
      />
    </View>
  );
}
