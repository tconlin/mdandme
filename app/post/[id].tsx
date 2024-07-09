import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import BasicHeader from "@/components/headers/basic";
import { useEffect, useState } from "react";
import { CircularProgress } from "@/components/circularProgress";
import { Post, Comment } from "@/lib/schema";
import { getCommentsForPost, getPostCommentCount } from "@/lib/api/comments";
import { getPost } from "@/lib/api/posts";
import { timeAgo } from "@/utils/helpers";
import { ScrollView } from "react-native-gesture-handler";
import { SparklesIcon, PlusIcon } from "react-native-heroicons/mini";
import { COLORS } from "@/constants/colors";
import { MarkdownDisplay } from "@/components/markdown";
import { FlashList } from "@shopify/flash-list";
import { HugComponent } from "@/components/post/hug";
import { bottomSheetRef } from "@/store/app";
import { useAtomValue, useAtom, useSetAtom } from "jotai";
import { commentStore, commentCountStore } from "@/store/comments";
import { currentPostId } from "@/store/posts";

export default function ViewPostDetailScreen() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<Post | null>(null);
  const setCurrentPostId = useSetAtom(currentPostId);
  const [comments, setComments] = useAtom<Comment[]>(commentStore);
  const [commentCount, setCommentCount] = useAtom<number>(commentCountStore);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const bottomSheetRefStore = useAtomValue(bottomSheetRef);

  useEffect(() => {
    const fetchPostDetailsAndComments = async ({
      postId,
    }: {
      postId: string;
    }) => {
      try {
        const post = await getPost({ postId });
        const comments = await getCommentsForPost({ postId });
        const commentCount = await getPostCommentCount({ postId });
        setPost(post);
        setComments(comments || []);
        setCommentCount(commentCount);
      } catch (error) {
        console.warn("getPost error", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      const postId = id as string;
      setIsLoading(true);
      setComments([]);
      setCommentCount(0);
      setCurrentPostId(postId);
      fetchPostDetailsAndComments({ postId });
    }
  }, [id]);

  if (isLoading || !post) {
    return (
      <View className="flex-1">
        <BasicHeader backButton />
        <CircularProgress color="dark" />
      </View>
    );
  }

  const renderComment = ({ item }: { item: Comment }) => (
    <View key={item.id} className="mx-4 my-2">
      <View className="flex-row justify-start items-center">
        <Text className="text-base font-bold">{item.display_name}</Text>
        <Text className="text-xs font-base text-gray-700 ml-2">
          {timeAgo(item.created_at)}
        </Text>
      </View>
      <Text className="text-sm font-base text-gray-800">{item.text}</Text>
    </View>
  );

  return (
    <>
      <BasicHeader backButton moreButton />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-4 mb-12">
          <View className="flex-col">
            <Text className="text-sm font-base text-gray-700">
              {timeAgo(post.created_at)}
            </Text>
            <Text className="text-xl font-bold text-gray-900">
              {post.title}
            </Text>
            <Text className="text-sm font-normal text-gray-700">
              {post.patient_description}
            </Text>
            {post.assessment && (
              <View className="border border-gray-400 bg-gray-200 rounded-md px-4 py-2 mt-4">
                <View className="flex-row items-center my-4 w-full justify-center">
                  <SparklesIcon
                    width={28}
                    height={28}
                    color={COLORS.gray["800"]}
                  />
                  <Text className="text-base font-bold text-gray-800 ml-2">
                    Chatbot Assessment
                  </Text>
                </View>
                <MarkdownDisplay content={post.assessment} />
              </View>
            )}
            <View className="flex-row justify-between items-center mt-4">
              <Text className="text-gray-700 text-lg font-base">
                {commentCount ?? 0} Comments
              </Text>
              <HugComponent post={post} size="large" />
            </View>
            {comments && comments.length > 0 && (
              <View className="my-4">
                <FlashList
                  data={comments}
                  keyExtractor={(item) => item.id}
                  renderItem={renderComment}
                  estimatedItemSize={50}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View className="absolute bottom-0 right-0 left-0 justify-end flex items-end">
        <View className="rounded-full mx-8 my-8 bg-blue-700 flex-row w-1/3 items-center justify-center px-2 py-1">
          <TouchableOpacity
            onPress={() => bottomSheetRefStore?.present()}
            className="flex-row items-center justify-center"
          >
            <PlusIcon width={24} height={24} color={COLORS.gray["100"]} />
            <Text className="text-gray-100 text-sm font-bold ml-1">
              Comment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
