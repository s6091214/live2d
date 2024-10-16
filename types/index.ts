export type UserType = {
  displayName: string | null;
  photoURL: string | null;
  uid: string;
  email: string | null;
};

export type MemePost = {
  title: string;
  src: string;
  url: string;
  memeId: number;
  pageview: number;
  total_like_count: number;
  tags: [] | { id: string; title: string }[];
  liked_user: string[];
  created_date: string;
  created_at?: { _id: string; date_time_string: string; timestamp: number };
  hashtag?: string;
  comments?: {
    name: string;
    content: string;
    avatar?: string;
    xata_createdat?: string;
    xata_id?: string;
  }[];
};
