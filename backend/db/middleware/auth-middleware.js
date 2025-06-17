const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  // ✅ Allow preflight CORS requests
  if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ error: "Access denied: No token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "secret");
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send({ error: "Invalid token" });
  }
}

function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).send({ error: "Forbidden: Admin only" });
  }
}

module.exports = { verifyToken, isAdmin };
