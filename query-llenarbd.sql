
USE eduhubultimo;

-- Usuarios
INSERT INTO usuario (nombre, correo, contrasena, rol, activo) VALUES
('Omar', 'omar@example.com', '123456', 'cliente', TRUE),
('Victor', 'victor@example.com', '123456', 'cliente', TRUE),
('Juan', 'juan@example.com', '123456', 'cliente', TRUE),
('Christian', 'christian@example.com', '123456', 'cliente', TRUE);

-- Categorías
INSERT INTO categoria (nombre, descripcion, activo) VALUES
('Programación', 'Cursos de desarrollo de software', TRUE),
('Diseño', 'Cursos de diseño gráfico y UX/UI', TRUE),
('Marketing', 'Cursos de marketing digital y estrategias', TRUE),
('Negocios', 'Emprendimiento y gestión empresarial', TRUE),
('Idiomas', 'Cursos para aprender nuevos idiomas', TRUE);

-- Cursos 
INSERT INTO curso (nombre, descripcion, precio, popularidad, id_categoria, activo) VALUES
('JavaScript Básico', 'Aprende los fundamentos de JavaScript.', 89.90, 8, 1, TRUE),
('React Avanzado', 'Construcción de apps con React.', 129.90, 9, 1, TRUE),
('Diseño UX/UI', 'Principios de diseño centrado en el usuario.', 99.50, 7, 2, TRUE),
('Photoshop para Principiantes', 'Edición de imágenes con Adobe Photoshop.', 79.00, 6, 2, TRUE),
('Marketing en Redes Sociales', 'Publicidad efectiva en Instagram y Facebook.', 85.00, 7, 3, TRUE),
('SEO y Posicionamiento Web', 'Optimiza sitios para Google.', 110.00, 8, 3, TRUE),
('Plan de Negocios', 'Aprende a construir tu plan empresarial.', 95.00, 5, 4, TRUE),
('Liderazgo y Gestión', 'Habilidades gerenciales clave.', 120.00, 6, 4, TRUE),
('Inglés Básico', 'Curso introductorio de inglés.', 70.00, 7, 5, TRUE),
('Inglés Intermedio', 'Conversación y gramática intermedia.', 90.00, 6, 5, TRUE),
('Python para Data Science', 'Análisis de datos con Python.', 130.00, 10, 1, TRUE),
('Node.js desde Cero', 'Backend con JavaScript moderno.', 105.00, 7, 1, TRUE);

-- Exámenes de prueba
INSERT INTO examen (id_curso, titulo, descripcion) VALUES
(1, 'Examen Final - JavaScript Básico', 'Evalúa tus conocimientos de JS básico.'),
(3, 'Evaluación UX/UI', 'Comprueba tu comprensión sobre diseño.'),
(5, 'Examen de Marketing Digital', 'Preguntas de redes sociales y SEO.');

-- Preguntas para examen 1
INSERT INTO pregunta (id_examen, texto, tipo) VALUES
(1, '¿Qué es una variable en JavaScript?', 'opcion_multiple'),
(1, '¿Cómo se declara una función?', 'opcion_multiple');

-- Respuestas para las preguntas del examen 1
INSERT INTO respuesta (id_pregunta, texto, es_correcta) VALUES
(1, 'Una caja para guardar datos', TRUE),
(1, 'Un archivo del navegador', FALSE),
(1, 'Una etiqueta HTML', FALSE),

(2, 'function miFuncion() {}', TRUE),
(2, 'crearFuncion() => {}', FALSE),
(2, '<function>', FALSE);

-- Resultados examen 
INSERT INTO resultado_examen (id_usuario, id_examen, puntuacion) VALUES
(1, 1, 80),
(2, 1, 90),
(3, 3, 85);





--  CURSOS VISTOS 
INSERT INTO curso_visto (id_usuario, id_curso) VALUES
(1, 1),
(1, 2),
(2, 5),
(3, 3);

/*
-- --- PEDIDOS --------------
 Usuario 1: 1 pendiente, 1 pagado
 Usuario 2: 1 pagado, 1 cancelado
 Usuario 3: 1 pendiente, 1 cancelado
*/

-- Tabla pedido
INSERT INTO pedido (id_usuario, total, estado) VALUES
(1, 219.80, 'pendiente'),   -- cursos 1 y 2
(1, 110.00, 'pagado'),      -- curso 6
(2, 165.00, 'pagado'),      -- cursos 5 y 4
(2, 90.00, 'cancelado'),    -- curso 10
(3, 99.50, 'pendiente'),    -- curso 3
(3, 120.00, 'cancelado');   -- curso 8

-- Tabla detalle_pedido
INSERT INTO detalle_pedido (id_pedido, id_curso, subtotal) VALUES
(1, 1, 89.90),
(1, 2, 129.90),
(2, 6, 110.00),
(3, 5, 85.00),
(3, 4, 80.00),
(4, 10, 90.00),
(5, 3, 99.50),
(6, 8, 120.00);

/*
-------------- CARRITO -----------
-- Usuario 4 tiene un carrito activo con dos cursos
*/


INSERT INTO carrito (id_usuario) VALUES
(4); 

-- Tabla item_carrito
INSERT INTO item_carrito (id_carrito, id_curso) VALUES
(1, 7),
(1, 9);


