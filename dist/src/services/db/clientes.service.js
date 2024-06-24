"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.srvEliminarCliente = exports.srvActualizarCliente = exports.srvObtenerClienteWhatsapp = exports.srvObtenerCliente = exports.srvObtenerClientes = exports.srvInsertarCliente = void 0;
const prisma_object_1 = require("../../objects/prisma.object");
const srvInsertarCliente = async (cliente) => {
    const clienteCreado = await prisma_object_1.prisma.clientes.create({
        data: cliente,
    });
    return clienteCreado;
};
exports.srvInsertarCliente = srvInsertarCliente;
const srvObtenerClientes = async () => {
    const clientes = await prisma_object_1.prisma.clientes.findMany();
    return clientes;
};
exports.srvObtenerClientes = srvObtenerClientes;
const srvObtenerCliente = async (cliente_id) => {
    const cliente = await prisma_object_1.prisma.clientes.findUnique({
        where: {
            cliente_id,
        },
    });
    return cliente;
};
exports.srvObtenerCliente = srvObtenerCliente;
const srvObtenerClienteWhatsapp = async (whatsappNumber) => {
    const cliente = await prisma_object_1.prisma.clientes.findUnique({
        where: {
            whatsappNumber,
        },
    });
    return cliente;
};
exports.srvObtenerClienteWhatsapp = srvObtenerClienteWhatsapp;
const srvActualizarCliente = async (cliente_id, cliente) => {
    const clienteActualizado = await prisma_object_1.prisma.clientes.update({
        where: {
            cliente_id,
        },
        data: cliente,
    });
    return clienteActualizado;
};
exports.srvActualizarCliente = srvActualizarCliente;
const srvEliminarCliente = async (cliente_id) => {
    const clienteEliminado = await prisma_object_1.prisma.clientes.delete({
        where: {
            cliente_id,
        },
    });
    return clienteEliminado;
};
exports.srvEliminarCliente = srvEliminarCliente;
