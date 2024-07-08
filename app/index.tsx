import { View, Text, RefreshControl } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useAtom } from "jotai";
import { postsStore } from "@/store/posts";
import { getNextPosts } from "@/lib/api/posts";
import { lastVisiblePost } from "@/store/posts";
import { ShowAlert } from "@/components/alert";
import { Post } from "@/lib/schema";
import PostContainer from "@/components/post";
import { CircularProgress } from "@/components/circularProgress";
import { FlashList } from "@shopify/flash-list";
import { CategoryList } from "@/components/categoryList";

const POST_LIMIT = 50;

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [posts, setPosts] = useAtom(postsStore);
  const [lastVisible, setLastVisible] = useAtom(lastVisiblePost);
  const [endReached, setEndReached] = useState<boolean>(false);

  async function fetchPosts(reset = false) {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { data: nextPosts, lastVisible: newLastVisible } =
        await getNextPosts({
          limit: POST_LIMIT,
          lastVisiblePost: reset ? null : lastVisible,
        });

      if (reset) {
        setPosts(nextPosts);
        setEndReached(false);
      } else {
        setPosts([...posts, ...nextPosts]);
      }

      if (nextPosts.length > 0) {
        setLastVisible(newLastVisible);
      } else {
        setEndReached(true);
      }
    } catch (error) {
      console.warn("fetchPosts error", error);
      ShowAlert({
        type: "danger",
        message: "Could not fetch posts. Please try again later.",
      });
    } finally {
      setIsLoading(false);
      if (reset) {
        setRefreshing(false);
      }
    }
  }

  useEffect(() => {
    setPosts([]);
    setLastVisible(null);
    fetchPosts();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View key={item.id} className="mx-4">
        <PostContainer post={item} />
      </View>
    ),
    []
  );

  const renderFooter = () => (
    <View className="my-8">
      {isLoading && <CircularProgress color="dark" />}
      {endReached && !isLoading && <Text>No more posts to show</Text>}
    </View>
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLastVisible(null);
    fetchPosts(true);
  }, []);

  return (
    <View className="flex-1 bg-blue-400">
      <View className="my-4">
        <CategoryList />
      </View>
      <View className="flex-1 bg-white rounded-t-3xl">
        <View className="pl-6 pt-4">
          <Text className="text-xl font-bold">Most Recent Posts</Text>
        </View>
        <FlashList
          data={posts}
          contentInsetAdjustmentBehavior="always"
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListFooterComponent={renderFooter}
          ItemSeparatorComponent={() => <View className="h-1 bg-gray-200" />}
          onEndReached={fetchPosts}
          onEndReachedThreshold={0.5}
          estimatedItemSize={255} // Provide an estimated item size for better performance
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </View>
  );
}
