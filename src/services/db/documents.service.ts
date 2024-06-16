import prisma from "../../objects/prisma.object";
import pgvector from "pgvector";

export type TDocuments = {
  document_id?: number;
  ref_id: number;
  clase: string;
  descripcion: string;
  embedding: number[];
};

export const srvEliminarDocumentos = async () => {
  const count = await prisma.documents.deleteMany();
  console.log("Documentos eliminados: ", count.count);
  return count;
};

export const srvInsertarDocumento = async (documentos: TDocuments[]) => {
  let count = 0;
  for (const documento of documentos) {
    count +=
      await prisma.$executeRaw`INSERT INTO "Documents" (ref_id, clase, descripcion, embedding) VALUES (${documento.ref_id}, ${documento.clase}, ${documento.descripcion}, ${documento.embedding}::vector)`;
  }
  return count;
};

const limit: number = parseInt(process.env.DOCUMENTS_SEARCH_LIMIT || "4");

export const srvObtenerDocumentos = async (documento: number[]) => {
  const embedding = pgvector.toSql(documento);
  const similitudes: TDocuments[] =
    await prisma.$queryRaw`SELECT document_id, ref_id, clase, descripcion, embedding::text FROM "Documents" ORDER BY embedding <-> ${embedding}::vector LIMIT ${limit}`;

  return similitudes;
};
