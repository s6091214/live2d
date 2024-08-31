export type UserType = {
  displayName: string | null;
  photoURL: string | null;
  uid: string;
  email: string | null;
};

export type MemePost = {
  _id: string;
  created_at: { _id: string; date_time_string: string; timestamp: number };
  hashtag: string;
  id: number;
  pageview: number;
  src: string;
  tags: [] | { id: string; title: string }[];
  title: string;
  total_like_count: number;
  url: string;
};
