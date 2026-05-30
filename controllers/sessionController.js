import { getSessionQuery } from "./db/session.js";

async function getSession(sessionId) {
  const sessions = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
  });

  return sessions;
}

export { getSession };
