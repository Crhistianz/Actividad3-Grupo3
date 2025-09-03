import * as categoriaService from "../services/categoria.service.js";

export const getAll = (req, res) => {
  categoriaService
    .getAllCategorias()
    .then((categorias) => res.json(categorias))
    .catch((err) => {
      console.error("Error al obtener categorías:", err);
      res.status(500).json({ error: "Error al obtener categorías" });
    });
};

export const getById = (req, res) => {
  const id = req.params.id;
  categoriaService
    .getCategoriaById(id)
    .then((categoria) => {
      if (!categoria)
        res.status(404).json({ error: "Categoría no encontrada" });
      else res.json(categoria);
    })
    .catch((err) =>
      res.status(500).json({ error: "Error al obtener categoría" })
    );
};

export const create = (req, res) => {
  const nuevaCategoria = req.body;
  categoriaService
    .createCategoria(nuevaCategoria)
    .then((categoria) => res.status(201).json(categoria))
    .catch((err) => {
      console.error("Error al crear categoría:", err); // 
      res.status(500).json({ error: "Error al crear categoría" });
    });
};

export const update = (req, res) => {
  const id = req.params.id;
  const categoria = req.body;
  categoriaService
    .updateCategoria(id, categoria)
    .then(() => res.json({ mensaje: "Categoría actualizada correctamente" }))
    .catch((err) =>
      res.status(500).json({ error: "Error al actualizar categoría" })
    );
};

export const remove = (req, res) => {
  const id = req.params.id;
  categoriaService
    .deleteCategoria(id)
    .then(() => res.json({ mensaje: "Categoría eliminada correctamente" }))
    .catch((err) =>
      res.status(500).json({ error: "Error al eliminar categoría" })
    );
};
