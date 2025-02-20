import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import controller from "infra/controller";

const router = createRouter();
router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  await withDatabaseClient(async (dbClient) => {
    const migratedMigrations = await migrationRunner(
      getMigrationOptions(dbClient, false),
    );
    const statusCode = migratedMigrations.length > 0 ? 201 : 200;
    response.status(statusCode).json(migratedMigrations);
  });
}

async function getHandler(request, response) {
  await withDatabaseClient(async (dbClient) => {
    const pendingMigrations = await migrationRunner(
      getMigrationOptions(dbClient),
    );
    response.status(200).json(pendingMigrations);
  });
}

async function withDatabaseClient(handler) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    return await handler(dbClient);
  } finally {
    await dbClient?.end();
  }
}

function getMigrationOptions(dbClient, dryRun = true) {
  return {
    dbClient,
    databaseUrl: process.env.DATABASE_URL,
    dryRun,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgMigrations",
  };
}
