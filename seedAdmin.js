const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const adminExists = await Admin.findOne({ username: "admin" });
    if (adminExists) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const admin = new Admin({
      username: "admin",
      password: "password123", // default password, change in production
    });

    await admin.save();
    console.log("Admin created successfully! Username: admin, Password: password123");
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
