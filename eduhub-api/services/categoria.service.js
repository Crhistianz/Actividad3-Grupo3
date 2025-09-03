import pool from "../config/db.js";

export const getAllCategorias = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM categoria WHERE activo = true",
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      }
    );
  });
};

export const getCategoriaById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM categoria WHERE id_categoria = ?",
      [id],
      (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      }
    );
  });
};

export const createCategoria = (categoria) => {
  const { nombre, descripcion } = categoria;
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO categoria (nombre, descripcion, activo) VALUES (?, ?, true)",
      [nombre, descripcion],
      (err, results) => {
        if (err) reject(err);
        else resolve({ id_categoria: results.insertId, ...categoria });
      }
    );
  });
};

export const updateCategoria = (id, categoria) => {
  const { nombre, descripcion } = categoria;
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE categoria SET nombre = ?, descripcion = ? WHERE id_categoria = ?",
      [nombre, descripcion, id],
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      }
    );
  });
};

export const deleteCategoria = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE categoria SET activo = false WHERE id_categoria = ?",
      [id],
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      }
    );
  });
};
