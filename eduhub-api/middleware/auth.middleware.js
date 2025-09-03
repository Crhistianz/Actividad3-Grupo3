// middleware/auth.middleware.js
import { verifyToken } from "../config/auth.js";

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token)
    return res.status(401).json({ error: "Token requerido" });

  try {
    req.user = verifyToken(token); // { id_usuario, email, rol, iat, exp }
    next();
  } catch (e) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};
