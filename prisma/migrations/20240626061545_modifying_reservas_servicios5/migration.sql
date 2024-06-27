/*
  Warnings:

  - You are about to alter the column `duracion_en_horas` on the `ReservasServicios` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "ReservasServicios" ALTER COLUMN "duracion_en_horas" SET DATA TYPE DOUBLE PRECISION;
