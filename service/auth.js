const prisma = require("../database/db.config");

async function setUser(sessionId, user) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 1); // Set expiration to 1 day

  // Remove all previous sessions for the user
  await prisma.session.deleteMany({
    where: { userId: user.id },
  });

  // Create the new session
  await prisma.session.create({
    data: {
      userId: user.id,
      sessionId,
      expiresAt,
    },
  });
}

async function getUser(sessionId) {
  const session = await prisma.session.findUnique({
    where: { sessionId },
    include: { user: true },
  });

  // Check if session is expired
  if (!session || new Date() > session.expiresAt) {
    if (session) {
      await prisma.session.delete({ where: { sessionId } }); // Clean up expired sessions
    }
    return null;
  }

  return session.user;
}

module.exports = {
  setUser,
  getUser,
};
