import mongoose from "mongoose";
const { Schema } = mongoose;

const memeSchema = new Schema({
  created_at: {
    type: { date_time_string: String, timestamp: Number },
  },
  hashtag: {
    type: String,
  },
  id: {
    type: Number,
  },
  pageview: {
    type: Number,
  },
  src: {
    type: String,
  },
  tags: {
    type: Array<string>,
  },
  title: {
    type: String,
  },
  total_like_count: {
    type: Number,
  },
  url: {
    type: String,
  },
  liked_user: {
    type: Array<string>,
  },
});

const meme = mongoose.model("memetalk-nuxt3.meme", memeSchema, "meme");

export default meme;
