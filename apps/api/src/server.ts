import { buildApp } from "./app.js";
import { createPrisma } from "./db.js";
import { loadEnv } from "./env.js";

const env = loadEnv();
const prisma = createPrisma();
const app = await buildApp({ prisma, corsOrigin: env.CORS_ORIGIN, logger: true });

const shutdown = async () => {
  await app.close();
  await prisma.$disconnect();
};
process.on("SIGINT", () => void shutdown().then(() => process.exit(0)));
process.on("SIGTERM", () => void shutdown().then(() => process.exit(0)));

try {
  await app.listen({ port: env.PORT, host: "0.0.0.0" });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
