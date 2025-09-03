import cors from "cors";
const origins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export default cors({
  origin: origins.length ? origins : true,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
});
