import express from "express";


import { requireAuth } from "./middleware/requireAuth.js";

// Rutas públicas (NO requieren token)
import authRoutes from "./routes/auth.routes.js";

// Rutas de módulos (requieren token)
import cursoRoutes from "./routes/curso.routes.js";
import categoriaRoutes from "./routes/categoria.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import carritoRoutes from "./routes/carrito.routes.js";
import pedidoRoutes from "./routes/pedido.routes.js";

const router = express.Router();

// base: /api/v1

//  Públicas 
router.use("/auth", authRoutes); // /api/v1/auth

//  Protegidas (todo lo que sigue requiere token) 
router.use(requireAuth);

router.use("/usuario", usuarioRoutes); // /api/v1/usuario
router.use("/curso", cursoRoutes); // /api/v1/curso
router.use("/categoria", categoriaRoutes); // /api/v1/categoria
router.use("/carrito", carritoRoutes); // /api/v1/carrito
router.use("/pedido", pedidoRoutes); // /api/v1/pedido

export default router;
