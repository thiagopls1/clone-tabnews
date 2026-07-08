import crypto from "node:crypto";

import database from "infra/database.js";

// 30 dias em millisegundos
const EXPIRIATION_IN_MILLISECONDS = 2592000000;

async function create(userId) {
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + EXPIRIATION_IN_MILLISECONDS);

  const newSession = await runInsertQuery(token, userId, expiresAt);
  return newSession;
}

async function runInsertQuery(token, userId, expiresAt) {
  const results = await database.query({
    text: `
      INSERT INTO
        sessions (token, user_id, expires_at)
      VALUES
        ($1, $2, $3)
      RETURNING
        *
      ;`,
    values: [token, userId, expiresAt],
  });

  return results.rows[0];
}

const session = {
  create,
  EXPIRIATION_IN_MILLISECONDS,
};

export default session;
