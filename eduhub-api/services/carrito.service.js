import pool from "../config/db.js";


const db = pool.promise();//API de promise

// Retorna el id_carrito del usuario o null si no existe 
export async function findCarritoByUsuario(idUsuario) {
  const [rows] = await db.execute(
    "SELECT id_carrito FROM carrito WHERE id_usuario = ? ORDER BY id_carrito DESC LIMIT 1",
    [idUsuario]
  );
  return rows[0]?.id_carrito || null;
}

// Crea un carrito y retorna su id 
export async function createCarrito(idUsuario) {
  const [res] = await db.execute(
    "INSERT INTO carrito (id_usuario) VALUES (?)",
    [idUsuario]
  );
  return res.insertId;
}

// Asegura que el usuario tenga un carrito; si no, lo crea y retorna id_carrito 
export async function ensureCarritoForUsuario(idUsuario) {
  const existente = await findCarritoByUsuario(idUsuario);
  if (existente) return existente;
  return await createCarrito(idUsuario);
}

// Verificar que el curso exista 
export async function assertCursoExiste(idCurso) {
  const [rows] = await db.execute(
    "SELECT id_curso FROM curso WHERE id_curso = ? AND activo = 1",
    [idCurso]
  );
  if (rows.length === 0) {
    throw new Error("El curso no existe o está inactivo");
  }
}

// Agregar un curso al carrito del usuario evitando duplicados 
export async function addCursoToCarrito(idUsuario, idCurso) {
  await assertCursoExiste(idCurso);
  const idCarrito = await ensureCarritoForUsuario(idUsuario);

  // validar si ya existe
  const [dup] = await db.execute(
    "SELECT id_item FROM item_carrito WHERE id_carrito = ? AND id_curso = ?",
    [idCarrito, idCurso]
  );
  if (dup.length > 0) {
    return {
      inserted: false,
      reason: "duplicado",
      id_carrito: idCarrito,
      id_item: dup[0].id_item,
    };
  }

  const [ins] = await db.execute(
    "INSERT INTO item_carrito (id_carrito, id_curso) VALUES (?, ?)",
    [idCarrito, idCurso]
  );
  return { inserted: true, id_carrito: idCarrito, id_item: ins.insertId };
}

// Retorna el contenido del carrito del usuario con info de cursos
export async function getCarritoByUsuario(idUsuario) {
  const [rows] = await db.execute(
    `SELECT c.id_carrito,
            i.id_item,
            i.id_curso,
            cu.nombre   AS curso,
            cu.precio   AS precio,
            i.fecha_agregado
       FROM carrito c
  LEFT JOIN item_carrito i ON i.id_carrito = c.id_carrito
  LEFT JOIN curso        cu ON cu.id_curso = i.id_curso
      WHERE c.id_usuario = ?
   ORDER BY i.fecha_agregado DESC`,
    [idUsuario]
  );
  return rows; // puede venir vacío si aún no hay carrito o si no tiene items
}

// Elimina un curso específico del carrito (por id_carrito + id_curso) 
export async function removeCursoFromCarrito(idCarrito, idCurso) {
  const [res] = await db.execute(
    "DELETE FROM item_carrito WHERE id_carrito = ? AND id_curso = ?",
    [idCarrito, idCurso]
  );
  return { affected: res.affectedRows };
}

// Vacía el carrito del usuario (elimina todos los items) 
export async function clearCarritoByUsuario(idUsuario) {
  const idCarrito = await findCarritoByUsuario(idUsuario);
  if (!idCarrito) return { affected: 0, message: "No hay carrito" };

  const [res] = await db.execute(
    "DELETE FROM item_carrito WHERE id_carrito = ?",
    [idCarrito]
  );
  return { affected: res.affectedRows };
}
