import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Vercel önizleme (demo) modu: derleme sırasında oluşturulan örnek veritabanı
 * yazılabilir /tmp klasörüne kopyalanır. Değişiklikler kalıcı değildir.
 */
function demoDatabaseUrl(): string | undefined {
  if (!process.env.VERCEL || process.env.DATABASE_URL?.startsWith("postgres")) return undefined;
  const target = "/tmp/demo.db";
  try {
    if (!fs.existsSync(target)) {
      const source = path.join(process.cwd(), "prisma", "demo.db");
      if (fs.existsSync(source)) fs.copyFileSync(source, target);
    }
  } catch {
    return undefined;
  }
  return `file:${target}`;
}

function createClient() {
  const url = demoDatabaseUrl();
  return url ? new PrismaClient({ datasources: { db: { url } } }) : new PrismaClient();
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
