/*
  Warnings:

  - You are about to drop the column `cotizacion_id` on the `Ventas` table. All the data in the column will be lost.
  - You are about to alter the column `total` on the `Ventas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - Made the column `cliente_id` on table `Ventas` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Ventas" DROP CONSTRAINT "Ventas_cotizacion_id_fkey";

-- AlterTable
ALTER TABLE "Ventas" DROP COLUMN "cotizacion_id",
ALTER COLUMN "cliente_id" SET NOT NULL,
ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION;
