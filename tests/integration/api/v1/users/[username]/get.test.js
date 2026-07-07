import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous User", () => {
    test("With exact case match", async () => {
      await orchestrator.createUser({
        username: "MesmoCase",
        email: "mesmo.case@hotmail.com",
        password: "senha1234",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/MesmoCase",
      );

      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "MesmoCase",
        email: "mesmo.case@hotmail.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With case mismatch", async () => {
      await orchestrator.createUser({
        username: "CaseDiferente",
        email: "case.diferente@hotmail.com",
        password: "senha1234",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/casediferente",
      );

      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "CaseDiferente",
        email: "case.diferente@hotmail.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With nonexistent user", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/UsuarioInexistente",
      );

      const responseBody = await response.json();

      expect(response.status).toBe(404);
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado.",
        action: "Verifique se o username está digitado corretamente.",
        status_code: 404,
      });
    });
  });
});
