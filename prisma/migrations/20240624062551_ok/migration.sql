-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "collection_id" UUID;

-- CreateTable
CREATE TABLE "chat_history" (
    "id" SERIAL NOT NULL,
    "session_id" VARCHAR(255) NOT NULL,
    "message" JSONB NOT NULL,

    CONSTRAINT "chat_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "uuid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR,
    "cmetadata" JSONB,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE INDEX "idx_collections_name" ON "collections"("name");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION;
