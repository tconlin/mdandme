import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import {
  ChevronLeftIcon,
  EllipsisHorizontalIcon,
} from "react-native-heroicons/mini";
import { COLORS } from "@/constants/colors";

export default function BasicHeader({
  backButton,
  title,
  moreButton,
}: {
  backButton: boolean;
  title?: string;
  moreButton?: boolean;
}) {
  const router = useRouter();
  return (
    <View className="w-full h-28 flex-row justify-between items-center relative pt-12 px-4 bg-transparent">
      <View className="w-1/4 flex justify-start">
        {backButton && (
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex items-center w-12 h-12 rounded-full bg-gray-300 justify-center"
          >
            <ChevronLeftIcon
              width={40}
              height={40}
              color={COLORS.gray["900"]}
            />
          </TouchableOpacity>
        )}
      </View>
      <View className="w-1/2 flex items-center">
        {title && title !== "" && (
          <Text className="text-gray-900 text-lg font-bold">{title}</Text>
        )}
      </View>
      <View className="w-1/4 flex justify-end items-end">
        {moreButton && (
          <TouchableOpacity
            onPress={() => {
              /*TODO: Add action here*/
            }}
            className="flex items-center w-12 h-12 rounded-full bg-gray-300 justify-center"
          >
            <EllipsisHorizontalIcon
              width={32}
              height={32}
              color={COLORS.gray["900"]}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
