
-- DROP DATABASE eduhubultimo;


CREATE DATABASE IF NOT EXISTS eduhubultimo;
USE eduhubultimo;

-- 1. Tabla usuario
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(100) UNIQUE,
    contrasena VARCHAR(255),
    rol ENUM('cliente', 'admin') DEFAULT 'cliente',
    activo TINYINT DEFAULT 1,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion TEXT,
    activo TINYINT DEFAULT 1
);


CREATE TABLE curso (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion TEXT,
    precio DECIMAL(10,2),
    popularidad INT DEFAULT 0,
    id_categoria INT,
    activo TINYINT DEFAULT 1,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);


CREATE TABLE pedido (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2),
    estado ENUM('pendiente', 'pagado', 'cancelado') DEFAULT 'pendiente',
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);


CREATE TABLE detalle_pedido (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT,
    id_curso INT,
    subtotal DECIMAL(10,2),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_curso) REFERENCES curso(id_curso)
);






CREATE TABLE carrito (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE item_carrito (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_carrito INT,
    id_curso INT,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_carrito) REFERENCES carrito(id_carrito),
    FOREIGN KEY (id_curso) REFERENCES curso(id_curso)
);



CREATE TABLE curso_visto (
    id_usuario INT,
    id_curso INT,
    fecha_visto TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario, id_curso),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_curso) REFERENCES curso(id_curso)
);



CREATE TABLE examen (
    id_examen INT AUTO_INCREMENT PRIMARY KEY,
    id_curso INT,
    titulo VARCHAR(100),
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_curso) REFERENCES curso(id_curso)
);

CREATE TABLE pregunta (
    id_pregunta INT AUTO_INCREMENT PRIMARY KEY,
    id_examen INT,
    texto TEXT,
    tipo ENUM('opcion_multiple', 'verdadero_falso', 'abierta'),
    FOREIGN KEY (id_examen) REFERENCES examen(id_examen)
);


CREATE TABLE respuesta (
    id_respuesta INT AUTO_INCREMENT PRIMARY KEY,
    id_pregunta INT,
    texto TEXT,
    es_correcta TINYINT DEFAULT 0,
    FOREIGN KEY (id_pregunta) REFERENCES pregunta(id_pregunta)
);


CREATE TABLE resultado_examen (
    id_resultado INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_examen INT,
    puntuacion INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_examen) REFERENCES examen(id_examen)
);
