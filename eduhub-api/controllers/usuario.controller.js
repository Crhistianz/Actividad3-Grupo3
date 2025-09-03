// controllers/usuario.controller.js
import {
  getAllUsuarios,
  getUsuarioById,
  getUsuarioByEmail,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  setUsuarioActivo,
} from "../services/usuario.service.js";

export const listarUsuarios = async (_req, res) => {
  try {
    res.json(await getAllUsuarios());
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const obtenerUsuario = async (req, res) => {
  try {
    const u = await getUsuarioById(req.params.id);
    if (!u) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(u);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

export const crearUsuarioCtrl = async (req, res) => {
  try {
    const { nombre, correo, contrasena, rol, activo } = req.body;
    if (!nombre || !correo || !contrasena)
      return res
        .status(400)
        .json({ error: "nombre, correo y contrasena son requeridos" });

    const existe = await getUsuarioByEmail(correo);
    if (existe) return res.status(409).json({ error: "El correo ya existe" });

    const nuevo = await createUsuario({
      nombre,
      correo,
      contrasena,
      rol,
      activo,
    });
    res.status(201).json(nuevo);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

export const actualizarUsuarioCtrl = async (req, res) => {
  try {
    const u = await updateUsuario(req.params.id, req.body);
    if (!u) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(u);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

export const eliminarUsuarioCtrl = async (req, res) => {
  try {
    const r = await deleteUsuario(req.params.id);
    if (!r.affectedRows)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ mensaje: "Usuario eliminado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

export const bloquearUsuario = async (req, res) => {
  try {
    const u = await setUsuarioActivo(req.params.id, false);
    if (!u) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ mensaje: "Usuario bloqueado", usuario: u });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al bloquear usuario" });
  }
};

export const desbloquearUsuario = async (req, res) => {
  try {
    const u = await setUsuarioActivo(req.params.id, true);
    if (!u) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ mensaje: "Usuario desbloqueado", usuario: u });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al desbloquear usuario" });
  }
};
