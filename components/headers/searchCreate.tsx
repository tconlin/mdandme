import { View, TouchableOpacity } from "react-native";
import React from "react";
import { SearchBox } from "@/components/searchBox";
import { PlusIcon } from "react-native-heroicons/outline";

export default function SearchCreateHeader() {
  // TODO: Add search functionality

  return (
    <View className="w-full h-28 flex-row justify-between items-center relative bg-blue-700 pt-12 px-2">
      <View className="w-3/4 flex items-center justify-start">
        <SearchBox placeholder="Search community posts" />
      </View>
      <TouchableOpacity
        onPress={() => {
          /*TODO: Add action here*/
        }}
        className="flex items-center justify-end"
      >
        <PlusIcon width={32} height={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}
