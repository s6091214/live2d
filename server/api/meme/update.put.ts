import memeModel from "~/server/model/meme.model";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { id, liked_user } = body;

  const existingMeme = await memeModel.findOne({ id });

  if (existingMeme) {
    await existingMeme.updateOne(existingMeme, { liked_user });

    await existingMeme.save();

    return { status: true };
  }

  return { status: false };
});
