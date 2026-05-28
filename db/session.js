import { prisma } from "../lib/prisma";

async function getSessionQuery(sessionId) {
  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
  });

  return session;
}
