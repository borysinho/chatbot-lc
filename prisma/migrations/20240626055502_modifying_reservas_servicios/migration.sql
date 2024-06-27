/*
  Warnings:

  - Made the column `venta_id` on table `ReservasServicios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cliente_id` on table `ReservasServicios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `servicio_id` on table `ReservasServicios` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ReservasServicios" ALTER COLUMN "venta_id" SET NOT NULL,
ALTER COLUMN "cliente_id" SET NOT NULL,
ALTER COLUMN "servicio_id" SET NOT NULL;
