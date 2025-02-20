import { Client } from "pg";

async function query(queryObj) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryObj);
    return result;
  } catch (error) {
    console.log("\nErro dentro do catch do database.js:");
    console.error(error);
    throw error;
  } finally {
    await client?.end();
  }
}

function getSSLValues() {
  if (process.env.POSTGRES_CA)
    return {
      ca: process.env.POSTGRES_CA,
    };

  return process.env.NODE_ENV === "production";
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: getSSLValues(),
  });
  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;
