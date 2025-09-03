// routes/usuario.routes.js
import { Router } from "express";
import {
  listarUsuarios,
  obtenerUsuario,
  crearUsuarioCtrl,
  actualizarUsuarioCtrl,
  eliminarUsuarioCtrl,
  bloquearUsuario,
  desbloquearUsuario,
} from "../controllers/usuario.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.post("/", crearUsuarioCtrl);
router.use(requireAuth);

router.get("/", listarUsuarios);
router.get("/:id", obtenerUsuario);

router.put("/:id", actualizarUsuarioCtrl);
router.delete("/:id", eliminarUsuarioCtrl);

// seguridad
router.patch("/:id/bloquear", bloquearUsuario);
router.patch("/:id/desbloquear", desbloquearUsuario);

export default router;
