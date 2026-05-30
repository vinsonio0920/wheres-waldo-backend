import { prisma } from "../lib/prisma.js";

async function getSessionQuery(sessionId) {
  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
  });

  return session;
}

export { getSessionQuery };
