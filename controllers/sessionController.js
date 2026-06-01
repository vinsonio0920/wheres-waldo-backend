import { getSessionQuery } from "../db/session.js";

async function getSession(sessionId) {
  const sessions = await getSessionQuery(sessionId);

  return sessions;
}

export { getSession };
