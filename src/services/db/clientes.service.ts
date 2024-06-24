import { prisma } from "../../objects/prisma.object";

export const srvInsertarCliente = async (cliente: any) => {
  const clienteCreado = await prisma.clientes.create({
    data: cliente,
  });

  return clienteCreado;
};

export const srvObtenerClientes = async () => {
  const clientes = await prisma.clientes.findMany();

  return clientes;
};

export const srvObtenerCliente = async (cliente_id: number) => {
  const cliente = await prisma.clientes.findUnique({
    where: {
      cliente_id,
    },
  });

  return cliente;
};

export const srvObtenerClienteWhatsapp = async (whatsappNumber: string) => {
  const cliente = await prisma.clientes.findUnique({
    where: {
      whatsappNumber,
    },
  });

  return cliente;
};

export const srvActualizarCliente = async (
  cliente_id: number,
  cliente: any
) => {
  const clienteActualizado = await prisma.clientes.update({
    where: {
      cliente_id,
    },
    data: cliente,
  });

  return clienteActualizado;
};

export const srvEliminarCliente = async (cliente_id: number) => {
  const clienteEliminado = await prisma.clientes.delete({
    where: {
      cliente_id,
    },
  });

  return clienteEliminado;
};
