// src/controllers/auth.controller.js
import * as authService from "../services/auth.service.js";

/**
 * POST /api/v1/auth/login
 * Body: { correo, contrasena }
 * Respuesta: { access_token, refresh_token, user }
 */
export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body || {};

    if (!correo || !contrasena) {
      return res
        .status(400)
        .json({ error: "correo y contrasena son requeridos" });
    }

    const usuario = await authService.findUserByEmail(correo);
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    authService.ensureActiveUser(usuario);

    const ok = await authService.verifyPassword(contrasena, usuario.contrasena);
    if (!ok) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const access_token = authService.generateAccessToken(usuario);
    const refresh_token = authService.generateRefreshToken(usuario);

    return res.json({
      access_token,
      refresh_token,
      user: authService.publicUser(usuario),
    });
  } catch (err) {
    console.error("[auth.login] ->", err);
    return res.status(err.status || 500).json({
      error: err.message || "Error en login",
    });
  }
};

/**
 * POST /api/v1/auth/refresh
 * Body: { refresh_token }
 * Respuesta: { access_token }
 */
export const refresh = async (req, res) => {
  try {
    const { refresh_token } = req.body || {};
    if (!refresh_token) {
      return res.status(400).json({ error: "refresh_token requerido" });
    }

    const payload = authService.verifyRefreshToken(refresh_token);

    const usuario = await authService.findUserById(payload.id_usuario);
    if (!usuario) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    authService.ensureActiveUser(usuario);

    const access_token = authService.generateAccessToken(usuario);

    return res.json({ access_token });
  } catch (err) {
    console.error("[auth.refresh] ->", err);

    return res.status(401).json({ error: "Refresh token inválido o expirado" });
  }
};
