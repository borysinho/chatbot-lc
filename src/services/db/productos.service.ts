import test from "node:test";
import prisma from "../../objects/prisma.object";
import pgvector from "pgvector";
import { TDocuments, srvInsertarDocumento } from "./documents.service";

import {
  srvServiciosDescToEmbeddings,
  srvServiciosPrecioToEmbeddings,
} from "./servicios.service";
import {
  Productos,
  // ProductosEmbeddings,
  // ServiciosEmbeddings,
} from "@prisma/client";
import { embeberDocumento } from "../embeddings.service";

export type TProductosEmbeddings = {
  productoembedding_id: number;
  producto_id: number;
  descripcion: string;
  embedding: number[];
};

export const srvInsertarProducto = async (producto: any) => {
  const productoCreado = await prisma.productos.create({
    data: {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
    },
  });

  return productoCreado;
};

export const srvObtenerProductos = async () => {
  const productos = await prisma.productos.findMany({
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

export const srvObtenerProducto = async (producto_id: number) => {
  const producto = await prisma.productos.findUnique({
    where: {
      producto_id,
    },
  });

  return producto;
};

export const srvActualizarProducto = async (
  producto_id: number,
  producto: any
) => {
  const productoActualizado = await prisma.productos.update({
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

export const srvEliminarProducto = async (producto_id: number) => {
  const productoEliminado = await prisma.productos.delete({
    where: {
      producto_id,
    },
  });

  return productoEliminado;
};

export const srvProdDescrToEmbeddings = async () => {
  const productos = await srvObtenerProductos();
  const embeddings = await embeberDocumento(
    "producto-descripcion",
    productos.map((producto) => `${producto.nombre}. ${producto.descripcion}`)
  );

  const productosArray: TDocuments[] = productos.map((producto, i: number) => {
    return {
      ref_id: producto.producto_id,
      clase: "producto-descripcion",
      descripcion: `${producto.nombre}. ${producto.descripcion}`,
      embedding: embeddings.data[i].embedding,
    };
  });

  await srvInsertarDocumento(productosArray);

  return productosArray;
};

export const srvProdPrecioToEmbeddings = async () => {
  const productos = await srvObtenerProductos();
  const embeddings = await embeberDocumento(
    "producto-precio",
    productos.map(
      (producto) =>
        `${producto.nombre}. Costo: ${producto.precio} ${producto.moneda}`
    )
  );

  const productosArray: TDocuments[] = productos.map((producto, i: number) => {
    return {
      ref_id: producto.producto_id,
      clase: "producto-precio",
      descripcion: `${producto.nombre}. Costo: ${producto.precio} ${producto.moneda}`,
      embedding: embeddings.data[i].embedding,
    };
  });

  await srvInsertarDocumento(productosArray);

  return productosArray;
};

export const srvInsertarProductoEmbedding = async (
  productos: {
    producto_id: number;
    descripcion: string;
    embedding: number[];
  }[]
) => {};

export const srvObtenerProductoEmbedding = async (vector: number[]) => {
  const embedding = pgvector.toSql(vector);
  const similitudes: TProductosEmbeddings[] =
    await prisma.$queryRaw`SELECT productoembedding_id, producto_id, descripcion, embedding::text FROM "ProductosEmbeddings" ORDER BY embedding <-> ${embedding}::vector LIMIT 2`;

  return similitudes;
};
