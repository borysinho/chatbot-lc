/*
  Warnings:

  - You are about to drop the `DetallesProduccionDemandada` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProduccionDemandada` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DetallesProduccionDemandada" DROP CONSTRAINT "DetallesProduccionDemandada_produccion_id_fkey";

-- DropForeignKey
ALTER TABLE "DetallesProduccionDemandada" DROP CONSTRAINT "DetallesProduccionDemandada_producto_id_fkey";

-- DropForeignKey
ALTER TABLE "ProduccionDemandada" DROP CONSTRAINT "ProduccionDemandada_venta_id_fkey";

-- DropTable
DROP TABLE "DetallesProduccionDemandada";

-- DropTable
DROP TABLE "ProduccionDemandada";
