const express = require("express");
const authRoutes = require("./routes/auth.routes");
const authMiddleware = require("./middleware/auth.middleware");
const sweetRoutes = require("./routes/sweet.routes");
const adminMiddleware = require("./middleware/admin.middleware");
const cors = require("cors");
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({status : "ok"});
})

app.get("/protected", authMiddleware, (req, res) => {
    res.status(200).json({ message: "Access granted", user: req.user });
});

app.get("/admin-only", authMiddleware, adminMiddleware, (req, res) => {
    res.status(200).json({message: "Admin access granted"});
})

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);

module.exports = app;