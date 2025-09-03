import mongoose from "mongoose";
export default async function connectMongo() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("Falta MONGO_URI");
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { autoIndex: true });
  console.log("[mongo] conectado");
}
