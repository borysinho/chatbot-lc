/*
  Warnings:

  - Made the column `fecha` on table `ReservasServicios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hora` on table `ReservasServicios` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ReservasServicios" ALTER COLUMN "fecha" SET NOT NULL,
ALTER COLUMN "hora" SET NOT NULL;
