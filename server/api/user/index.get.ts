import userModel from "~/server/model/user.model";

export default defineEventHandler(async () => {
  const user = await userModel.find({});
  return user;
});
