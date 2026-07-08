import retry from "async-retry";
import { faker } from "@faker-js/faker";

import database from "infra/database.js";
import migrator from "models/migrator.js";
import user from "models/user.js";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    await retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
      onRetry: (error, attempt) => {
        console.log(
          `⛔ Attempt ${attempt} - Failed to fetch /api/v1/status: ${error.message}`,
        );
      },
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (!response.ok) {
        throw Error(`HTTP error ${response.status} while testing Web Server`);
      }
    }
  }
}

async function clearDatabase() {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function createUser(userObject) {
  const parsedUserObject = userObject || {};
  return await user.create({
    username:
      parsedUserObject.username ||
      faker.internet.username().replace(/[_.-]/g, ""),
    email: parsedUserObject.email || faker.internet.email(),
    password: parsedUserObject.password || "senhaValida",
  });
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
};

export default orchestrator;
