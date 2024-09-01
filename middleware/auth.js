const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secret");
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new Error("Authentication Invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    throw new Error("Authentication Invalid");
  }
};

module.exports = authenticateUser;
