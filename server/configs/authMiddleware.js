const jsonwebtoken = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, resp, next) => {
  const token = req.cookies.token;
  if (!token) {
    return resp
      .status(401)
      .render("partials/error", {
        error: { code: 401, message: "No autorizado para ver este recurso." },
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
        error: { code: 401, message: "No autorizado para ver este recurso." },
      });
  }
};

function isLogged(req) {
  if (req.cookies.token) {
    return true;
  }
  return false;
}

module.exports = { authMiddleware, isLogged };
