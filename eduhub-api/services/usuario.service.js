// services/usuario.service.js
import pool from "../config/db.js";
import bcrypt from "bcryptjs";

const db = () => pool.promise();

const stripPassword = (u) => {
  if (!u) return null;
  const { contrasena, ...rest } = u;
  return rest;
};

export const getAllUsuarios = async () => {
  const [rows] = await db().query(
    "SELECT id_usuario, nombre, correo, rol, activo, fecha_registro FROM usuario"
  );
  return rows;
};

export const getUsuarioById = async (id) => {
  const [rows] = await db().query(
    "SELECT * FROM usuario WHERE id_usuario=? LIMIT 1",
    [id]
  );
  return stripPassword(rows[0] || null);
};


export const getUsuarioByEmail = async (correo) => {
  const [rows] = await db().query(
    "SELECT * FROM usuario WHERE correo=? LIMIT 1",
    [correo]
  );
  return rows[0] || null;
};

export const createUsuario = async ({
  nombre,
  correo,
  contrasena,
  rol = "cliente",
  activo = 1,
}) => {
  const hash = await bcrypt.hash(contrasena, 10);
  const [r] = await db().query(
    "INSERT INTO usuario (nombre, correo, contrasena, rol, activo) VALUES (?, ?, ?, ?, ?)",
    [nombre, correo, hash, rol, activo ? 1 : 0]
  );
  return await getUsuarioById(r.insertId);
};

export const updateUsuario = async (id, data) => {
  const campos = [];
  const valores = [];

  if (data.nombre !== undefined) {
    campos.push("nombre=?");
    valores.push(data.nombre);
  }
  if (data.correo !== undefined) {
    campos.push("correo=?");
    valores.push(data.correo);
  }
  if (data.rol !== undefined) {
    campos.push("rol=?");
    valores.push(data.rol);
  }
  if (data.activo !== undefined) {
    campos.push("activo=?");
    valores.push(data.activo ? 1 : 0);
  }

  if (data.contrasena !== undefined) {
    const hash = await bcrypt.hash(data.contrasena, 10);
    campos.push("contrasena=?");
    valores.push(hash);
  }

  if (!campos.length) return await getUsuarioById(id);

  valores.push(id);
  await db().query(
    `UPDATE usuario SET ${campos.join(", ")} WHERE id_usuario=?`,
    valores
  );
  return await getUsuarioById(id);
};

export const deleteUsuario = async (id) => {
  const [r] = await db().query("DELETE FROM usuario WHERE id_usuario=?", [id]);
  return { affectedRows: r.affectedRows };
};

export const setUsuarioActivo = async (id, activo) => {
  await db().query("UPDATE usuario SET activo=? WHERE id_usuario=?", [
    activo ? 1 : 0,
    id,
  ]);
  return await getUsuarioById(id);
};
