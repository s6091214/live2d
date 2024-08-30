import memeModel from "~/server/model/meme.model";

export default defineEventHandler(async (event: any) => {
  const body = await readBody(event);

  const { id } = body;

  const existingMeme = await memeModel.findOne({ id });

  if (existingMeme) {
    return { status: false };
  }

  const meme = new memeModel({ ...body });

  await meme.save();

  return { status: true };
});
