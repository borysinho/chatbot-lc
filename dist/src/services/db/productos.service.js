"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.srvObtenerProductoEmbedding = exports.srvInsertarProductoEmbedding = exports.srvProdPrecioToText = exports.srvProdDescrToText = exports.srvProdNombreToText = exports.srvEliminarProducto = exports.srvActualizarProducto = exports.srvObtenerProducto = exports.srvObtenerProductos = exports.srvInsertarProducto = void 0;
const prisma_object_1 = require("../../objects/prisma.object");
const pgvector_1 = __importDefault(require("pgvector"));
const srvInsertarProducto = async (producto) => {
    const productoCreado = await prisma_object_1.prisma.productos.create({
        data: {
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            stock: producto.stock,
        },
    });
    return productoCreado;
};
exports.srvInsertarProducto = srvInsertarProducto;
const srvObtenerProductos = async () => {
    const productos = await prisma_object_1.prisma.productos.findMany({
        select: {
            producto_id: true,
            nombre: true,
            descripcion: true,
            precio: true,
            moneda: true,
        },
    });
    return productos;
};
exports.srvObtenerProductos = srvObtenerProductos;
const srvObtenerProducto = async (producto_id) => {
    const producto = await prisma_object_1.prisma.productos.findUnique({
        where: {
            producto_id,
        },
    });
    return producto;
};
exports.srvObtenerProducto = srvObtenerProducto;
const srvActualizarProducto = async (producto_id, producto) => {
    const productoActualizado = await prisma_object_1.prisma.productos.update({
        where: {
            producto_id,
        },
        data: {
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            stock: producto.stock,
        },
    });
    return productoActualizado;
};
exports.srvActualizarProducto = srvActualizarProducto;
const srvEliminarProducto = async (producto_id) => {
    const productoEliminado = await prisma_object_1.prisma.productos.delete({
        where: {
            producto_id,
        },
    });
    return productoEliminado;
};
exports.srvEliminarProducto = srvEliminarProducto;
const srvProdNombreToText = async () => {
    const productos = await (0, exports.srvObtenerProductos)();
    const productosArray = productos.map((producto) => {
        return {
            metadata: {
                tipo: "producto-nombre",
                producto_id: producto.producto_id,
            },
            pageContent: `Producto: ${producto.nombre}`,
        };
    });
    return productosArray;
};
exports.srvProdNombreToText = srvProdNombreToText;
const srvProdDescrToText = async () => {
    const productos = await (0, exports.srvObtenerProductos)();
    const productosArray = productos.map((producto) => {
        return {
            metadata: {
                tipo: "producto-descripcion",
                producto_id: producto.producto_id,
            },
            pageContent: `Producto: ${producto.nombre}, Descripción: ${producto.descripcion}`,
        };
    });
    return productosArray;
};
exports.srvProdDescrToText = srvProdDescrToText;
const srvProdPrecioToText = async () => {
    const productos = await (0, exports.srvObtenerProductos)();
    const productosArray = productos.map((producto, i) => {
        return {
            metadata: { tipo: "producto-precio", producto_id: producto.producto_id },
            pageContent: `Producto: ${producto.nombre}, Precio: ${producto.precio} ${producto.moneda}`,
        };
    });
    return productosArray;
};
exports.srvProdPrecioToText = srvProdPrecioToText;
const srvInsertarProductoEmbedding = async (productos) => { };
exports.srvInsertarProductoEmbedding = srvInsertarProductoEmbedding;
const srvObtenerProductoEmbedding = async (vector) => {
    const embedding = pgvector_1.default.toSql(vector);
    const similitudes = await prisma_object_1.prisma.$queryRaw `SELECT productoembedding_id, producto_id, descripcion, embedding::text FROM "ProductosEmbeddings" ORDER BY embedding <-> ${embedding}::vector LIMIT 2`;
    return similitudes;
};
exports.srvObtenerProductoEmbedding = srvObtenerProductoEmbedding;
