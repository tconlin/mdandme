import { View, Text, Pressable } from "react-native";
import React from "react";
import { Post } from "@/lib/schema";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  HeartIcon as HeartIconOutline,
} from "react-native-heroicons/outline";
import { HeartIcon as HeartIconSolid } from "react-native-heroicons/solid";
import { COLORS } from "@/constants/colors";
import { incrementHug } from "@/lib/api/posts";
import { useAtom } from "jotai";
import { postsStore } from "@/store/posts";

const PostContainer = ({ post }: { post: Post }) => {
  const [posts, setPosts] = useAtom(postsStore);

  async function addHug() {
    post.num_hugs += 1;
    setPosts(
      posts.map((p) => {
        if (p.id === post.id) {
          return post;
        }
        return p;
      })
    );
    await incrementHug(post.id);
  }

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
    <Pressable
      onPress={() => console.log("here")}
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
        <Pressable
          onPress={addHug}
          className="flex-row items-center justify-center"
        >
          {post.num_hugs > 0 ? (
            <HeartIconSolid width={25} height={25} color={COLORS.pink["500"]} />
          ) : (
            <HeartIconOutline
              width={25}
              height={25}
              color={COLORS.pink["500"]}
            />
          )}

          <Text className="text-base text-gray-800 ml-2">
            {post.num_hugs} hugs
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

export default PostContainer;
