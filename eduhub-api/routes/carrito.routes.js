import { Router } from "express";
import {
  agregarCursoAlCarrito,
  obtenerCarritoPorUsuario,
  eliminarCursoDelCarrito,
  vaciarCarrito,
} from "../controllers/carrito.controller.js";

const router = Router();

// Agregar un curso al carrito
// POST /api/v1/carrito/agregar
router.post("/agregar", agregarCursoAlCarrito);

// Obtener contenido del carrito de un usuario
// GET /api/v1/carrito/:idUsuario
router.get("/:idUsuario", obtenerCarritoPorUsuario);

// Eliminar un curso específico del carrito ( id_carrito)
// DELETE /api/v1/carrito/:idCarrito/curso/:idCurso
router.delete("/:idCarrito/curso/:idCurso", eliminarCursoDelCarrito);

// Vaciar carrito del usuario
// DELETE /api/v1/carrito/vaciar/:idUsuario
router.delete("/vaciar/:idUsuario", vaciarCarrito);

export default router;
