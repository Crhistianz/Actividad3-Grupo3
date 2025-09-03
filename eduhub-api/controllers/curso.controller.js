import * as cursoService from "../services/curso.service.js";

// Obtener todos los cursos
export const getAll = (req, res) => {
  cursoService
    .getAllCursos()
    .then((cursos) => res.json(cursos))
    .catch((err) => {
      console.error("X Error al obtener cursos:", err);
      res.status(500).json({ error: "Error al obtener cursos" });
    });
};

// Obtener curso por ID
export const getById = (req, res) => {
  const id = req.params.id;
  cursoService
    .getCursoById(id)
    .then((curso) => {
      if (!curso) {
        res.status(404).json({ error: "Curso no encontrado" });
      } else {
        res.json(curso);
      }
    })
    .catch((err) => {
      console.error("X Error al obtener curso por ID:", err);
      res.status(500).json({ error: "Error al obtener curso" });
    });
};

// Crear un nuevo curso
export const create = (req, res) => {
  const nuevoCurso = req.body;
  cursoService
    .createCurso(nuevoCurso)
    .then((curso) => res.status(201).json(curso))
    .catch((err) => {
      console.error("X Error al crear curso:", err);
      res.status(500).json({ error: "Error al crear curso" });
    });
};

// Actualizar un curso existente
export const update = (req, res) => {
  const id = req.params.id;
  const curso = req.body;
  cursoService
    .updateCurso(id, curso)
    .then(() => {
      res.json({ mensaje: "Curso actualizado correctamente" });
    })
    .catch((err) => {
      console.error("X Error al actualizar curso:", err);
      res.status(500).json({ error: "Error al actualizar curso" });
    });
};

// Eliminar (desactivar) un curso
export const remove = (req, res) => {
  const id = req.params.id;
  cursoService
    .deleteCurso(id)
    .then(() => {
      res.json({ mensaje: "Curso eliminado correctamente" });
    })
    .catch((err) => {
      console.error("X Error al eliminar curso:", err);
      res.status(500).json({ error: "Error al eliminar curso" });
    });
};
