import GenericDB from "@/lib/db/index";
import { Comment } from "@/lib/schema";
import { getCountFromServer, where, query, getDocs } from "firebase/firestore";

export default class CommentsDB extends GenericDB<Comment> {
  constructor() {
    super("comments");
  }

  /**
   * Get the number of comments for a post
   * @param postId - The ID of the post
   * @returns The number of comments
   */
  async getCommentsCount({ postId }: { postId: string }): Promise<number> {
    const commentCountQuery = query(
      this.collectionRef,
      where("post_id", "==", postId)
    );
    const comments = await getCountFromServer(commentCountQuery);
    return comments.data().count;
  }
  /**
   * Get the comments for a post
   * @param postId - The ID of the post
   * @returns - The comments for the post
   */
  async getCommentsForPost({
    postId,
  }: {
    postId: string;
  }): Promise<Comment[] | null> {
    const commentQuery = query(
      this.collectionRef,
      where("post_id", "==", postId)
    );
    const querySnapshot = await getDocs(commentQuery);
    const results: Comment[] = [];
    querySnapshot.forEach((doc) => {
      const convertedData = this.convertObjectTimestampPropertiesToDate(
        doc.data()
      );

      results.push(convertedData as Comment);
    });
    return results;
  }
}
