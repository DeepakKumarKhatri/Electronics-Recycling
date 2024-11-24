const prisma = require("../database/db.config");
const { getUser } = require("../service/auth");

const getUserDetails = async (req, res) => {
  try {
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId); // Function to retrieve user data from session
    if (!user) return res.status(401).json({ message: "Session expired" });

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getUserDetails };
