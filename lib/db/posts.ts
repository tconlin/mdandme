import GenericDB from "@/lib/db/index";
import { Post } from "@/lib/schema";

export default class PostsDB extends GenericDB<Post> {
  constructor() {
    super("posts");
  }
}
