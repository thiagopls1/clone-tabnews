import database from "infra/database.js";
import { InternalServerError } from "infra/errors";

export default async function status(request, response) {
  try {
    const maxConnectionsResult = await database.query("SHOW max_connections;");
    const maxConnections = maxConnectionsResult.rows[0].max_connections;

    const databaseVersionResult = await database.query("SHOW server_version;");
    const databaseVersion = databaseVersionResult.rows[0].server_version;

    const databaseName = process.env.POSTGRES_DB;
    const openedConnectionsResult = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName],
    });
    const openedConnections = openedConnectionsResult.rows[0].count;

    const updatedAt = new Date().toISOString();

    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: databaseVersion,
          max_connections: parseInt(maxConnections),
          opened_connections: openedConnections,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });
    console.log("\nErro dentro do catch do controller:");
    console.error(publicErrorObject);
    response.status(500).json(publicErrorObject);
  }
}
