import mongoose from "mongoose";
import type { NitroApp } from "nitropack";

export default async (_nitroApp: NitroApp) => {
  try {
    mongoose.set("strictQuery", true); // 嚴格模式
    await mongoose.connect(
      "mongodb+srv://73307hank:WrDFp4ISWlXZ401o@hankyang.ktbpe.mongodb.net/memetalk-nuxt3"
    );
    console.log("連接 MongoDB");
  } catch (e) {
    console.error("Error MongoDB =>", e);
  }
};
