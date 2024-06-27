/*
  Warnings:

  - You are about to drop the column `cantidad` on the `ReservasServicios` table. All the data in the column will be lost.
  - Added the required column `duracion_en_horas` to the `ReservasServicios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReservasServicios" DROP COLUMN "cantidad",
ADD COLUMN     "duracion_en_horas" DECIMAL(10,2) NOT NULL;
