import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import Fastify, { type FastifyInstance } from "fastify";
import type { PrismaClient } from "./db.js";

export interface AppOptions {
  prisma?: PrismaClient;
  corsOrigin?: string;
  logger?: boolean;
}

export async function buildApp(options: AppOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({ logger: options.logger ?? false });

  await app.register(helmet);
  await app.register(cors, { origin: options.corsOrigin ?? false, credentials: true });

  // Liveness: the process is up. Does not touch the database.
  app.get("/health", async () => ({ status: "ok" }));

  // Readiness: the process can reach the database.
  app.get("/health/ready", async (_request, reply) => {
    if (!options.prisma) {
      return reply.code(503).send({ status: "unavailable", database: "not configured" });
    }
    try {
      await options.prisma.$queryRaw`SELECT 1`;
      return { status: "ok", database: "up" };
    } catch {
      return reply.code(503).send({ status: "unavailable", database: "down" });
    }
  });

  return app;
}
