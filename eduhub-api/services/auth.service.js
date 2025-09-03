// src/services/auth.service.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import {
  JWT_SECRET,
  JWT_EXPIRES,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES,
} from "../utils/constantes.js";

const db = pool.promise();

export const findUserByEmail = async (correo) => {
  const [rows] = await db.query(
    `SELECT id_usuario, nombre, correo, contrasena, rol, activo
     FROM usuario
     WHERE correo = ?
     LIMIT 1`,
    [correo]
  );
  return rows[0] || null;
};

export const findUserById = async (id) => {
  const [rows] = await db.query(
    `SELECT id_usuario, nombre, correo, contrasena, rol, activo
     FROM usuario
     WHERE id_usuario = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

export const ensureActiveUser = (usuario) => {
  if (!usuario || usuario.activo === 0 || usuario.activo === false) {
    const err = new Error("Usuario bloqueado o inactivo");
    err.status = 403;
    throw err;
  }
};

export const verifyPassword = (plain, hash) => bcrypt.compare(plain, hash);

const toTokenPayload = (usuario) => ({
  id_usuario: usuario.id_usuario,
  correo: usuario.correo,
  rol: usuario.rol,
});

export const generateAccessToken = (usuario) => {
  const payload = toTokenPayload(usuario);
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
};

export const generateRefreshToken = (usuario) => {
  const payload = { id_usuario: usuario.id_usuario };
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES,
  });
};

export const verifyRefreshToken = (refreshToken) =>
  jwt.verify(refreshToken, JWT_REFRESH_SECRET);

export const publicUser = (usuario) => {
  if (!usuario) return null;
  const { contrasena, ...safe } = usuario;
  return safe;
};
