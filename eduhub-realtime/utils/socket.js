import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Notificacion from "../schemas/notificacion.schema.js";

let io;
export const getIO = () => io;

export function initSocket(server) {
  io = new Server(server, { cors: { origin: true, credentials: true } });

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        (socket.handshake.headers.authorization || "").split(" ")[1];
      if (!token) return next(new Error("Token requerido"));
      socket.user = jwt.verify(
        token,
        process.env.JWT_SECRET || "dev_access_secret"
      );
      next();
    } catch {
      next(new Error("Token inválido"));
    }
  });

  io.on("connection", (socket) => {
    const { id_usuario, rol } = socket.user || {};
    if (id_usuario) socket.join(`user:${id_usuario}`);
    if (rol) socket.join(`rol:${rol}`);

    socket.on("logistica:pedido-leido", async ({ notificacionId }) => {
      if (!notificacionId) return;
      await Notificacion.findByIdAndUpdate(notificacionId, {
        leido: true,
        fechaLeido: new Date(),
      });
      io.to("rol:logistica").emit("logistica:notificacion-actualizada", {
        notificacionId,
        leido: true,
      });
    });
  });

  return io;
}
