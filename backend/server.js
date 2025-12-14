require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

const User = require("./src/models/User");
const bcrypt = require("bcryptjs");

const startServer = async () => {
  await connectDB();

  // Auto-seed Admin User
  const adminEmail = "admin@dorayaki.com";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      await User.create({
          name: "Dorayaki Admin",
          email: adminEmail,
          password: hashedPassword,
          role: "admin"
      });
      console.log("DEFAULT ADMIN CREATED: admin@dorayaki.com / admin123");
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Dorayaki Backend Ready");
    console.log(`Cloudinary Configured: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Yes (' + process.env.CLOUDINARY_CLOUD_NAME + ')' : 'NO (Missing Keys)'}`);
  });
};

startServer();
// Forced Restart Triggered
