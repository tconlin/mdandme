import PostsDB from "@/lib/db/posts";
import { Post } from "@/lib/schema";
import { Firebase } from "@/lib/db/firebaseTypes";
import CommentsDB from "@/lib/db/comments";

export interface PaginatePostsResponse {
  data: Post[];
  lastVisible: Firebase["DocumentReference"];
}

export const incrementHug = async (postId: string): Promise<void> => {
  await new PostsDB().incrementHug(postId);
};

export const getNextPosts = async ({
  limit,
  lastVisiblePost,
}: {
  limit: number;
  lastVisiblePost: Firebase["DocumentReference"] | null;
}): Promise<PaginatePostsResponse> => {
  const { data, lastVisible } = await new PostsDB().paginate<Post[]>({
    lastVisible: lastVisiblePost,
    responseLimit: limit,
  });

  data.forEach(async (post: Post) => {
    const count = await new CommentsDB().getCommentsCount(post.id);
    post.commentCount = count;
  });

  return { data, lastVisible };
};
