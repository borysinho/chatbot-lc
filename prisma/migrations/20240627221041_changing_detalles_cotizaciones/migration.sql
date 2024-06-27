/*
  Warnings:

  - You are about to alter the column `subtotal` on the `DetallesCotizaciones` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "DetallesCotizaciones" ALTER COLUMN "subtotal" SET DATA TYPE DOUBLE PRECISION;
