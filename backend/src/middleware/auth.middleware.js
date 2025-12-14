const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch full user to get role, attached to request
    // We need to require User model here, but standard is to keep middleware lightweight?
    // However, since adminMiddleware checks req.user.role, we MUST have role here.
    // The previous implementation of adminMiddleware assumed req.user.role exists. 
    // BUT jwt payload usually only has userId.
    
    // BETTER FIX: Import User and findById
    const User = require("../models/User"); 
    const user = await User.findById(decoded.userId);
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
