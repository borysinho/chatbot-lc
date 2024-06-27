/*
  Warnings:

  - You are about to drop the `DisponibilidadGeneral` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DisponibilidadGeneral" DROP CONSTRAINT "DisponibilidadGeneral_producto_id_fkey";

-- DropForeignKey
ALTER TABLE "DisponibilidadGeneral" DROP CONSTRAINT "DisponibilidadGeneral_servicio_id_fkey";

-- DropTable
DROP TABLE "DisponibilidadGeneral";
