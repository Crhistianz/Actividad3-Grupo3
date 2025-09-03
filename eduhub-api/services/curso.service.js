import pool from "../config/db.js";

export const getAllCursos = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM curso WHERE activo = true", (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

export const getCursoById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM curso WHERE id_curso = ?",
      [id],
      (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      }
    );
  });
};

export const createCurso = (curso) => {
  const { nombre, descripcion, precio, id_categoria } = curso;
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO curso (nombre, descripcion, precio, id_categoria, activo) VALUES (?, ?, ?, ?, true)",
      [nombre, descripcion, precio, id_categoria],
      (err, results) => {
        if (err) reject(err);
        else resolve({ id_curso: results.insertId, ...curso });
      }
    );
  });
};

export const updateCurso = (id, curso) => {
  const { nombre, descripcion, precio, id_categoria } = curso;
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE curso SET nombre = ?, descripcion = ?, precio = ?, id_categoria = ? WHERE id_curso = ?",
      [nombre, descripcion, precio, id_categoria, id],
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      }
    );
  });
};

export const deleteCurso = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE curso SET activo = false WHERE id_curso = ?",
      [id],
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      }
    );
  });
};
