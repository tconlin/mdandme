import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import { COLORS } from "@/constants/colors";
import { createComment } from "@/lib/api/comments";
import { CircularProgress } from "@/components/circularProgress";
import { useAtomValue, useSetAtom } from "jotai";
import { currentPostId } from "@/store/posts";
import { bottomSheetRef } from "@/store/app";
import { commentCountStore, commentStore } from "@/store/comments";
import { getCommentsForPost, getPostCommentCount } from "@/lib/api/comments";

export default function AddCommentScreen() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const postId = useAtomValue(currentPostId);
  const setCommentStore = useSetAtom(commentStore);
  const setCommentCountStore = useSetAtom(commentCountStore);
  const bottomSheetModalRef = useAtomValue(bottomSheetRef);

  async function handleSubmit() {
    if (isLoading || !postId) return;
    try {
      setIsLoading(true);
      await createComment({ text: inputValue, postId });
      const comments = await getCommentsForPost({ postId });
      const commentCount = await getPostCommentCount({ postId });
      setCommentStore(comments || []);
      setCommentCountStore(commentCount);
    } catch (error) {
      console.warn("handleSubmit error", error);
    } finally {
      setIsLoading(false);
      bottomSheetModalRef?.dismiss();
    }
  }

  return (
    <View className="flex-1 px-4 py-4">
      <TextInput
        className="w-full h-48 border border-gray-200 bg-white text-gray-800 py-6 rounded-lg px-4"
        placeholder="Add a comment..."
        multiline
        cursorColor={COLORS.gray["800"]}
        selectionColor={COLORS.gray["800"]}
        placeholderTextColor={COLORS.gray["400"]}
        value={inputValue}
        onChangeText={setInputValue}
        numberOfLines={4}
      />
      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-blue-700 text-white rounded-full px-4 py-2 mt-4"
      >
        {isLoading ? (
          <CircularProgress color="light" />
        ) : (
          <Text className="text-white text-base font-bold text-center">
            Post Comment
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
