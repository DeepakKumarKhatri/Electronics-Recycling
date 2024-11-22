const { getUser } = require("../service/auth");
const path = require("path");

async function verifyUserSession(req, res, next) {
  const user_session_id = req.cookies?.uid;
  console.log("user_session_id: ", user_session_id);

  if (!user_session_id) {
    return res.sendFile(
      path.join(__dirname, "../public/pages/auth/index.html")
    );
  }

  const user = await getUser(user_session_id);
  if (!user) {
    return res.sendFile(
      path.join(__dirname, "../public/pages/auth/index.html")
    );
  }
  req.user = user;
  next();
}

module.exports = {
  verifyUserSession,
};
