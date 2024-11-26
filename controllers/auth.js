const prisma = require("../database/db.config");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { setUser, removeUser } = require("../service/auth");

const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      return res
        .status(400)
        .json({ message: "A User Exists with same email and password" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const new_user = await prisma.user.create({
      data: {
        fullName: fullName,
        email: email,
        password: hashedPassword,
      },
    });

    return res.status(200).json({ message: "User Created", new_user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid Creditionals" });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      return res.status(404).json({ message: "Invalid Creditionals" });
    }

    // Generate session Id
    const user_session_id = uuidv4();

    // Store the session in the database
    await setUser(user_session_id, user);

    // Set cookie with the session ID
    res.cookie("uid", user_session_id, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
    });

    return res.status(200).json({
      message: "Successful",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

const logout = async (req, res) => {
  try {
    // Get the session ID from the cookie
    const sessionId = req.cookies.uid;

    if (!sessionId) {
      return res.status(401).json({ message: "No active session" });
    }

    // Remove the session from the database
    await removeUser(sessionId);

    // Clear the session cookie
    res.clearCookie("uid", {
      httpOnly: true,
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred during logout. Please try again later.",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
};
