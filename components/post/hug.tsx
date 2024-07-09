import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { HeartIcon as HeartIconOutline } from "react-native-heroicons/outline";
import { HeartIcon as HeartIconSolid } from "react-native-heroicons/solid";
import { COLORS } from "@/constants/colors";
import { Post } from "@/lib/schema";
import { executeHug } from "@/lib/api/posts";
import { useAtom } from "jotai";
import { postsStore } from "@/store/posts";

export const HugComponent = ({
  post,
  size,
}: {
  post: Post;
  size?: "small" | "large";
}) => {
  const [posts, setPosts] = useAtom(postsStore);

  async function addHug() {
    // Optimistically update the UI
    // TODO: num_hugs needs to be guaranteed to be in sync with the db

    try {
      post.num_hugs += 1;
      setPosts(
        posts.map((p) => {
          if (p.id === post.id) {
            return post;
          }
          return p;
        })
      );
      await executeHug({ postId: post.id });
    } catch (error) {
      console.warn("addHug error", error);
    }
  }

  return (
    <TouchableOpacity
      onPress={addHug}
      className="flex-row items-center justify-center"
    >
      {post.num_hugs > 0 ? (
        <HeartIconSolid
          width={size === "large" ? 32 : 25}
          height={size === "large" ? 32 : 25}
          color={COLORS.pink["500"]}
        />
      ) : (
        <HeartIconOutline
          width={size === "large" ? 32 : 25}
          height={size === "large" ? 32 : 25}
          color={COLORS.pink["500"]}
        />
      )}

      <Text
        className={`${
          size === "large" ? "text-lg" : "text-base"
        } text-gray-700 ml-2`}
      >
        {post.num_hugs} hugs
      </Text>
    </TouchableOpacity>
  );
};
