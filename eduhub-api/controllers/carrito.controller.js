import {
  addCursoToCarrito,
  getCarritoByUsuario,
  removeCursoFromCarrito,
  clearCarritoByUsuario,
  findCarritoByUsuario,
} from "../services/carrito.service.js";

// agregar curso al carrito dle usuario POST /api/v1/carrito/agregar  Body: { id_usuario, id_curso } 
export async function agregarCursoAlCarrito(req, res) {
  try {
    const { id_usuario, id_curso } = req.body;
    if (!id_usuario || !id_curso) {
      return res
        .status(400)
        .json({
          error: "Faltan campos: id_usuario e id_curso son obligatorios",
        });
    }

    const result = await addCursoToCarrito(
      Number(id_usuario),
      Number(id_curso)
    );
    if (result.inserted) {
      return res.status(201).json({
        mensaje: "Curso agregado al carrito",
        id_carrito: result.id_carrito,
        id_item: result.id_item,
      });
    }
    return res.status(200).json({
      mensaje: "El curso ya estaba en el carrito",
      id_carrito: result.id_carrito,
      id_item: result.id_item,
    });
  } catch (err) {
    console.error("agregarCursoAlCarrito error:", err);
    res.status(500).json({ error: "Error al agregar curso al carrito" });
  }
}

// obtener carrito del usuario GET /api/v1/carrito/:idUsuario 
export async function obtenerCarritoPorUsuario(req, res) {
  try {
    const { idUsuario } = req.params;
    const rows = await getCarritoByUsuario(Number(idUsuario));

    if (rows.length === 0) {
      // Puede no haber carrito o estar vacío
      return res.json({
        id_usuario: Number(idUsuario),
        id_carrito: await findCarritoByUsuario(Number(idUsuario)), 
        items: [],
        totalCursos: 0,
        totalPrecio: 0,
      });
    }

    const id_carrito = rows[0].id_carrito || null;
    const items = rows
      .filter((r) => r.id_item) 
      .map((r) => ({
        id_item: r.id_item,
        id_curso: r.id_curso,
        curso: r.curso,
        precio: Number(r.precio || 0),
        fecha_agregado: r.fecha_agregado,
      }));

    const totalPrecio = items.reduce((acc, it) => acc + (it.precio || 0), 0);

    res.json({
      id_usuario: Number(idUsuario),
      id_carrito,
      items,
      totalCursos: items.length,
      totalPrecio,
    });
  } catch (err) {
    console.error("obtenerCarritoPorUsuario error:", err);
    res.status(500).json({ error: "Error al obtener carrito" });
  }
}

// eliminar un curso del carritp  DELETE /api/v1/carrito/:idCarrito/curso/:idCurso   (idCarrito y idCurso)
export async function eliminarCursoDelCarrito(req, res) {
  try {
    const { idCarrito, idCurso } = req.params;
    const { affected } = await removeCursoFromCarrito(
      Number(idCarrito),
      Number(idCurso)
    );
    if (affected === 0) {
      return res
        .status(404)
        .json({ mensaje: "El curso no estaba en el carrito" });
    }
    res.json({ mensaje: "Curso eliminado del carrito" });
  } catch (err) {
    console.error("eliminarCursoDelCarrito error:", err);
    res.status(500).json({ error: "Error al eliminar curso del carrito" });
  }
}

// varciar carrito DELETE /api/v1/carrito/vaciar/:idUsuario   (idUsuario)
export async function vaciarCarrito(req, res) {
  try {
    const { idUsuario } = req.params;
    const { affected } = await clearCarritoByUsuario(Number(idUsuario));
    res.json({
      mensaje:
        affected > 0
          ? "Carrito vaciado correctamente"
          : "No había items en el carrito",
      eliminados: affected,
    });
  } catch (err) {
    console.error("vaciarCarrito error:", err);
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
}
