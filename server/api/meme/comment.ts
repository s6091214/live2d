import memeModel from "~/server/model/meme.model";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { id } = body;

  const existingMeme = await memeModel.findOne({ id });

  if (existingMeme) {
    memeModel.updateOne({ ...body });
    return { status: true };
  }

  return { status: true };
});
