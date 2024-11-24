const path = require("path");
const prisma = require("../database/db.config");

async function whereIsUser(req, res, next) {
  try {
    // Retrieve the uid cookie
    const user_session_id = req.cookies?.uid;

    // If no session cookie, redirect to login
    if (!user_session_id) {
      if (req.originalUrl !== "/api/auth/login") {
        return res.sendFile(
          path.join(__dirname, "../public/pages/auth/index.html")
        );
      }
      return next();
    }

    // Check if session exists in the database
    const session = await prisma.session.findUnique({
      where: { sessionId: user_session_id },
    });

    // If session does not exist or is expired, redirect to login
    if (!session || new Date(session.expiresAt) < new Date()) {
      if (req.originalUrl !== "/api/auth/login") {
        return res.sendFile(
          path.join(__dirname, "../public/pages/auth/index.html")
        );
      }
      return next();
    }

    // Session is valid, redirect to home if the user is on the login page
    if (req.originalUrl === "/api/auth/login") {
      return res.sendFile(path.join(__dirname, "../public/index.html"));
    }

    // Attach user info to the request and proceed
    req.user = await prisma.user.findUnique({
      where: { id: session.userId },
    });
    next();
  } catch (error) {
    console.error("Error in whereIsUser middleware:", error);
    res.status(500).send("An error occurred. Please try again later.");
  }
}

module.exports = { whereIsUser };
