import { Comment } from "@/lib/schema";
import CommentsDB from "@/lib/db/comments";
import { commentSchema } from "@/lib/schema-zod";
import { nanoid } from "nanoid/non-secure";

export const getCommentsForPost = async ({
  postId,
}: {
  postId: string;
}): Promise<Comment[] | null> => {
  return await new CommentsDB().getCommentsForPost({ postId });
};

export const getPostCommentCount = async ({
  postId,
}: {
  postId: string;
}): Promise<number> => {
  return await new CommentsDB().getCommentsCount({ postId });
};

export const createComment = async ({
  postId,
  text,
}: {
  postId: string;
  text: string;
}): Promise<void> => {
  const uid = nanoid();
  const comment: Comment = {
    id: uid,
    text,
    parent_id: null, // TODO: Implement parent comments
    display_name: "Anonymous", // TODO: Get user display name
    post_id: postId,
    created_at: new Date().toISOString(),
  };
  await new CommentsDB().create<Comment>({
    data: comment,
    schema: commentSchema,
  });
};
