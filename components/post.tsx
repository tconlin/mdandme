import { View, Text } from "react-native";
import React from "react";
import { Post } from "@/lib/schema";

const PostContainer = ({ post }: { post: Post }) => {
  function timeAgo(dateString: string): string {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - givenDate.getTime();

    const millisecondsInADay = 24 * 60 * 60 * 1000;
    const millisecondsInAMonth = 30 * millisecondsInADay;

    const daysDifference = Math.floor(timeDifference / millisecondsInADay);
    const monthsDifference = Math.floor(timeDifference / millisecondsInAMonth);

    if (daysDifference < 30) {
      return `${daysDifference} days ago`;
    } else {
      return `${monthsDifference} months ago`;
    }
  }

  return (
    <View className="bg-white my-1 px-2 py-4">
      <Text className="text-xs font-base text-gray-500">
        {timeAgo(post.created_at)}
      </Text>
      <Text className="text-lg font-bold text-gray-900">{post.title}</Text>
      <Text numberOfLines={4} className="text-sm font-normal text-gray-700">
        {post.patient_description}
      </Text>
    </View>
  );
};

export default PostContainer;
