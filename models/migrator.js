import migrationRunner from "node-pg-migrate";
import database from "infra/database.js";
import { resolve } from "node:path";

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

async function withDatabaseClient(handler) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    return await handler(dbClient);
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  return await withDatabaseClient(
    async (dbClient) =>
      await migrationRunner(getMigrationOptions(dbClient, false)),
  );
}

async function listPendingMigrations() {
  return await withDatabaseClient(
    async (dbClient) => await migrationRunner(getMigrationOptions(dbClient)),
  );
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
