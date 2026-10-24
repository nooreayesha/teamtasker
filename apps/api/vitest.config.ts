import { defineConfig } from "vitest/config";

// Load apps/api/.env for local runs; in CI the variables come from the environment.
try {
  process.loadEnvFile(".env");
} catch {
  // No .env file: fine.
}

export default defineConfig({
  test: { environment: "node" },
});
