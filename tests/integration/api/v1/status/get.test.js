import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous User", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      // Expect date to be valid
      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toBe(parsedUpdatedAt);

      // Expect default values to version and max connections database
      expect(responseBody.dependencies.database.max_connections).toBe(100);
      expect(responseBody.dependencies.database.version).toBe("16.0");
      expect(responseBody.dependencies.database.opened_connections).toBe(1);
    });
  });
});
