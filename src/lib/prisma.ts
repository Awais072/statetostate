import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function initPrismaClient(): PrismaClient {
  let dbUrl = process.env.DATABASE_URL;

  // In Vercel serverless environment (or read-only container)
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = path.join("/tmp", "dev.db");

    // Copy the seeded database template to writable /tmp if it's not already there or is empty
    if (!fs.existsSync(tmpDbPath) || fs.statSync(tmpDbPath).size === 0) {
      const sourceDb = path.join(process.cwd(), "prisma", "dev.db");
      if (fs.existsSync(sourceDb)) {
        try {
          fs.copyFileSync(sourceDb, tmpDbPath);
        } catch (err) {
          console.error("Failed to copy database file to /tmp:", err);
        }
      }
    }

    if (fs.existsSync(tmpDbPath) && fs.statSync(tmpDbPath).size > 0) {
      dbUrl = `file:${tmpDbPath}`;
    }
  }

  if (!dbUrl) {
    const localDb = path.join(process.cwd(), "prisma", "dev.db");
    dbUrl = `file:${localDb}`;
  }

  // Ensure process.env.DATABASE_URL is set so Prisma client internals have it
  process.env.DATABASE_URL = dbUrl;

  return new PrismaClient({
    datasourceUrl: dbUrl,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? initPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
