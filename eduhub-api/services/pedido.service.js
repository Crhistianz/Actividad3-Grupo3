import pool from "../config/db.js";
import axios from "axios";

const db = pool.promise(); // API promise

// Crea un pedido desde el carrito del usuario y vacía el carrito (transacción/pago)
export async function crearPedidoDesdeCarrito(idUsuario) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1) Traer items del carrito con precios
    const [items] = await conn.execute(
      `SELECT c.id_carrito, i.id_item, i.id_curso, cu.precio
         FROM carrito c
         JOIN item_carrito i ON i.id_carrito = c.id_carrito
         JOIN curso cu       ON cu.id_curso   = i.id_curso
        WHERE c.id_usuario = ?`,
      [idUsuario]
    );

    if (items.length === 0) {
      await conn.rollback();
      throw new Error("El carrito está vacío");
    }

    const idCarrito = items[0].id_carrito;
    const total = items.reduce((sum, it) => sum + Number(it.precio || 0), 0);

    //  Insertar cabecera de pedido (estado 'pendiente' por defecto)
    const [ins] = await conn.execute(
      "INSERT INTO pedido (id_usuario, total) VALUES (?, ?)",
      [idUsuario, total]
    );
    const idPedido = ins.insertId;

    //  Insertar detalles
    const values = items.map((it) => [idPedido, it.id_curso, it.precio]);
    await conn.query(
      "INSERT INTO detalle_pedido (id_pedido, id_curso, subtotal) VALUES ?",
      [values]
    );

    //  Vaciar carrito
    await conn.execute("DELETE FROM item_carrito WHERE id_carrito = ?", [
      idCarrito,
    ]);

    await conn.commit();
    try {
      const [urows] = await conn.execute(
        "SELECT nombre, correo FROM usuario WHERE id_usuario = ? LIMIT 1",
        [idUsuario]
      );
      const cliente = {
        id: idUsuario,
        nombre: urows[0]?.nombre || "Cliente",
        correo: urows[0]?.correo || "",
      };

      await axios.post(
        `${process.env.RT_BASE_URL}/api/v1/notificacion/pedido`,
        { pedidoId: idPedido, cliente, total },
        { headers: { "x-api-key": process.env.RT_INTERNAL_API_KEY } }
      );
    } catch (e) {
      console.error("[rt] No se pudo notificar a tiempo real:", e.message);
    }

    return { id_pedido: idPedido, total, cantidad_cursos: items.length };
  } catch (err) {
    try {
      await conn.rollback();
    } catch {}
    throw err;
  } finally {
    conn.release();
  }
}

// Pedidos actuales (pendientes) por usuario
export async function obtenerPedidosActualesPorUsuario(idUsuario) {
  const [rows] = await db.execute(
    `SELECT p.id_pedido, p.fecha, p.total, p.estado,
            c.nombre AS curso, dp.subtotal
       FROM pedido p
       JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
       JOIN curso c          ON dp.id_curso  = c.id_curso
      WHERE p.id_usuario = ? AND p.estado = 'pendiente'
   ORDER BY p.fecha DESC, p.id_pedido DESC`,
    [idUsuario]
  );
  return rows;
}

// Pedidos históricos (pagado o cancelado) por usuario
export async function obtenerPedidosHistoricosPorUsuario(idUsuario) {
  const [rows] = await db.execute(
    `SELECT p.id_pedido, p.fecha, p.total, p.estado,
            c.nombre AS curso, dp.subtotal
       FROM pedido p
       JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
       JOIN curso c          ON dp.id_curso  = c.id_curso
      WHERE p.id_usuario = ? AND p.estado IN ('pagado','cancelado')
   ORDER BY p.fecha DESC, p.id_pedido DESC`,
    [idUsuario]
  );
  return rows;
}

// Cancelar pedido (solo si está 'pendiente')
export async function cancelarPedido(idPedido) {
  const [res] = await db.execute(
    "UPDATE pedido SET estado = 'cancelado' WHERE id_pedido = ? AND estado = 'pendiente'",
    [idPedido]
  );
  return { affected: res.affectedRows };
}
