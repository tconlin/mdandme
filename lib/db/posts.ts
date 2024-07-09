import GenericDB from "@/lib/db/index";
import { Post } from "@/lib/schema";
import { doc, updateDoc, increment } from "firebase/firestore";
import { getDb } from "@/lib/init";

export default class PostsDB extends GenericDB<Post> {
  constructor() {
    super("posts");
  }

  /**
   * Increment the number of hugs on a post
   * @param postId - The ID of the post
   * @returns void
   */
  async incrementHug(postId: string): Promise<void> {
    const postRef = doc(getDb, this.collectionRef.path, postId);
    await updateDoc(postRef, {
      num_hugs: increment(1),
    });
  }
}
