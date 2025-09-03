import { Router } from "express";
import notificacionRoutes from "./routes/notificacion.routes.js";
const router = Router();
router.use("/notificacion", notificacionRoutes);
export default router;
