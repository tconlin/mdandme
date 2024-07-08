import PostsDB from "@/lib/db/posts";
import { Post } from "@/lib/schema";
import { Firebase } from "@/lib/db/firebaseTypes";

export interface PaginatePostsResponse {
  data: Post[];
  lastVisible: Firebase["DocumentReference"];
}

export const getNextPosts = async ({
  limit,
  lastVisiblePost,
}: {
  limit: number;
  lastVisiblePost: Firebase["DocumentReference"] | null;
}): Promise<PaginatePostsResponse> => {
  return await new PostsDB().paginate({
    lastVisible: lastVisiblePost,
    responseLimit: limit,
  });
};
