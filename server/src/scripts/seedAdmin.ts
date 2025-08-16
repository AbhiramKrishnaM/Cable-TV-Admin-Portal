import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/cabletv"
    );
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash("Admin123!", saltRounds);

    const adminUser = await User.create({
      username: "admin",
      email: "admin@cabletv.com",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("Admin user created successfully:");
    console.log(`Username: ${adminUser.username}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Role: ${adminUser.role}`);
    console.log("Default password: Admin123!");
    console.log("Please change this password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdminUser();
