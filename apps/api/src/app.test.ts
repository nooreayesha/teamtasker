import { afterAll, describe, expect, it } from "vitest";
import { buildApp } from "./app.js";
import { createPrisma } from "./db.js";
import { loadEnv } from "./env.js";

describe("GET /health", () => {
  it("reports the process is alive without needing a database", async () => {
    const app = await buildApp();
    const response = await app.inject({ method: "GET", url: "/health" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok" });
    await app.close();
  });

  it("sends security headers", async () => {
    const app = await buildApp();
    const response = await app.inject({ method: "GET", url: "/health" });
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    await app.close();
  });
});

describe("GET /health/ready", () => {
  it("returns 503 when no database is configured", async () => {
    const app = await buildApp();
    const response = await app.inject({ method: "GET", url: "/health/ready" });
    expect(response.statusCode).toBe(503);
    await app.close();
  });

  // Needs a real database, so it only runs when DATABASE_URL is set (e.g. locally).
  describe.skipIf(!process.env.DATABASE_URL)("with a database", () => {
    const prisma = createPrisma();
    afterAll(() => prisma.$disconnect());

    it("returns 200 when the database is reachable", async () => {
      const app = await buildApp({ prisma });
      const response = await app.inject({ method: "GET", url: "/health/ready" });
      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ status: "ok", database: "up" });
      await app.close();
    });
  });
});

describe("loadEnv", () => {
  it("applies defaults", () => {
    const env = loadEnv({ DATABASE_URL: "postgresql://u:p@localhost:5432/db" });
    expect(env.PORT).toBe(3000);
    expect(env.NODE_ENV).toBe("development");
  });

  it("rejects a missing or invalid DATABASE_URL with a clear message", () => {
    expect(() => loadEnv({})).toThrow(/DATABASE_URL/);
    expect(() => loadEnv({ DATABASE_URL: "not a url" })).toThrow(/DATABASE_URL/);
  });
});
