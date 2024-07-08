import GenericDB from "@/lib/db/index";
import { Comment } from "@/lib/schema";
import { getCountFromServer, where, query } from "firebase/firestore";

export default class CommentsDB extends GenericDB<Comment> {
  constructor() {
    super("comments");
  }

  async getCommentsCount(postId: string): Promise<number> {
    const commentCountQuery = query(
      this.collectionRef,
      where("post_id", "==", postId)
    );
    const comments = await getCountFromServer(commentCountQuery);
    return comments.data().count;
  }
}
