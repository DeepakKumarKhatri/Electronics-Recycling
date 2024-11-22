const { getUser } = require("../service/auth");

async function verifyUserSession(req, res, next) {
  const user_session_id = req.cookies?.uid;
  console.log("user_session_id: ",user_session_id);

  if (!user_session_id) {
    return res.redirect("public/index.html");
  }

  const user = getUser(user_session_id);
  if (!user) {
    return res.redirect("index");
  }
  req.user = user;
  next();
}

module.exports = {
  verifyUserSession,
};
