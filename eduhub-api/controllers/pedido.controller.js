import {
  crearPedidoDesdeCarrito,
  obtenerPedidosActualesPorUsuario,
  obtenerPedidosHistoricosPorUsuario,
  cancelarPedido as cancelarPedidoService,
} from "../services/pedido.service.js";

// POST /api/v1/pedido/checkout/:idUsuario  revisar carrito (idUsuario)
export async function checkoutDesdeCarrito(req, res) {
  try {
    const { idUsuario } = req.params;
    if (!idUsuario)
      return res.status(400).json({ error: "idUsuario es requerido" });

    const result = await crearPedidoDesdeCarrito(Number(idUsuario));
    return res
      .status(201)
      .json({ mensaje: "Pedido creado desde el carrito", ...result });
  } catch (err) {
    const msg =
      err?.message === "El carrito está vacío"
        ? err.message
        : "Error al crear el pedido desde el carrito";
    return res.status(400).json({ error: msg });
  }
}

// GET /api/v1/pedido/actuales/:idUsuario 
export async function getPedidosActuales(req, res) {
  try {
    const { idUsuario } = req.params;
    const rows = await obtenerPedidosActualesPorUsuario(Number(idUsuario));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener pedidos actuales" });
  }
}

// GET /api/v1/pedido/historico/:idUsuario 
export async function getPedidosHistoricos(req, res) {
  try {
    const { idUsuario } = req.params;
    const rows = await obtenerPedidosHistoricosPorUsuario(Number(idUsuario));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener pedidos históricos" });
  }
}

// PUT /api/v1/pedido/cancelar/:idPedido 
export async function cancelarPedido(req, res) {
  try {
    const { idPedido } = req.params;
    const { affected } = await cancelarPedidoService(Number(idPedido));
    if (affected === 0) {
      return res
        .status(404)
        .json({
          mensaje: "No se pudo cancelar (no existe o no está pendiente)",
        });
    }
    res.json({ mensaje: "Pedido cancelado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al cancelar el pedido" });
  }
}
