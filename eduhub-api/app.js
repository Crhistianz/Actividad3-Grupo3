import "dotenv/config";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", routes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
