/*
  Warnings:

  - You are about to alter the column `precio` on the `Productos` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Productos" ALTER COLUMN "precio" SET DATA TYPE DOUBLE PRECISION;
