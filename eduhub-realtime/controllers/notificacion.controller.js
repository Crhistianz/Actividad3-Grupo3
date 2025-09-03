import QRCode from "qrcode";
import { getIO } from "../utils/socket.js";
import * as svc from "../services/notificacion.service.js";

export const nuevoPedido = async (req, res) => {
  try {
    const { pedidoId, cliente, total } = req.body;
    if (!pedidoId || !cliente)
      return res
        .status(400)
        .json({ error: "pedidoId y cliente son requeridos" });

    const doc = await svc.crearNotificacionPedido({
      tipo: "pedido",
      canal: "logistica",
      pedidoId,
      cliente,
      montoTotal: total || 0,
      fecha: new Date(),
    });

    getIO().to("rol:logistica").emit("logistica:nuevo-pedido", {
      _id: doc._id.toString(),
      pedidoId: doc.pedidoId,
      cliente: doc.cliente,
      fecha: doc.fecha,
      montoTotal: doc.montoTotal,
      leido: doc.leido,
    });

    res.status(201).json(doc);
  } catch {
    res.status(500).json({ error: "Error al crear notificación" });
  }
};

export const noLeidos = async (_req, res) => {
  try {
    res.json(await svc.listarNoLeidos("logistica"));
  } catch {
    res.status(500).json({ error: "Error al listar" });
  }
};

export const marcarLeido = async (req, res) => {
  try {
    const up = await svc.marcarLeido(req.params.id);
    if (!up) return res.status(404).json({ error: "No encontrado" });
    getIO()
      .to("rol:logistica")
      .emit("logistica:notificacion-actualizada", {
        notificacionId: up._id.toString(),
        leido: true,
      });
    res.json(up);
  } catch {
    res.status(500).json({ error: "Error al actualizar" });
  }
};

export const generarQR = async (req, res) => {
  try {
    const { pedidoId } = req.params;
    const { clienteId } = req.query;
    const url = `${
      process.env.BASE_URL
    }/api/v1/notificacion/pagar?pedidoId=${pedidoId}&clienteId=${
      clienteId || ""
    }`;
    const dataUrl = await QRCode.toDataURL(url);
    res.json({ url, qr: dataUrl });
  } catch {
    res.status(500).json({ error: "Error al generar QR" });
  }
};

export const confirmarPago = async (req, res) => {
  try {
    const { pedidoId, clienteId } = req.query;
    getIO()
      .to(`user:${clienteId}`)
      .emit("ventas:pago-confirmado", {
        pedidoId: Number(pedidoId),
        fecha: new Date().toISOString(),
      });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Error al confirmar pago" });
  }
};
