import "dotenv/config";
import express from "express";
import http from "http";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

import corsMw from "./config/cors.js";
import connectMongo from "./config/mongoose.js";
import api from "./routes.js";
import { initSocket } from "./utils/socket.js";

const app = express();
const server = http.createServer(app);
initSocket(server);

app.disable("x-powered-by");
app.use(helmet());
app.use(compression());
app.use(corsMw);
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/v1", api);

const PORT = process.env.PORT || 4101;
connectMongo().then(() => {
  server.listen(PORT, () => console.log(`Realtime http://localhost:${PORT}`));
});
