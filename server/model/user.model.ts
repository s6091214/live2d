import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  displayName: {
    type: String,
  },
  photoURL: {
    type: String,
  },
  uid: {
    type: String,
  },
  email: {
    type: String,
  },
});

const user = mongoose.model("memetalk-nuxt3", userSchema, "user");

export default user;
