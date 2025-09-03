import { Router } from "express";
import {
  checkoutDesdeCarrito,
  getPedidosActuales,
  getPedidosHistoricos,
  cancelarPedido,
} from "../controllers/pedido.controller.js";

const router = Router();

// Crear pedido desde el carrito del usuario
// POST /api/v1/pedido/checkout/:idUsuario
router.post("/checkout/:idUsuario", checkoutDesdeCarrito);

// Pedidos pendientes del usuario
// GET /api/v1/pedido/actuales/:idUsuario
router.get("/actuales/:idUsuario", getPedidosActuales);

// Pedidos históricos (pagado/cancelado) del usuario
// GET /api/v1/pedido/historico/:idUsuario
router.get("/historico/:idUsuario", getPedidosHistoricos);

// Cancelar pedido (si esta pendiente)
// PUT /api/v1/pedido/cancelar/:idPedido
router.put("/cancelar/:idPedido", cancelarPedido);

export default router;
