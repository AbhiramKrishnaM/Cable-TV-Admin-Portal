import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User, IUser } from "../models/User";
import { generateToken } from "../utils/jwt";

// User signup
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role = "user" } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message:
          existingUser.email === email
            ? "Email already registered"
            : "Username already taken",
      });
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Remove password from response
    const userWithoutPassword = user.toObject();
    const { password: _, ...userData } = userWithoutPassword;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userData,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during registration",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// User signin
export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Check if account is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Remove password from response
    const userWithoutPassword = user.toObject();
    const { password: _, ...userData } = userWithoutPassword;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: userData,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get current user profile
export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // User is already attached to req by auth middleware
    const user = (req as any).user;

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Change password
export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user._id;

    // Get user with password
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
      return;
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Logout (client-side token removal)
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};
