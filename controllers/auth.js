const prisma = require("../database/db.config");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { setUser } = require("../service/auth");

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

    // Set user in server map and send a cookie to browser
    setUser(user_session_id, user);
    res.cookie("uid", user_session_id, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    const user_role = user.role;
    return res.status(200).json({ message: "Successfull", user_role });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

module.exports = {
  register,
  login,
};
