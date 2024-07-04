import GenericDB from "@/lib/db/index";
import { Comment } from "@/lib/schema";

export default class CommentsDB extends GenericDB<Comment> {
  constructor() {
    super("comments");
  }
}
