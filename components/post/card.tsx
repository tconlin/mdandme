import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Post } from "@/lib/schema";
import { ChatBubbleOvalLeftEllipsisIcon } from "react-native-heroicons/outline";
import { COLORS } from "@/constants/colors";
import { useRouter } from "expo-router";
import { timeAgo } from "@/utils/helpers";
import { HugComponent } from "@/components/post/hug";

export const PostCard = ({ post }: { post: Post }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/post/${post.id}`)}
      className="bg-white my-1 px-2 py-4"
    >
      <Text className="text-xs font-base text-gray-700">
        {timeAgo(post.created_at)}
      </Text>
      <Text className="text-lg font-bold text-gray-900">{post.title}</Text>
      <Text numberOfLines={4} className="text-sm font-normal text-gray-700">
        {post.patient_description}
      </Text>

      <View className="mt-2 flex-row justify-between items-center">
        <View className="flex-row items-center justify-center">
          <ChatBubbleOvalLeftEllipsisIcon
            width={25}
            height={25}
            color={COLORS.gray["800"]}
          />
          <Text className="text-base text-gray-800 ml-2">
            {post.commentCount || 0} comments
          </Text>
        </View>
        <HugComponent post={post} />
      </View>
    </TouchableOpacity>
  );
};
