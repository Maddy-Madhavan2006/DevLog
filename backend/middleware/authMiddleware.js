const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  // 🔐 GET TOKEN
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {

    // ✅ VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ✅ STORE USER DATA
    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware;