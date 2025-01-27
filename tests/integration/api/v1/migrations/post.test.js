import fs from "node:fs";
import { join } from "node:path";
import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await cleanDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous User", () => {
    describe("Running pending migrations", () => {
      const migrationsFiles = fs.readdirSync(join("infra", "migrations"));
      const migrationsCount = migrationsFiles.length;

      test("For the first time", async () => {
        // First Request
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response.status).toBe(201);
        const response1Body = await response.json();
        expect(Array.isArray(response1Body)).toBe(true);
        expect(response1Body.length).toBe(migrationsCount);
      });

      test("For the second time", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBe(migrationsCount - 1);
      });
    });
  });
});

async function cleanDatabase() {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}
