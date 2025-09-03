// middleware/requireAuth.js
import jwt from "jsonwebtoken";


const { JWT_SECRET } = process.env;

export function requireAuth(req, res, next) {
  if (req.method === "OPTIONS") return next();

  const auth = req.headers.authorization || "";
  const [scheme, token] = auth.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Token requerido" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}
