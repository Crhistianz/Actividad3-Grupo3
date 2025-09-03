import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const h = req.headers.authorization || "";
  const [type, token] = h.split(" ");
  if (type !== "Bearer" || !token)
    return res.status(401).json({ error: "Token requerido" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "dev_access_secret");
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

export const requireInternalKey = (req, res, next) => {
  const key = req.headers["x-api-key"];
  if (key && key === process.env.INTERNAL_API_KEY) return next();
  return res.status(401).json({ error: "API key inválida" });
};
