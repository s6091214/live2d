import userModel from "~/server/model/user.model";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { displayName, photoURL, uid, email } = body;

  const existingUser = await userModel.findOne({ uid });

  if (existingUser) {
    console.log("UID already exists.");
    return { status: false };
  }

  const user = new userModel({ displayName, photoURL, uid, email });

  await user.save();

  return { status: true };
});
