import { PrismaClient } from "@prisma/client";
// import { Sql } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

import fs from "fs";

const mySeed = async () => {
  const sqls = fs
    .readFileSync("./prisma/seed.sql")
    .toString()
    .split("\n")
    .filter((line) => line.indexOf("--") !== 0)
    .join("\n")
    .replace(/(\r\n|\n|\r)/gm, " ") // remove newlines
    .replace(/\s+/g, " ") // excess white space
    .split(";");

  for (const sql of sqls) {
    // console.log({ sql: sql.toString() });
    await prisma.$executeRawUnsafe(sql);
  }
};

mySeed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
