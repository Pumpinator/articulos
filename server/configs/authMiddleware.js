const jsonwebtoken = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "Quetzalcode";

const authMiddleware = (req, resp, next) => {
  const token = req.cookies.token;
  const userId = req.cookies.userId;
  if (!token || !userId) {
    return resp
      .status(401)
      .render("partials/error", {
        error: { code: 401, message: "No autorizado." },
      });
  }
  try {
    const decoded = jsonwebtoken.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return resp
      .status(401)
      .render("partials/error", {
        error: { code: 401, message: "No autorizado." },
      });
  }
};

function isLogged(req) {
  if (req.cookies.token && req.cookies.userId) {
    return true;
  }
  return false;
}

module.exports = { authMiddleware, isLogged };
