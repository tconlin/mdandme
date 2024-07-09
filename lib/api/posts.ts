import PostsDB from "@/lib/db/posts";
import { Post } from "@/lib/schema";
import type * as firestore from "firebase/firestore";
import { getPostCommentCount } from "@/lib/api/comments";

export interface PaginatePostsResponse {
  data: Post[];
  lastVisible: firestore.DocumentReference | null;
}

export const executeHug = async ({
  postId,
}: {
  postId: string;
}): Promise<void> => {
  await new PostsDB().incrementHug(postId);
};

export const getPost = async ({
  postId,
}: {
  postId: string;
}): Promise<Post | null> => {
  return await new PostsDB().read<Post>({ id: postId });
};

export const getNextPosts = async ({
  limit,
  lastVisiblePost,
}: {
  limit: number;
  lastVisiblePost: firestore.DocumentReference | null;
}): Promise<PaginatePostsResponse> => {
  const { data, lastVisible } = await new PostsDB().paginate<Post[]>({
    lastVisible: lastVisiblePost,
    responseLimit: limit,
  });

  await Promise.all(
    data.map(async (post: Post) => {
      const count = await getPostCommentCount({ postId: post.id });
      post.commentCount = count;
    })
  );

  return { data, lastVisible };
};
