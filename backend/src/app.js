const express = require("express");
const authRoutes = require("./routes/auth.routes");
const authMiddleware = require("./middleware/auth.middleware");
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({status : "ok"});
})

app.get("/protected", authMiddleware, (req, res) => {
    res.status(200).json({ message: "Access granted", user: req.user });
});

app.use("/api/auth", authRoutes);

module.exports = app;