import memeModel from "~/server/model/meme.model";

export default defineEventHandler(async (event: any) => {
  const body = await readBody(event);

  const { id, liked_user } = body;

  const existingMeme = await memeModel.findOne({ id });

  if (existingMeme) {
    existingMeme.liked_user = liked_user;
    await existingMeme.save();
  }

  return { status: false };
});
