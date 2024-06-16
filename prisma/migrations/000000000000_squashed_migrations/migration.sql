-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'assistant');

-- CreateEnum
CREATE TYPE "PendienteAprobadaRechazada_enum" AS ENUM ('Pendiente', 'Aprobada', 'Rechazada');

-- CreateEnum
CREATE TYPE "PendienteConfirmadaCancelada_enum" AS ENUM ('Pendiente', 'Confirmada', 'Cancelada');

-- CreateEnum
CREATE TYPE "PendienteEnProcesoCompletadaCancelada_enum" AS ENUM ('Pendiente', 'En Proceso', 'Completada', 'Cancelada');

-- CreateEnum
CREATE TYPE "ProductoServicio_enum" AS ENUM ('Producto', 'Servicio');

-- CreateEnum
CREATE TYPE "ProductoServicioPaquete_enum" AS ENUM ('Producto', 'Servicio', 'Paquete');

-- CreateTable
CREATE TABLE "Documents" (
    "document_id" SERIAL NOT NULL,
    "ref_id" INTEGER NOT NULL,
    "clase" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "embedding" vector(500),

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("document_id")
);

-- CreateTable
CREATE TABLE "ChatEmbeddings" (
    "descripcion" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "embedding" vector(500),
    "chat_id" INTEGER NOT NULL,
    "cliente_id" INTEGER NOT NULL,

    CONSTRAINT "ChatEmbeddings_pkey" PRIMARY KEY ("chat_id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "chat_id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL,
    "cliente_id" INTEGER NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("chat_id")
);

-- CreateTable
CREATE TABLE "Clientes" (
    "cliente_id" SERIAL NOT NULL,
    "nombre" VARCHAR(255),
    "email" VARCHAR(255),
    "telefono" VARCHAR(20),
    "direccion" TEXT,
    "fecha_registro" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "whatsappNumber" TEXT NOT NULL,
    "profileName" TEXT NOT NULL,

    CONSTRAINT "Clientes_pkey" PRIMARY KEY ("cliente_id")
);

-- CreateTable
CREATE TABLE "Cotizaciones" (
    "cotizacion_id" SERIAL NOT NULL,
    "cliente_id" INTEGER,
    "fecha_cotizacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,
    "estatus" "PendienteAprobadaRechazada_enum" DEFAULT 'Pendiente',

    CONSTRAINT "Cotizaciones_pkey" PRIMARY KEY ("cotizacion_id")
);

-- CreateTable
CREATE TABLE "DetallesCotizaciones" (
    "detalle_cotizacion_id" SERIAL NOT NULL,
    "cotizacion_id" INTEGER NOT NULL,
    "tipo_item" "ProductoServicioPaquete_enum" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "paquete_id" INTEGER,
    "producto_id" INTEGER,
    "servicio_id" INTEGER,

    CONSTRAINT "DetallesCotizaciones_pkey" PRIMARY KEY ("detalle_cotizacion_id")
);

-- CreateTable
CREATE TABLE "DetallesProduccionDemandada" (
    "detalle_produccion_id" SERIAL NOT NULL,
    "produccion_id" INTEGER,
    "producto_id" INTEGER,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "DetallesProduccionDemandada_pkey" PRIMARY KEY ("detalle_produccion_id")
);

-- CreateTable
CREATE TABLE "DetallesVentas" (
    "detalle_venta_id" SERIAL NOT NULL,
    "venta_id" INTEGER NOT NULL,
    "tipo_item" "ProductoServicioPaquete_enum" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "paquete_id" INTEGER,
    "producto_id" INTEGER,
    "servicio_id" INTEGER,

    CONSTRAINT "DetallesVentas_pkey" PRIMARY KEY ("detalle_venta_id")
);

-- CreateTable
CREATE TABLE "DisponibilidadGeneral" (
    "disponibilidad_id" SERIAL NOT NULL,
    "tipo_item" "ProductoServicio_enum" NOT NULL,
    "fecha" DATE NOT NULL,
    "cantidad_disponible" INTEGER NOT NULL,
    "producto_id" INTEGER,
    "servicio_id" INTEGER,

    CONSTRAINT "DisponibilidadGeneral_pkey" PRIMARY KEY ("disponibilidad_id")
);

-- CreateTable
CREATE TABLE "ElementosPaquetes" (
    "elemento_paquete_id" SERIAL NOT NULL,
    "paquete_id" INTEGER NOT NULL,
    "tipo_elemento" "ProductoServicio_enum" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "producto_id" INTEGER,
    "servicio_id" INTEGER,

    CONSTRAINT "ElementosPaquetes_pkey" PRIMARY KEY ("elemento_paquete_id")
);

-- CreateTable
CREATE TABLE "Paquetes" (
    "paquete_id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "moneda" VARCHAR(3) DEFAULT 'BS',
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Paquetes_pkey" PRIMARY KEY ("paquete_id")
);

-- CreateTable
CREATE TABLE "ProduccionDemandada" (
    "produccion_id" SERIAL NOT NULL,
    "venta_id" INTEGER,
    "fecha_solicitud" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_entrega" DATE,
    "estatus" "PendienteEnProcesoCompletadaCancelada_enum" DEFAULT 'Pendiente',

    CONSTRAINT "ProduccionDemandada_pkey" PRIMARY KEY ("produccion_id")
);

-- CreateTable
CREATE TABLE "Productos" (
    "producto_id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "moneda" VARCHAR(3) DEFAULT 'BS',
    "stock" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Productos_pkey" PRIMARY KEY ("producto_id")
);

-- CreateTable
CREATE TABLE "ReservasServicios" (
    "reserva_id" SERIAL NOT NULL,
    "venta_id" INTEGER,
    "cliente_id" INTEGER,
    "servicio_id" INTEGER,
    "fecha" DATE,
    "hora" TIME(6),
    "cantidad" INTEGER NOT NULL,
    "estatus" "PendienteConfirmadaCancelada_enum" DEFAULT 'Pendiente',

    CONSTRAINT "ReservasServicios_pkey" PRIMARY KEY ("reserva_id")
);

-- CreateTable
CREATE TABLE "Servicios" (
    "servicio_id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "tarifa" DECIMAL(10,2) NOT NULL,
    "moneda" VARCHAR(3) DEFAULT 'BS',
    "duracion_en_horas" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Servicios_pkey" PRIMARY KEY ("servicio_id")
);

-- CreateTable
CREATE TABLE "Ventas" (
    "venta_id" SERIAL NOT NULL,
    "cliente_id" INTEGER,
    "fecha_venta" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,
    "cotizacion_id" INTEGER,

    CONSTRAINT "Ventas_pkey" PRIMARY KEY ("venta_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Clientes_email_key" ON "Clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Clientes_whatsappNumber_key" ON "Clientes"("whatsappNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DisponibilidadGeneral_tipo_item_producto_id_servicio_id_fec_key" ON "DisponibilidadGeneral"("tipo_item", "producto_id", "servicio_id", "fecha");

-- AddForeignKey
ALTER TABLE "ChatEmbeddings" ADD CONSTRAINT "ChatEmbeddings_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("chat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatEmbeddings" ADD CONSTRAINT "ChatEmbeddings_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("cliente_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("cliente_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cotizaciones" ADD CONSTRAINT "Cotizaciones_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("cliente_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DetallesCotizaciones" ADD CONSTRAINT "DetallesCotizaciones_cotizacion_id_fkey" FOREIGN KEY ("cotizacion_id") REFERENCES "Cotizaciones"("cotizacion_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DetallesCotizaciones" ADD CONSTRAINT "DetallesCotizaciones_paquete_id_fkey" FOREIGN KEY ("paquete_id") REFERENCES "Paquetes"("paquete_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DetallesCotizaciones" ADD CONSTRAINT "DetallesCotizaciones_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Productos"("producto_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DetallesCotizaciones" ADD CONSTRAINT "DetallesCotizaciones_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "Servicios"("servicio_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DetallesProduccionDemandada" ADD CONSTRAINT "DetallesProduccionDemandada_produccion_id_fkey" FOREIGN KEY ("produccion_id") REFERENCES "ProduccionDemandada"("produccion_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DetallesProduccionDemandada" ADD CONSTRAINT "DetallesProduccionDemandada_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Productos"("producto_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DetallesVentas" ADD CONSTRAINT "DetallesVentas_venta_id_fkey" FOREIGN KEY ("venta_id") REFERENCES "Ventas"("venta_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DetallesVentas" ADD CONSTRAINT "DetallesVentas_paquete_id_fkey" FOREIGN KEY ("paquete_id") REFERENCES "Paquetes"("paquete_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DetallesVentas" ADD CONSTRAINT "DetallesVentas_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Productos"("producto_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DetallesVentas" ADD CONSTRAINT "DetallesVentas_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "Servicios"("servicio_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DisponibilidadGeneral" ADD CONSTRAINT "DisponibilidadGeneral_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Productos"("producto_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DisponibilidadGeneral" ADD CONSTRAINT "DisponibilidadGeneral_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "Servicios"("servicio_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ElementosPaquetes" ADD CONSTRAINT "ElementosPaquetes_paquete_id_fkey" FOREIGN KEY ("paquete_id") REFERENCES "Paquetes"("paquete_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ElementosPaquetes" ADD CONSTRAINT "ElementosPaquetes_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Productos"("producto_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ElementosPaquetes" ADD CONSTRAINT "ElementosPaquetes_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "Servicios"("servicio_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProduccionDemandada" ADD CONSTRAINT "ProduccionDemandada_venta_id_fkey" FOREIGN KEY ("venta_id") REFERENCES "Ventas"("venta_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ReservasServicios" ADD CONSTRAINT "ReservasServicios_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("cliente_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ReservasServicios" ADD CONSTRAINT "ReservasServicios_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "Servicios"("servicio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ReservasServicios" ADD CONSTRAINT "ReservasServicios_venta_id_fkey" FOREIGN KEY ("venta_id") REFERENCES "Ventas"("venta_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Ventas" ADD CONSTRAINT "Ventas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("cliente_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Ventas" ADD CONSTRAINT "Ventas_cotizacion_id_fkey" FOREIGN KEY ("cotizacion_id") REFERENCES "Cotizaciones"("cotizacion_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

