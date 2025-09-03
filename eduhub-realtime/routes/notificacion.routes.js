import { Router } from "express";
import {
  requireAuth,
  requireInternalKey,
} from "../middleware/auth.middleware.js";
import {
  nuevoPedido,
  noLeidos,
  marcarLeido,
  generarQR,
  confirmarPago,
} from "../controllers/notificacion.controller.js";

const router = Router();
router.post("/pedido", requireInternalKey, nuevoPedido); // llamado por eduhub-api
router.get("/no-leidos", requireAuth, noLeidos); // logística
router.patch("/:id/leido", requireAuth, marcarLeido); // alternativa HTTP
router.get("/qr/:pedidoId", requireAuth, generarQR); // genera QR
router.get("/pagar", confirmarPago); // “escaneo de QR”
export default router;
