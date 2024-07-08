export interface Comment {
  id: string;
  post_id: string;
  parent_id: number | null;
  display_name: string;
  text: string;
  created_at: string;
}

export interface Post {
  id: string;
  post_url: string;
  commentCount: number | undefined;
  title: string;
  created_at: string;
  num_hugs: number;
  patient_description: string;
  assessment: string;
  question: string;
  comments: { [key: string]: Comment };
}

export interface CommentCount {
  post_id: string;
  count: number;
}
