import memeModel from "~/server/model/meme.model";

export default defineEventHandler(async (event: any) => {
  const body = await readBody(event);

  const { id, liked_user } = body;

  const existingMeme = await memeModel.findOne({ id });

  if (existingMeme) {
    // await existingMeme.updateOne(existingMeme, { liked_user });
    // existingMeme.liked_user = liked_user;
    // await existingMeme.save();
    const result = await memeModel.updateOne({ id }, { $set: { liked_user } });

    return { status: result.nModified > 0 ? true : false };
  }

  return { status: false };
});
