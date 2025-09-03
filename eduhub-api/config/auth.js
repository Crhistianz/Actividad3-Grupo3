
import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  JWT_EXPIRES,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES,
} from "../utils/constantes.js";


const buildAccessPayload = (u) => ({
  id_usuario: u.id_usuario,
  email: u.correo,
  rol: u.rol,
});

export const generateToken = (user) =>
  jwt.sign(buildAccessPayload(user), JWT_SECRET, { expiresIn: JWT_EXPIRES });

export const generateRefreshToken = (user) =>
  jwt.sign({ id_usuario: user.id_usuario }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES,
  });

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);
export const verifyRefreshToken = (token) =>
  jwt.verify(token, JWT_REFRESH_SECRET);
