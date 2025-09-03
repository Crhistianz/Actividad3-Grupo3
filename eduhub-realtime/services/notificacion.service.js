import Notificacion from "../schemas/notificacion.schema.js";
export const crearNotificacionPedido = (data) => Notificacion.create(data);
export const marcarLeido = (id) =>
  Notificacion.findByIdAndUpdate(
    id,
    { leido: true, fechaLeido: new Date() },
    { new: true }
  );
export const listarNoLeidos = (canal = "logistica") =>
  Notificacion.find({ canal, leido: false }).sort({ createdAt: -1 });
