import { View, ImageSourcePropType, Pressable } from "react-native";
import React from "react";
import { SearchBox } from "./searchBox";
import { PlusIcon } from "react-native-heroicons/outline";

const Header = ({ logo }: { logo: ImageSourcePropType }) => {
  return (
    <View className="w-full h-28 flex-row justify-between items-center relative bg-blue-400 pt-12 px-2">
      <View className="w-3/4 flex items-center justify-start">
        <SearchBox placeholder="Search" />
      </View>
      <Pressable onPress={() => {}} className="flex items-center justify-end">
        <PlusIcon width={32} height={32} color="white" />
      </Pressable>
    </View>
  );
};

export default Header;
