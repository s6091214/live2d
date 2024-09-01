import memeModel from "~/server/model/meme.model";

export default defineEventHandler(async () => {
  const popularMemes = await memeModel.find({});
  return popularMemes;
});
